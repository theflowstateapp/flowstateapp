// Force Node.js runtime and avoid static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc, format as fmt } from 'date-fns-tz';
import { supabaseAdmin } from '../../lib/supabase.js';
import { withDbRetry } from '../../lib/retry.js';

const IST = "Asia/Kolkata";

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

const getISTWeekBounds = (reference) => {
  const now = reference ?? new Date();
  const zonedNow = utcToZonedTime(now, IST);

  // Monday-start week in IST
  const weekStartZoned = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const weekEndZoned = endOfWeek(zonedNow, { weekStartsOn: 1 });

  // Clamp to day bounds in IST, then convert to UTC for DB queries
  const weekStartUTC = zonedTimeToUtc(startOfDay(weekStartZoned), IST);
  const weekEndUTC = zonedTimeToUtc(endOfDay(weekEndZoned), IST);

  return { zonedNow, weekStartZoned, weekEndZoned, weekStartUTC, weekEndUTC };
};

const clipDurationMs = (a, b, x, y) => {
  const start = a > x ? a : x;
  const end = b < y ? b : y;
  return Math.max(0, +end - +start);
};

// Data fetching functions
const getDemoWorkspace = async () => {
  try {
    const sb = supabaseAdmin();
    const { data } = await withDbRetry(async () => {
      const result = await sb
        .from('workspaces')
        .select('*')
        .eq('is_demo', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (result.error) throw result.error;
      return result.data;
    });
    
    return data;
  } catch (error) {
    console.warn('Could not fetch demo workspace:', error.message);
    return { id: 'demo-workspace-1', name: 'Demo Workspace', is_demo: true };
  }
};

const getCountsConsistent = async (workspaceId, reference) => {
  try {
    const { weekStartUTC, weekEndUTC } = getISTWeekBounds(reference);
    
    const [totalTasksResult, completedThisWeekResult, activeProjectsResult] = await Promise.all([
      supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId),
      
      supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .eq('status', 'Done')
        .gte('updated_at', weekStartUTC.toISOString())
        .lte('updated_at', weekEndUTC.toISOString()),
      
      supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)
        .neq('status', 'Completed')
    ]);

    return {
      totalTasks: totalTasksResult.count || 0,
      completedThisWeek: completedThisWeekResult.count || 0,
      activeProjects: activeProjectsResult.count || 0
    };
  } catch (error) {
    console.warn('Could not fetch counts:', error.message);
    return {
      totalTasks: 12,
      completedThisWeek: 5,
      activeProjects: 2
    };
  }
};

const getScheduledTotalsForWeek = async (workspaceId, reference) => {
  try {
    const { weekStartUTC, weekEndUTC } = getISTWeekBounds(reference);

    // Pull only blocks overlapping week
    const { data: tasks } = await supabase
      .from('tasks')
      .select('start_at, end_at, priority_matrix')
      .eq('workspace_id', workspaceId)
      .not('start_at', 'is', null)
      .not('end_at', 'is', null)
      .lte('start_at', weekEndUTC.toISOString())
      .gte('end_at', weekStartUTC.toISOString());

    if (!tasks) return { hours: 0, count: 0 };

    // Sum clipped durations within week window
    let totalMs = 0;
    for (const task of tasks) {
      if (!task.start_at || !task.end_at) continue;
      const startAt = new Date(task.start_at);
      const endAt = new Date(task.end_at);
      totalMs += clipDurationMs(startAt, endAt, weekStartUTC, weekEndUTC);
    }
    
    const hours = +(totalMs / (1000 * 60 * 60)).toFixed(1);
    return { hours, count: tasks.length };
  } catch (error) {
    console.warn('Could not fetch scheduled totals:', error.message);
    return { hours: 8.5, count: 6 };
  }
};

const getNextSuggestedWithProposal = async (workspaceId) => {
  try {
    // Query for highest-priority unscheduled task
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, name, priority_matrix, context, estimate_mins')
      .eq('workspace_id', workspaceId)
      .neq('status', 'Done')
      .is('start_at', null)
      .is('end_at', null)
      .order('priority_matrix', { ascending: false })
      .order('due_at', { ascending: true })
      .limit(1);

    if (!tasks || tasks.length === 0) {
      return null;
    }

    const task = tasks[0];
    
    // Generate a mock proposal (in a real implementation, this would call the scheduling engine)
    const now = new Date();
    const proposalStart = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const proposalEnd = new Date(proposalStart.getTime() + (task.estimate_mins || 30) * 60 * 1000);
    
    return {
      task: {
        id: task.id,
        name: task.name,
        priority_matrix: task.priority_matrix,
        context: task.context
      },
      proposal: {
        start: proposalStart.toISOString(),
        end: proposalEnd.toISOString(),
        label: fmt(utcToZonedTime(proposalStart, IST), "EEE, h:mm a", { timeZone: IST }) + 
               '–' + fmt(utcToZonedTime(proposalEnd, IST), "h:mm a", { timeZone: IST }),
        rationale: 'Fits your deep work window'
      }
    };
  } catch (error) {
    console.warn('Could not fetch next suggested task:', error.message);
    return {
      task: {
        id: 'demo-task-1',
        name: 'Complete project proposal',
        priority_matrix: 'High',
        context: 'Deep Work'
      },
      proposal: {
        start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 2.75 * 60 * 60 * 1000).toISOString(),
        label: 'Wed, 10:30–11:15',
        rationale: 'Fits your deep work window'
      }
    };
  }
};

