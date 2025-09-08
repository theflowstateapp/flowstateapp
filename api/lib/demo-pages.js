const { startOfDay, endOfDay, startOfWeek, endOfWeek } = require('date-fns');
const { utcToZonedTime, zonedTimeToUtc } = require('date-fns-tz');
const { supabaseAdmin } = require('./supabase.js');
const { withDbRetry } = require('./retry.js');
const { getCompletedTasksForISTWeek, getCarryOverTasksForISTWeek, getScheduledTotalsForWeek } = require('./demo-metrics.js');
const { getISTWeekBounds, formatISTRange } = require('./time-ist.js');
const { getNextSuggestedWithProposal } = require('./next-suggested.js');

const IST = "Asia/Kolkata";

function resolveDemoPageMeta(page) {
  const map = {
    overview: { path: "demo",           title: "FlowState Demo — Overview" },
    tasks:    { path: "demo/tasks",     title: "FlowState Demo — Tasks" },
    habits:   { path: "demo/habits",    title: "FlowState Demo — Habits" },
    journal:  { path: "demo/journal",   title: "FlowState Demo — Journal" },
    review:   { path: "demo/review",    title: "FlowState Demo — Weekly Review" },
    agenda:   { path: "demo/agenda",    title: "FlowState Demo — Week Agenda" },
    settings: { path: "demo/settings",  title: "FlowState Demo — Settings" }
  };
  const fallback = { path: "demo", title: "FlowState Demo" };
  const chosen = map[page] || fallback;
  return {
    page,
    canonicalPath: `/${chosen.path}`,
    title: chosen.title
  };
}

// Utility functions
const escapeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Helper function to create permalink anchors
const createPermalink = (id, title) => {
  return `<a class="permalink" href="#${id}" aria-label="Link to ${escapeHtml(title)}">#</a>`;
};

// Helper function to create section heading with permalink
const createSectionHeading = (level, id, title, emoji = '') => {
  const emojiSpan = emoji ? `<span aria-hidden="true">${emoji}</span>` : '';
  const permalink = createPermalink(id, title);
  return `<h${level} id="${id}">${emojiSpan}${escapeHtml(title)}${permalink}</h${level}>`;
};

