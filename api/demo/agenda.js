import DemoLayout from '../../lib/DemoLayout.js';
import { escapeHtml, fmtDayTimeRange } from '../../lib/ssrHtml.js';
import { getDemoWorkspace } from '../../lib/demoData.js';
import { getScheduledTasksForISTWeek, getScheduledTotalsForWeek } from '../../lib/demo-metrics.js';
import { getISTWeekBoundsWithOffset, formatISTRange, formatISTTimeWindow } from '../../lib/time-ist.js';

export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Parse offset parameter
    const offset = parseInt(req.query.offset) || 0;
    
    // Get demo workspace
    const workspace = await getDemoWorkspace();
    if (!workspace) {
      const html = DemoLayout({
        children: `
          <div style="text-align: center; padding: 40px;">
            <h1>Demo Temporarily Unavailable</h1>
            <p>No demo workspace found. Please try the interactive demo:</p>
            <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          </div>
        `,
        title: 'Week Agenda Demo',
        description: 'FlowState agenda demo - temporarily unavailable'
      });
      return res.status(200).send(html);
    }

    // Get IST week bounds with offset
    const { weekStartUTC, weekEndUTC } = getISTWeekBoundsWithOffset(offset);
    const weekRange = formatISTRange(weekStartUTC, weekEndUTC, false);

    // Fetch agenda data for the IST week
    const [scheduledTasks, scheduledTotals] = await Promise.all([
      getScheduledTasksForISTWeek(workspace.id, new Date(Date.now() + offset * 24 * 60 * 60 * 1000)),
      getScheduledTotalsForWeek(workspace.id, new Date(Date.now() + offset * 24 * 60 * 60 * 1000))
    ]);

    // Group tasks by day
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStartUTC);
      dayDate.setDate(weekStartUTC.getDate() + i);
      
      const dayTasks = scheduledTasks.filter(task => {
        const taskDate = new Date(task.start_at);
        return taskDate.toDateString() === dayDate.toDateString();
      }).map(task => {
        const priority = task.priority_matrix?.includes('Priority 1') ? 'HIGH' : 
                        task.priority_matrix?.includes('Priority 2') ? 'MEDIUM' : 'LOW';
        
        return {
          start: new Date(task.start_at),
          end: new Date(task.end_at),
          title: task.name,
          priority,
          projectOrArea: task.projects?.name || task.areas?.name
        };
      });

      weekDays.push({
        day: dayNames[i],
        slots: dayTasks
      });
    }

    const children = `
      <h1>Week Agenda (Read-only Demo)</h1>
      <p>View your scheduled time blocks and plan your week effectively.</p>

      <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
        <h3 style="margin-top: 0;">Week Agenda — ${weekRange.startLabel} – ${weekRange.endLabel}</h3>
        <p style="margin-bottom: 0; color: #64748b;">All times in Asia/Kolkata timezone</p>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="/demo/agenda?offset=${offset - 7}" class="cta-button cta-secondary">← Previous Week</a>
        <a href="/demo/agenda?offset=0" class="cta-button cta-secondary">This Week</a>
        <a href="/demo/agenda?offset=${offset + 7}" class="cta-button cta-secondary">Next Week →</a>
      </div>

      <h2>📅 Weekly Schedule</h2>
      <div class="card">
        ${weekDays.map(day => `
          <div style="border-bottom: 1px solid #e2e8f0; padding: 20px 0; margin-bottom: 20px;">
            <h3 style="margin-top: 0; margin-bottom: 15px; color: #1F2937;">${day.day}</h3>
            ${day.slots.length > 0 ? `
              <div style="display: grid; gap: 10px;">
                ${day.slots.map(slot => `
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                      <span style="background-color: #DBEAFE; color: #1E40AF; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; font-family: monospace; margin-right: 10px;">
                        ${formatISTTimeWindow(slot.start, slot.end)}
                      </span>
                      <span class="priority ${slot.priority.toLowerCase()}">${slot.priority}</span>
                    </div>
                    <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(slot.title)}</div>
                    ${slot.projectOrArea ? `
                      <div style="color: #64748b; font-size: 0.9rem;">
                        <span style="background-color: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem;">${escapeHtml(slot.projectOrArea)}</span>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : `
              <div style="text-align: center; color: #64748b; padding: 20px; background-color: #f8fafc; border-radius: 6px;">
                <p style="margin: 0;">No scheduled tasks</p>
                <small>Free time for focus work or breaks</small>
              </div>
            `}
          </div>
        `).join('')}
      </div>

      <h2>📊 Week Summary</h2>
      <div class="grid">
        <div class="card">
          <h3>Total Scheduled Hours</h3>
          <div class="stat-number">${scheduledTotals.hours}</div>
          <div class="stat-label">hours this week</div>
        </div>
        <div class="card">
          <h3>Deep Work Blocks</h3>
          <div class="stat-number">${weekDays.reduce((count, day) => count + day.slots.filter(slot => slot.title.toLowerCase().includes('deep work') || slot.title.toLowerCase().includes('focus')).length, 0)}</div>
          <div class="stat-label">focused sessions</div>
        </div>
        <div class="card">
          <h3>Meeting Time</h3>
          <div class="stat-number">${weekDays.reduce((count, day) => count + day.slots.filter(slot => slot.title.toLowerCase().includes('meeting') || slot.title.toLowerCase().includes('call')).length, 0)}</div>
          <div class="stat-label">hours in meetings</div>
        </div>
        <div class="card">
          <h3>Free Time</h3>
          <div class="stat-number">${Math.max(0, 40 - scheduledTotals.hours)}</div>
          <div class="stat-label">hours available</div>
        </div>
      </div>

      <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Note:</strong> Drag on calendar and time-boxing available in interactive app.</p>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="/api/demo/access?utm_source=demo-agenda" class="cta-button">Open Interactive Demo</a>
        <a href="/demo" class="cta-button cta-secondary">Back to Overview</a>
      </div>
    `;

    const html = DemoLayout({
      children,
      title: 'Week Agenda Demo',
      description: 'FlowState week agenda with time-blocking and schedule visualization'
    });

    res.status(200).send(html);

  } catch (error) {
    console.error('DEMO_AGENDA: Error generating agenda page:', error);
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