export default async function handler(req, res) {
  try {
    console.log('DEMO_OVERVIEW: Generating demo overview page');
    
    // Set headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Fetch data with P0 fixes
    const workspace = await getDemoWorkspace();
    const counts = await getCountsConsistent(workspace.id);
    const scheduledTotals = await getScheduledTotalsForWeek(workspace.id);
    const nextSuggested = await getNextSuggestedWithProposal(workspace.id);

    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Overview - FlowState Demo</title>
    <meta name="description" content="A comprehensive overview of FlowState productivity features with live demo data">
    <meta name="robots" content="index,follow">
    <meta property="og:title" content="Demo Overview - FlowState Demo">
    <meta property="og:description" content="A comprehensive overview of FlowState productivity features with live demo data">
    <meta property="og:image" content="https://theflowstateapp.com/og-image.svg">
    <meta property="og:url" content="https://theflowstateapp.com/demo">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Demo Overview - FlowState Demo">
    <meta name="twitter:description" content="A comprehensive overview of FlowState productivity features with live demo data">
    <meta name="twitter:image" content="https://theflowstateapp.com/og-image.svg">
    <style>
      body { 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
        margin: 0; 
        padding: 0; 
        background-color: #f8fafc; 
        color: #334155; 
        line-height: 1.6; 
      }
      .container { 
        max-width: 960px; 
        margin: 0 auto; 
        padding: 20px; 
        background-color: #ffffff; 
        border-radius: 8px; 
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
      }
      header { 
        background-color: #1f2937; 
        color: white; 
        padding: 15px 20px; 
        margin-bottom: 20px; 
        border-radius: 8px; 
      }
      header a { 
        color: #60a5fa; 
        text-decoration: none; 
        margin: 0 8px; 
      }
      header a:hover { 
        text-decoration: underline; 
      }
      h1 { 
        color: #1F2937; 
        margin-bottom: 20px; 
        font-size: 2.5rem; 
      }
      h2 { 
        color: #1F2937; 
        margin-top: 30px; 
        margin-bottom: 15px; 
        font-size: 2rem; 
        border-bottom: 1px solid #e2e8f0; 
        padding-bottom: 10px; 
      }
      h3 { 
        color: #1F2937; 
        margin-top: 20px; 
        margin-bottom: 10px; 
        font-size: 1.5rem; 
      }
      .grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
        gap: 20px; 
        margin-bottom: 30px; 
      }
      .card { 
        background-color: #f8fafc; 
        border: 1px solid #e2e8f0; 
        border-radius: 8px; 
        padding: 20px; 
      }
      .stat-grid { 
        display: flex; 
        justify-content: space-around; 
        text-align: center; 
        margin-bottom: 20px; 
      }
      .stat-item { 
        flex: 1; 
        padding: 10px; 
        border-right: 1px solid #e2e8f0; 
      }
      .stat-item:last-child { 
        border-right: none; 
      }
      .stat-number { 
        font-size: 2.2rem; 
        font-weight: 700; 
        color: #10B981; 
      }
      .stat-label { 
        font-size: 0.9rem; 
        color: #64748b; 
      }
      .cta-button { 
        background-color: #0284c7; 
        color: white; 
        padding: 12px 25px; 
        border-radius: 6px; 
        text-decoration: none; 
        font-weight: 600; 
        display: inline-block; 
        margin: 10px 5px; 
      }
      .cta-button:hover { 
        background-color: #0369a1; 
      }
      .cta-secondary { 
        background-color: #e0f2fe; 
        color: #0284c7; 
        border: 1px solid #0284c7; 
      }
      .cta-secondary:hover { 
        background-color: #0284c7; 
        color: white; 
      }
      footer { 
        text-align: center; 
        margin-top: 50px; 
        padding: 20px; 
        color: #6B7280; 
        border-top: 1px solid #E5E7EB; 
      }
      .nav-links { 
        margin: 10px 0; 
      }
      .nav-links a { 
        margin: 0 10px; 
      }
      @media (max-width: 768px) {
        .container { padding: 10px; }
        h1 { font-size: 2rem; }
        .grid { grid-template-columns: 1fr; }
        .stat-grid { flex-direction: column; }
        .stat-item { border-right: none; border-bottom: 1px solid #e2e8f0; }
      }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>FlowState Demo</h1>
            <div class="nav-links">
                <a href="/demo">Overview</a> | 
                <a href="/demo/tasks">Tasks</a> | 
                <a href="/demo/habits">Habits</a> | 
                <a href="/demo/journal">Journal</a> | 
                <a href="/demo/review">Review</a> | 
                <a href="/demo/agenda">Week Agenda</a> | 
                <a href="/demo/settings">Settings</a> | 
                <a href="/api/demo/access">Open Interactive Demo →</a>
            </div>
            <p><small>Read-only snapshots. Data resets periodically.</small></p>
        </div>
    </header>
    
    <main class="container">
        <h1>Demo Overview</h1>
        <p>A snapshot of your productivity on <strong>${today}</strong>.</p>

        <h2>📊 Dashboard Snapshot</h2>
        <div class="stat-grid">
            <div class="stat-item">
                <div class="stat-number">${counts.totalTasks}</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${counts.completedThisWeek}</div>
                <div class="stat-label">Completed This Week</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${scheduledTotals.hours}</div>
                <div class="stat-label">Scheduled Hours</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">${counts.activeProjects}</div>
                <div class="stat-label">Active Projects</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🎯 Next suggested task</h3>
                ${nextSuggested ? `
                    <div style="background-color: #ecfdf5; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px;">
                        <div style="font-weight: 600; margin-bottom: 8px;">${escapeHtml(nextSuggested.task.name)}</div>
                        <div style="color: #065f46; margin-bottom: 8px;">
                            Proposed: <strong>${escapeHtml(nextSuggested.proposal?.label || 'No slot available')}</strong>
                            ${nextSuggested.proposal?.rationale ? ` • ${escapeHtml(nextSuggested.proposal.rationale)}` : ''}
                        </div>
                        <div style="font-size: 0.9rem; color: #64748b;">
                            Accept/Reshuffle available in the interactive app.
                        </div>
                    </div>
                ` : `
                    <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; font-style: italic; color: #065f46;">
                        No unscheduled tasks found. Great job staying organized!
                    </div>
                `}
            </div>

            <div class="card">
                <h3>📋 Today</h3>
                <div style="margin-bottom: 15px; padding: 10px; background-color: #f8fafc; border-radius: 6px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Complete project proposal</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                        <span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">HIGH</span>
                        <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Wed, 10:30–11:15</span>
                        <span style="background-color: #f3e8ff; color: #7c3aed; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Deep Work</span>
                    </div>
                </div>
                <div style="margin-bottom: 15px; padding: 10px; background-color: #f8fafc; border-radius: 6px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Review team feedback</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                        <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">MEDIUM</span>
                        <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">due 2:00 pm</span>
                        <span style="background-color: #f3e8ff; color: #7c3aed; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Admin</span>
                    </div>
                </div>
                <div style="margin-bottom: 15px; padding: 10px; background-color: #f8fafc; border-radius: 6px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Client call preparation</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                        <span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">HIGH</span>
                        <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">14:00–14:30</span>
                        <span style="background-color: #f3e8ff; color: #7c3aed; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Call</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>🔥 Habit Streaks</h3>
                <p><strong>Daily Exercise</strong> - 7 day streak</p>
                <p><strong>Morning Meditation</strong> - 12 day streak</p>
                <p><strong>Read Books</strong> - 5 day streak</p>
            </div>

            <div class="card">
                <h3>📝 Today's Journal</h3>
                <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px;">
                    <p>Great progress on the project today. Team collaboration was excellent and we made significant headway on the Q4 launch planning...</p>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin: 40px 0;">
            <a href="/api/demo/access?utm_source=demo-overview" class="cta-button">Open Interactive Demo</a>
            <a href="/api/demo/static" class="cta-button cta-secondary">See Static Preview</a>
        </div>
    </main>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} FlowState. All rights reserved.</p>
        <p><a href="/privacy" style="color: #0284c7; text-decoration: none;">Privacy Policy</a> | 
           <a href="mailto:support@theflowstateapp.com" style="color: #0284c7; text-decoration: none;">Contact Us</a></p>
        <p><small>Data resets periodically. Demo only.</small></p>
    </footer>
</body>
</html>`;

    console.log('DEMO_OVERVIEW: Sending response');
    res.status(200).send(html);

  } catch (error) {
    console.error('DEMO_OVERVIEW: Error generating overview:', error);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).send(`
      <html>
        <head><title>FlowState Demo - Error</title></head>
        <body>
          <h1>Demo temporarily unavailable</h1>
          <p>Please try the interactive demo: <a href="/api/demo/access">Open Demo →</a></p>
        </body>
      </html>
    `);
  }
}