// Demo Layout Component
const DemoLayout = ({ children, title, description, meta }) => {
  const canonicalUrl = `https://theflowstateapp.com${meta.canonicalPath}`;
  const pageTitle = meta.title || title;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="robots" content="index,follow">
    <link rel="canonical" href="${canonicalUrl}">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; line-height: 1.6; }
      .visually-hidden-focusable { position: absolute; left: -9999px; }
      .visually-hidden-focusable:focus { left: 0; background: #fff; padding: 8px; z-index: 1000; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 0; text-align: center; }
      .header h1 { font-size: 2.5rem; margin-bottom: 16px; }
      .header p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 24px; }
      .cta-button { display: inline-block; background: white; color: #667eea; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 8px; }
      .cta-button:hover { background: #f8fafc; }
      .content { padding: 40px 0; }
      .card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .card h2 { margin-top: 0; color: #1e293b; }
      .card h3 { color: #374151; margin-top: 24px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
      .chip { display: inline-block; background: #e2e8f0; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; margin: 2px; }
      .chip.high { background: #fef2f2; color: #dc2626; }
      .chip.medium { background: #fef3c7; color: #d97706; }
      .chip.low { background: #f0fdf4; color: #16a34a; }
      .heatmap { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin: 16px 0; }
      .heatmap-cell { width: 12px; height: 12px; border-radius: 2px; background: #e2e8f0; }
      .heatmap-cell.active { background: #10b981; }
      .calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
      .calendar-day { padding: 8px; border: 1px solid #e2e8f0; border-radius: 4px; min-height: 80px; }
      .calendar-day h4 { margin: 0 0 8px 0; font-size: 0.9rem; color: #64748b; }
      .task-item { background: #f8fafc; padding: 8px; border-radius: 4px; margin: 4px 0; font-size: 0.9rem; }
      .time-window { color: #64748b; font-size: 0.8rem; }
      .error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 16px; border-radius: 8px; margin: 16px 0; }
      .success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; padding: 16px; border-radius: 8px; margin: 16px 0; }
      .permalink { margin-left: 0.5rem; text-decoration: none; opacity: 0.6; color: #64748b; }
      .permalink:focus, .permalink:hover { opacity: 1; text-decoration: underline; }
      table { width: 100%; border-collapse: collapse; margin: 16px 0; }
      th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
      th { background: #f8fafc; font-weight: 600; }
      .footer { background: #1e293b; color: #94a3b8; padding: 40px 0; text-align: center; margin-top: 60px; }
      .footer a { color: #94a3b8; text-decoration: none; }
      .footer a:hover { color: white; }
    </style>
</head>
<body>
    <a href="#main" class="visually-hidden-focusable">Skip to main content</a>
    <header role="banner">
        <div class="header">
            <div class="container">
                <h1>${escapeHtml(title)}</h1>
                <p>${escapeHtml(description)}</p>
                <a href="/api/demo/access?utm_source=demo-${meta.page}" class="cta-button">Open Interactive Demo</a>
                <a href="/api/demo/static" class="cta-button">See Static Preview</a>
            </div>
        </div>
    </header>
    <nav aria-label="Demo navigation">
        <div class="container" style="padding: 16px 20px; background: white; border-bottom: 1px solid #e2e8f0;">
            <a href="/demo" style="margin-right: 20px; color: #64748b; text-decoration: none;">Overview</a>
            <a href="/demo/tasks" style="margin-right: 20px; color: #64748b; text-decoration: none;">Tasks</a>
            <a href="/demo/habits" style="margin-right: 20px; color: #64748b; text-decoration: none;">Habits</a>
            <a href="/demo/journal" style="margin-right: 20px; color: #64748b; text-decoration: none;">Journal</a>
            <a href="/demo/review" style="margin-right: 20px; color: #64748b; text-decoration: none;">Review</a>
            <a href="/demo/agenda" style="margin-right: 20px; color: #64748b; text-decoration: none;">Agenda</a>
            <a href="/demo/settings" style="color: #64748b; text-decoration: none;">Settings</a>
        </div>
    </nav>
    <main id="main" role="main">
        <div class="content">
            <div class="container">
                ${children}
            </div>
        </div>
    </main>
    <footer role="contentinfo">
        <div class="footer">
            <div class="container">
                <p>FlowState Demo - <a href="https://theflowstateapp.com">theflowstateapp.com</a></p>
                <p><small>Build: ${process.env.SITE_BUILD_ID || new Date().toISOString()}</small></p>
            </div>
        </div>
    </footer>
</body>
</html>`;
};

// Data fetching functions
const getDemoWorkspace = async () => {
  try {
    const sb = supabaseAdmin();
    const { data } = await withDbRetry(async () => {
      const result = await sb
        .from('workspaces')
        .select('*')
        .eq('id', 'demo-workspace-1')
        .single();
      return result;
    });
    return data;
  } catch (error) {
    console.warn('DEMO: Using fallback workspace data:', error.message);
    return {
      id: 'demo-workspace-1',
      name: 'Demo Workspace',
      created_at: new Date().toISOString()
    };
  }
};

const getTasksForISTWeek = async (workspaceId) => {
  try {
    const sb = supabaseAdmin();
    const { weekStartUTC, weekEndUTC } = getISTWeekBounds();
    
    const { data } = await withDbRetry(async () => {
      const result = await sb
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('created_at', weekStartUTC.toISOString())
        .lte('created_at', weekEndUTC.toISOString())
        .order('created_at', { ascending: false });
      return result;
    });
    return data || [];
  } catch (error) {
    console.warn('DEMO: Using fallback task data:', error.message);
    return [
      {
        id: '1',
        title: 'Review quarterly goals',
        status: 'COMPLETED',
        priority: 'HIGH',
        context: 'work',
        estimate_mins: 60,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Update project documentation',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        context: 'work',
        estimate_mins: 30,
        created_at: new Date().toISOString()
      }
    ];
  }
};

const getHabitLogs = async (workspaceId) => {
  try {
    const sb = supabaseAdmin();
    const { data } = await withDbRetry(async () => {
      const result = await sb
        .from('habit_logs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('logged_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('logged_at', { ascending: false });
      return result;
    });
    return data || [];
  } catch (error) {
    console.warn('DEMO: Using fallback habit data:', error.message);
    return [];
  }
};

// Demo Page Renderers
async function renderDemoOverviewHTML(meta) {
  try {
    const workspace = await getDemoWorkspace();
    const tasks = await getTasksForISTWeek(workspace.id);
    
    // Get metrics
    const completedTasks = await getCompletedTasksForISTWeek(workspace.id);
    const carryOverTasks = await getCarryOverTasksForISTWeek(workspace.id);
    const scheduledTotals = await getScheduledTotalsForWeek(workspace.id);
    
    // Get next suggested task
    const nextSuggested = await getNextSuggestedWithProposal(workspace.id);
    
    const children = `
      ${createSectionHeading(2, 'dashboard-snapshot', 'Dashboard Snapshot', '📊')}
      <p>Your productivity command center with intelligent insights.</p>
      
      <div class="grid">
        <div class="card">
          ${createSectionHeading(3, 'weekly-metrics', 'This Week\'s Metrics', '📊')}
          <p><strong>Completed:</strong> ${completedTasks.length} tasks</p>
          <p><strong>Carry-overs:</strong> ${carryOverTasks.length} tasks</p>
          <p><strong>Scheduled Hours:</strong> ${scheduledTotals.totalHours}h ${scheduledTotals.totalMinutes}m</p>
        </div>
        
        <div class="card">
          ${createSectionHeading(3, 'next-suggested-task', 'Next Suggested Task', '🎯')}
          ${nextSuggested ? `
            <div class="task-item">
              <strong>${escapeHtml(nextSuggested.task.title)}</strong>
              <div class="time-window">Suggested: ${escapeHtml(nextSuggested.proposal.timeWindow)}</div>
              <p>${escapeHtml(nextSuggested.proposal.rationale)}</p>
            </div>
          ` : '<p>No tasks available for suggestion</p>'}
        </div>
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'tasks-overview', 'Tasks Overview', '📋')}
        <p>Recent tasks from this week</p>
        ${tasks.slice(0, 5).map(task => `
          <div class="task-item">
            <strong>${escapeHtml(task.title)}</strong>
            <span class="chip ${task.priority.toLowerCase()}">${task.priority}</span>
            <span class="chip">${task.context}</span>
            <div class="time-window">${task.estimate_mins} min • ${task.status}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'habits-and-streaks', 'Habits & Streaks', '🔥')}
        <p>Track your daily habits and build consistent routines.</p>
        <div class="heatmap">
          ${Array.from({length: 14}, (_, i) => `<div class="heatmap-cell ${i % 3 === 0 ? 'active' : ''}"></div>`).join('')}
        </div>
        <p><small>Last 2 weeks of habit tracking</small></p>
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'weekly-review-preview', 'Weekly Review Preview', '📝')}
        <p>Plan your next week with intelligent time-boxing.</p>
        <p><strong>This week:</strong> ${completedTasks.length} completed, ${carryOverTasks.length} carry-overs</p>
        <p><strong>Next week focus:</strong> High priority tasks and habit consistency</p>
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'ai-capture-example', 'AI Capture (Read-only example)', '🤖')}
        <p>Try our natural language task capture:</p>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p><em>"Schedule a team meeting for next Tuesday at 2pm about the Q4 planning"</em></p>
          <p><small>→ Automatically creates task with proper scheduling and context</small></p>
        </div>
      </div>
    `;
    
    return DemoLayout({
      children,
      title: 'Dashboard Overview',
      description: 'FlowState dashboard with intelligent task suggestions and weekly metrics',
      meta
    });
  } catch (error) {
    console.error('DEMO_OVERVIEW: Error generating overview:', error);
    return DemoLayout({
      children: `
        <div class="error">
          <h2>Demo Temporarily Unavailable</h2>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Overview Demo - Error',
      description: 'FlowState overview demo - temporarily unavailable',
      meta
    });
  }
}

async function renderDemoTasksHTML(meta) {
  try {
    const workspace = await getDemoWorkspace();
    const tasks = await getTasksForISTWeek(workspace.id);
    
    const children = `
      ${createSectionHeading(2, 'today', 'Today\'s Tasks', '📋')}
      <p>Manage your tasks with Board, List, and Calendar views.</p>
      
      <div class="card">
        ${createSectionHeading(3, 'board', 'Task List View', '📋')}
        <table>
          <caption class="sr-only">List of tasks with priority, context, and status</caption>
          <thead>
            <tr>
              <th scope="col">Task</th>
              <th scope="col">Priority</th>
              <th scope="col">Context</th>
              <th scope="col">Duration</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(task => `
              <tr>
                <th scope="row">${escapeHtml(task.title)}</th>
                <td><span class="chip ${task.priority.toLowerCase()}">${task.priority}</span></td>
                <td><span class="chip">${task.context}</span></td>
                <td>${task.estimate_mins} min</td>
                <td>${task.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="card">
        ${createSectionHeading(3, 'all-tasks', 'Calendar View', '📅')}
        <div class="calendar">
          <div class="calendar-day">
            <h4>Mon</h4>
            <div class="task-item">Review goals</div>
          </div>
          <div class="calendar-day">
            <h4>Tue</h4>
            <div class="task-item">Update docs</div>
          </div>
          <div class="calendar-day">
            <h4>Wed</h4>
            <div class="task-item">Team meeting</div>
          </div>
          <div class="calendar-day">
            <h4>Thu</h4>
            <div class="task-item">Code review</div>
          </div>
          <div class="calendar-day">
            <h4>Fri</h4>
            <div class="task-item">Weekly review</div>
          </div>
          <div class="calendar-day">
            <h4>Sat</h4>
            <div class="task-item">Personal time</div>
          </div>
          <div class="calendar-day">
            <h4>Sun</h4>
            <div class="task-item">Planning</div>
          </div>
        </div>
      </div>
    `;
    
    return DemoLayout({
      children,
      title: 'Tasks',
      description: 'FlowState task management with multiple views and intelligent scheduling',
      meta
    });
  } catch (error) {
    console.error('DEMO_TASKS: Error generating tasks page:', error);
    return DemoLayout({
      children: `
        <div class="error">
          <h2>Demo Temporarily Unavailable</h2>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Tasks Demo - Error',
      description: 'FlowState tasks demo - temporarily unavailable',
      meta
    });
  }
}

async function renderDemoHabitsHTML(meta) {
  try {
    const workspace = await getDemoWorkspace();
    const habitLogs = await getHabitLogs(workspace.id);
    
    // Generate 90-day heatmap (7x13 grid)
    const heatmapData = Array.from({ length: 91 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (90 - i));
      return {
        date,
        active: Math.random() > 0.3 // Mock data
      };
    });
    
    const children = `
      ${createSectionHeading(2, 'habits-grid', 'Habits Grid', '🔥')}
      <p>Track your habits with 90-day heatmaps and weekly targets.</p>
      
      <div class="grid">
        <div class="card">
          ${createSectionHeading(3, 'morning-exercise', 'Morning Exercise', '🔥')}
          <div class="heatmap" role="img" aria-label="90-day habit heatmap for morning exercise">
            ${heatmapData.map(day => 
              `<div class="heatmap-cell ${day.active ? 'active' : ''}" title="${day.date.toDateString()}"></div>`
            ).join('')}
          </div>
          <p><strong>This week:</strong> 5/7 days</p>
        </div>
        
        <div class="card">
          ${createSectionHeading(3, 'daily-reading', 'Daily Reading', '📚')}
          <div class="heatmap" role="img" aria-label="90-day habit heatmap for daily reading">
            ${heatmapData.map(day => 
              `<div class="heatmap-cell ${day.active ? 'active' : ''}" title="${day.date.toDateString()}"></div>`
            ).join('')}
          </div>
          <p><strong>This week:</strong> 6/7 days</p>
        </div>
        
        <div class="card">
          ${createSectionHeading(3, 'meditation', 'Meditation', '🧘')}
          <div class="heatmap" role="img" aria-label="90-day habit heatmap for meditation">
            ${heatmapData.map(day => 
              `<div class="heatmap-cell ${day.active ? 'active' : ''}" title="${day.date.toDateString()}"></div>`
            ).join('')}
          </div>
          <p><strong>This week:</strong> 4/7 days</p>
        </div>
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'ninety-day-heatmap', '90-Day Heatmap Overview', '📊')}
        <p>Visualize your habit consistency over the last 90 days.</p>
        <div class="heatmap" role="img" aria-label="Combined 90-day habit heatmap">
          ${heatmapData.map(day => 
            `<div class="heatmap-cell ${day.active ? 'active' : ''}" title="${day.date.toDateString()}"></div>`
          ).join('')}
        </div>
        <p><small>Each cell represents one day. Green = completed, Gray = missed</small></p>
      </div>
    `;
    
    return DemoLayout({
      children,
      title: 'Habits',
      description: 'FlowState habit tracking with 90-day heatmaps and weekly targets',
      meta
    });
  } catch (error) {
    console.error('DEMO_HABITS: Error generating habits page:', error);
    return DemoLayout({
      children: `
        <div class="error">
          <h2>Demo Temporarily Unavailable</h2>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Habits Demo - Error',
      description: 'FlowState habits demo - temporarily unavailable',
      meta
    });
  }
}

async function renderDemoJournalHTML(meta) {
  try {
    const children = `
      ${createSectionHeading(2, 'today-entry', 'Today\'s Entry', '📝')}
      <p>Daily reflection prompts and progress tracking for continuous improvement.</p>
      
      <div class="card">
        ${createSectionHeading(3, 'daily-reflection', 'Today\'s Reflection', '📝')}
        <p><strong>Prompt:</strong> What was your biggest win today?</p>
        <p><strong>Response:</strong> Completed the quarterly review ahead of schedule. Feeling accomplished and ready for next week's challenges.</p>
      </div>
      
      <div class="card">
        ${createSectionHeading(3, 'weekly-goals', 'Weekly Goals', '🎯')}
        <ul role="list">
          <li>Complete project documentation</li>
          <li>Schedule team 1:1s</li>
          <li>Review Q4 objectives</li>
        </ul>
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'recent-entries', 'Recent Entries', '📚')}
        <p>Your journaling journey over the past week</p>
        <ul role="list">
          <li><strong>Yesterday:</strong> Focused on deep work, completed 3 high-priority tasks</li>
          <li><strong>Monday:</strong> Started the week with a clear plan and morning routine</li>
          <li><strong>Sunday:</strong> Weekly review and planning session</li>
        </ul>
      </div>
    `;
    
    return DemoLayout({
      children,
      title: 'Journal & Reflection',
      description: 'FlowState journaling and reflection for continuous improvement',
      meta
    });
  } catch (error) {
    console.error('DEMO_JOURNAL: Error generating journal page:', error);
    return DemoLayout({
      children: `
        <div class="error">
          <h2>Demo Temporarily Unavailable</h2>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Journal Demo - Error',
      description: 'FlowState journal demo - temporarily unavailable',
      meta
    });
  }
}

async function renderDemoReviewHTML(meta) {
  try {
    const workspace = await getDemoWorkspace();
    const completedTasks = await getCompletedTasksForISTWeek(workspace.id);
    const carryOverTasks = await getCarryOverTasksForISTWeek(workspace.id);
    const weekRange = formatISTRange();
    
    const children = `
      ${createSectionHeading(2, 'period', 'Weekly Review', '📝')}
      <p>Reflect on your week and plan ahead with intelligent insights.</p>
      
      <div class="success">
        <h3>Period: ${weekRange.startLabel} – ${weekRange.endLabel}</h3>
        <p style="margin-bottom: 0; color: #64748b;">All times in Asia/Kolkata timezone</p>
      </div>
      
      <div class="grid">
        <div class="card">
          ${createSectionHeading(3, 'completed-this-week', 'Completed This Week', '✅')}
          <p><strong>${completedTasks.length}</strong> tasks completed</p>
          ${completedTasks.slice(0, 3).map(task => `
            <div class="task-item">
              <strong>${escapeHtml(task.title)}</strong>
              <span class="chip ${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="card">
          ${createSectionHeading(3, 'carry-overs', 'Carry-overs', '🔄')}
          <p><strong>${carryOverTasks.length}</strong> tasks to carry forward</p>
          ${carryOverTasks.slice(0, 3).map(task => `
            <div class="task-item">
              <strong>${escapeHtml(task.title)}</strong>
              <span class="chip ${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'plan-next-week', 'Plan Next Week', '📅')}
        <div class="success">
          <p style="margin-bottom: 10px;">
            <strong>Auto time-boxing:</strong> In the live app, this converts carry-overs and priorities into concrete time blocks for next week (Mon–Sun, IST).
          </p>
          <p style="margin-bottom: 10px;">
            <strong>Strategy options:</strong>
          </p>
          <ul role="list" style="margin-left: 20px; margin-bottom: 10px;">
            <li><strong>Balanced:</strong> Spread tasks across the week</li>
            <li><strong>Frontload:</strong> Prefer Monday-Wednesday slots</li>
            <li><strong>Mornings:</strong> Prefer 9:30 AM - 12:30 PM slots</li>
          </ul>
          <p style="margin-bottom: 0; color: #64748b; font-size: 0.9rem;">
            Would schedule ${carryOverTasks.length} carry-overs and ${Math.min(5, carryOverTasks.length + 3)} high-priority tasks.
          </p>
        </div>
      </div>
    `;
    
    return DemoLayout({
      children,
      title: 'Weekly Review',
      description: 'FlowState weekly review with automated insights and next week planning',
      meta
    });
  } catch (error) {
    console.error('DEMO_REVIEW: Error generating review page:', error);
    return DemoLayout({
      children: `
        <div class="error">
          <h2>Demo Temporarily Unavailable</h2>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Review Demo - Error',
      description: 'FlowState review demo - temporarily unavailable',
      meta
    });
  }
}

async function renderDemoAgendaHTML(meta) {
  try {
    const workspace = await getDemoWorkspace();
    const tasks = await getTasksForISTWeek(workspace.id);
    const scheduledTotals = await getScheduledTotalsForWeek(workspace.id);
    const weekRange = formatISTRange();
    
    const children = `
      ${createSectionHeading(2, 'week-agenda', 'Week Agenda', '📅')}
      <p>Calendar view with time-blocked tasks and intelligent scheduling suggestions.</p>
      
      <div class="success">
        <h3>Period: ${weekRange.startLabel} – ${weekRange.endLabel}</h3>
        <p><strong>Total Scheduled Hours:</strong> ${scheduledTotals.totalHours}h ${scheduledTotals.totalMinutes}m</p>
        <p style="margin-bottom: 0; color: #64748b;">All times in Asia/Kolkata timezone</p>
      </div>
      
      <div class="card">
        ${createSectionHeading(3, 'weekly-calendar', 'Weekly Calendar', '📅')}
        <div class="calendar">
          <div class="calendar-day">
            <h4>Monday</h4>
            <div class="task-item">9:00 AM - Review goals</div>
            <div class="task-item">2:00 PM - Team meeting</div>
          </div>
          <div class="calendar-day">
            <h4>Tuesday</h4>
            <div class="task-item">10:00 AM - Update docs</div>
            <div class="task-item">3:00 PM - Code review</div>
          </div>
          <div class="calendar-day">
            <h4>Wednesday</h4>
            <div class="task-item">9:30 AM - Project planning</div>
            <div class="task-item">1:00 PM - Client call</div>
          </div>
          <div class="calendar-day">
            <h4>Thursday</h4>
            <div class="task-item">11:00 AM - Documentation</div>
            <div class="task-item">4:00 PM - Testing</div>
          </div>
          <div class="calendar-day">
            <h4>Friday</h4>
            <div class="task-item">10:30 AM - Weekly review</div>
            <div class="task-item">2:30 PM - Planning next week</div>
          </div>
          <div class="calendar-day">
            <h4>Saturday</h4>
            <div class="task-item">Personal time</div>
          </div>
          <div class="calendar-day">
            <h4>Sunday</h4>
            <div class="task-item">Planning & reflection</div>
          </div>
        </div>
      </div>
    `;
    
    return DemoLayout({
      children,
      title: 'Week Agenda',
      description: 'FlowState calendar with time-blocked tasks and intelligent scheduling',
      meta
    });
  } catch (error) {
    console.error('DEMO_AGENDA: Error generating agenda page:', error);
    return DemoLayout({
      children: `
        <div class="error">
          <h2>Demo Temporarily Unavailable</h2>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Agenda Demo - Error',
      description: 'FlowState agenda demo - temporarily unavailable',
      meta
    });
  }
}

async function renderDemoSettingsHTML(meta) {
  try {
    const children = `
      ${createSectionHeading(2, 'workspace-prefs', 'Workspace Preferences', '⚙️')}
      <p>Configure your FlowState experience and preferences.</p>
      
      <div class="grid">
        <div class="card">
          ${createSectionHeading(3, 'general-settings', 'General Settings', '⚙️')}
          <p><strong>Timezone:</strong> Asia/Kolkata</p>
          <p><strong>Week Start:</strong> Monday</p>
          <p><strong>Date Format:</strong> DD/MM/YYYY</p>
          <p><strong>Time Format:</strong> 24-hour</p>
        </div>
        
        <div class="card">
          ${createSectionHeading(3, 'notifications', 'Notifications', '🔔')}
          <p><strong>Email:</strong> Enabled</p>
          <p><strong>Push:</strong> Enabled</p>
          <p><strong>Reminders:</strong> 15 minutes before</p>
        </div>
        
        <div class="card">
          ${createSectionHeading(3, 'appearance', 'Appearance', '🎨')}
          <p><strong>Theme:</strong> Light</p>
          <p><strong>Language:</strong> English</p>
          <p><strong>Font Size:</strong> Medium</p>
        </div>
        
        <div class="card">
          ${createSectionHeading(3, 'privacy-security', 'Privacy & Security', '🔒')}
          <p><strong>Data Export:</strong> Available</p>
          <p><strong>Account Deletion:</strong> Available</p>
          <p><strong>Two-Factor:</strong> Not enabled</p>
        </div>
      </div>
      
      <div class="card">
        ${createSectionHeading(2, 'subscription', 'Subscription', '💎')}
        <p><strong>Current Plan:</strong> Pro</p>
        <p><strong>Features:</strong> Unlimited tasks, AI scheduling, advanced analytics, team collaboration</p>
        <p><strong>Next Billing:</strong> Monthly recurring</p>
      </div>
    `;
    
    return DemoLayout({
      children,
      title: 'Settings',
      description: 'FlowState settings and preferences configuration',
      meta
    });
  } catch (error) {
    console.error('DEMO_SETTINGS: Error generating settings page:', error);
    return DemoLayout({
      children: `
        <div class="error">
          <h2>Demo Temporarily Unavailable</h2>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Settings Demo - Error',
      description: 'FlowState settings demo - temporarily unavailable',
      meta
    });
  }
}

module.exports = {
  resolveDemoPageMeta,
  renderDemoOverviewHTML,
  renderDemoTasksHTML,
  renderDemoHabitsHTML,
  renderDemoJournalHTML,
  renderDemoReviewHTML,
  renderDemoAgendaHTML,
  renderDemoSettingsHTML
};
