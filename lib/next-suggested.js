const { createClient } = require('@supabase/supabase-js');
const { formatISTTimeWindow } = require('./time-ist.js');

let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    
    supabaseClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  return supabaseClient;
}

/** Simple server-side proposal logic */
async function proposeTimeBlocksServerSide(options) {
  const { estimateMins = 30, priority = 'MEDIUM', context = 'Deep Work', timezone = 'Asia/Kolkata' } = options;
  
  // Simple proposal logic - prefer Deep Work windows (10:00-13:00 IST)
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Default to tomorrow at 10:00 AM IST
  const proposalStart = new Date(tomorrow);
  proposalStart.setHours(10, 0, 0, 0);
  
  const proposalEnd = new Date(proposalStart);
  proposalEnd.setMinutes(proposalEnd.getMinutes() + estimateMins);
  
  // Adjust for Deep Work preference
  if (context === 'Deep Work') {
    proposalStart.setHours(10, 0, 0, 0);
  } else if (context === 'Admin') {
    proposalStart.setHours(14, 0, 0, 0);
  }
  
  proposalEnd.setTime(proposalStart.getTime() + (estimateMins * 60 * 1000));
  
  return [{
    start: proposalStart.toISOString(),
    end: proposalEnd.toISOString(),
    rationale: context === 'Deep Work' ? 'Fits your deep work window' : 'Scheduled during work hours',
    score: 0.8
  }];
}

async function getNextSuggestedWithProposal(workspaceId) {
  const supabase = getSupabaseClient();
  
  // 1) Pick the task: highest-priority non-DONE, no startAt/endAt. Prefer Deep Work, then Admin.
  const { data: candidates } = await supabase
    .from('tasks')
    .select('id, name, estimated_time, priority_matrix, context, workspace_id')
    .eq('workspace_id', workspaceId)
    .neq('status', 'Done')
    .is('start_at', null)
    .is('end_at', null)
    .order('priority_matrix', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(15);

  if (!candidates || candidates.length === 0) return null;

  // Simple preference: Deep Work first, else Admin, else first
  const pick = candidates.find(c => c.context === 'Deep Work') ??
               candidates.find(c => c.context === 'Admin') ??
               candidates[0];

  if (!pick) return null;

  // 2) Propose a time block (server-side)
  const estimate = pick.estimated_time ?? 30;
  const priority = pick.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                   pick.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW';
  
  const proposals = await proposeTimeBlocksServerSide({
    estimateMins: estimate,
    priority: priority,
    context: pick.context ?? 'Deep Work',
    timezone: 'Asia/Kolkata',
    prefs: {
      weekdayStart: "09:00", 
      weekdayEnd: "18:00", 
      weekendStart: "10:00", 
      weekendEnd: "16:00"
    }
  });

  if (!proposals?.length) return { task: pick, proposal: null };

  const top = proposals[0];
  const label = formatISTTimeWindow(new Date(top.start), new Date(top.end));
  
  return { 
    task: pick, 
    proposal: { 
      ...top, 
      label,
      rationale: top.rationale
    } 
  };
}

/** Get workspace preferences for scheduling */
async function getWorkspacePreferences(workspaceId) {
  const supabase = getSupabaseClient();
  
  const { data: prefs } = await supabase
    .from('workspace_preferences')
    .select('*')
    .eq('workspace_id', workspaceId)
    .single();

  return prefs || {
    weekdayStart: "09:00",
    weekdayEnd: "18:00", 
    weekendStart: "10:00",
    weekendEnd: "16:00"
  };
}

module.exports = {
  getNextSuggestedWithProposal,
  getWorkspacePreferences
};
