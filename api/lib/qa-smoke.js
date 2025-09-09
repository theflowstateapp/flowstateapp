const { createClient } = require('@supabase/supabase-js');
const { withDbRetry } = require('./retry');
const { getISTToday, getISTTomorrow } = require('./daily-shutdown-ist');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fixed QA workspace ID
const QA_WORKSPACE_ID = 'qa-ws';

// Helper to make internal API calls
async function callInternalAPI(endpoint, method = 'GET', body = null) {
  // Use the production domain for internal calls
  const baseUrl = 'https://theflowstateapp.com';
  const url = `${baseUrl}/api${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-QA-Secret': process.env.QA_SECRET
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  return await response.json();
}

// Helper to record step timing
function recordStep(name, fn) {
  return async () => {
    const start = Date.now();
    try {
      const result = await fn();
      const ms = Date.now() - start;
      return { name, ok: true, ms, details: result };
    } catch (error) {
      const ms = Date.now() - start;
      return { name, ok: false, ms, error: error.message };
    }
  };
}

// Core smoke test logic
module.exports.runSmoke = async function() {
  const startedAt = new Date().toISOString();
  
  try {
    const steps = [];
    const artifacts = {};

    // Step 1: RESET
    steps.push(await recordStep('RESET', async () => {
      const result = await callInternalAPI('/qa/reset', 'POST');
      if (!result.ok) throw new Error('Reset failed');
      return result;
    })());

    // Step 2: SEED
    steps.push(await recordStep('SEED', async () => {
      const result = await callInternalAPI('/qa/seed', 'POST');
      if (!result.ok) throw new Error('Seed failed');
      return result;
    })());

    // Step 3: CAPTURE
    steps.push(await recordStep('CAPTURE', async () => {
      const result = await callInternalAPI('/capture', 'POST', {
        text: 'Book dentist 30m next week @Health #high'
      });
      
      if (!result.success) throw new Error('Capture failed');
      
      const draft = result.draft;
      if (!draft.title || !draft.priority || !draft.estimateMins) {
        throw new Error('Invalid parse result');
      }
      
      return { parsed: draft };
    })());

    // Step 4: PROPOSE (simulate scheduling)
    steps.push(await recordStep('PROPOSE', async () => {
      // For now, create a mock proposal since we don't have the actual endpoint
      const proposal = {
        timeSlot: {
          start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          end: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString() // 2.5 hours from now
        },
        confidence: 0.8
      };
      
      return { proposal };
    })());

    // Step 5: CREATE TASK
    steps.push(await recordStep('CREATE TASK', async () => {
      const taskData = {
        name: 'Book dentist appointment',
        description: 'Schedule dentist appointment for next week',
        priority_matrix: 'Priority 2. High',
        estimated_hours: 0.5,
        deadline_date: getISTTomorrow(),
        life_area_id: 'a-health',
        user_id: QA_WORKSPACE_ID
      };
      
      const { data: task, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (error) throw new Error(`Task creation failed: ${error.message}`);
      
      artifacts.taskId = task.id;
      return { taskId: task.id };
    })());

    // Step 6: START FOCUS
    steps.push(await recordStep('START FOCUS', async () => {
      const focusData = {
        taskId: artifacts.taskId,
        plannedMinutes: 25,
        intention: 'Finish outline'
      };
      
      const result = await callInternalAPI('/focus/start', 'POST', focusData);
      
      if (!result.sessionId) throw new Error('Focus start failed');
      
      artifacts.sessionId = result.sessionId;
      return { sessionId: result.sessionId };
    })());

    // Step 7: STOP FOCUS
    steps.push(await recordStep('STOP FOCUS', async () => {
      const stopData = {
        sessionId: artifacts.sessionId,
        selfRating: 4
      };
      
      const result = await callInternalAPI('/focus/stop', 'POST', stopData);
      
      if (!result.success || result.session.actualMinutes < 1) {
        throw new Error('Focus stop failed or invalid duration');
      }
      
      return { actualMinutes: result.session.actualMinutes };
    })());

    // Step 8: DAY SUMMARY
    steps.push(await recordStep('DAY SUMMARY', async () => {
      const result = await callInternalAPI('/day/summary', 'GET');
      
      if (!result.candidateTasks || result.candidateTasks.length < 1) {
        throw new Error('No candidate tasks found');
      }
      
      return { candidateTasksCount: result.candidateTasks.length };
    })());

    // Step 9: DAILY SHUTDOWN
    steps.push(await recordStep('DAILY SHUTDOWN', async () => {
      const shutdownData = {
        highlights: 'Wrapped outline',
        mood: '🙂'
      };
      
      const result = await callInternalAPI('/day/shutdown', 'POST', shutdownData);
      
      if (!result.success) throw new Error('Daily shutdown failed');
      
      return result;
    })());

    // Step 10: PLAN TOMORROW
    steps.push(await recordStep('PLAN TOMORROW', async () => {
      const planData = {
        taskIds: [artifacts.taskId],
        strategy: 'mornings'
      };
      
      const result = await callInternalAPI('/day/plan', 'POST', planData);
      
      if (!result.success || !result.planned || result.planned.length < 1) {
        throw new Error('Day planning failed');
      }
      
      artifacts.plannedTomorrow = result.planned.length;
      return { plannedCount: result.planned.length };
    })());

    // Step 11: WEEKLY REVIEW
    steps.push(await recordStep('WEEKLY REVIEW', async () => {
      const reviewData = {
        strategy: 'balanced'
      };
      
      const result = await callInternalAPI('/review/plan-next-week', 'POST', reviewData);
      
      if (!result.success) throw new Error('Weekly review failed');
      
      return { scheduled: result.scheduled?.length || 0 };
    })());

    // Step 12: AGENDA VERIFY
    steps.push(await recordStep('AGENDA VERIFY', async () => {
      const today = getISTToday();
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('estimated_hours, time_tracker_start, time_tracker_end')
        .eq('user_id', QA_WORKSPACE_ID)
        .gte('do_date', today)
        .lte('do_date', weekEnd.toISOString().split('T')[0]);
      
      if (error) throw new Error(`Agenda query failed: ${error.message}`);
      
      const scheduledMinutes = tasks?.reduce((sum, task) => {
        if (task.time_tracker_start && task.time_tracker_end) {
          const start = new Date(task.time_tracker_start);
          const end = new Date(task.time_tracker_end);
          return sum + Math.round((end - start) / (1000 * 60));
        }
        return sum + ((task.estimated_hours || 0) * 60);
      }, 0) || 0;
      
      if (scheduledMinutes <= 0) {
        throw new Error('No scheduled minutes found');
      }
      
      artifacts.scheduledThisWeekMin = scheduledMinutes;
      return { scheduledMinutes };
    })());

    const finishedAt = new Date().toISOString();
    const totalMs = new Date(finishedAt) - new Date(startedAt);
    const ok = steps.every(step => step.ok);

    return {
      ok,
      startedAt,
      finishedAt,
      totalMs,
      steps,
      artifacts
    };

  } catch (error) {
    console.error('QA Smoke test error:', error);
    
    const finishedAt = new Date().toISOString();
    const totalMs = new Date(finishedAt) - new Date(startedAt);
    
    return {
      ok: false,
      startedAt,
      finishedAt,
      totalMs,
      error: error.message,
      steps: [],
      artifacts: {}
    };
  }
};
