import DemoLayout from '../../lib/DemoLayout.js';
import { escapeHtml } from '../../lib/ssrHtml.js';
import { getDemoWorkspace } from '../../lib/demoData.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { withDbRetry } from '../../lib/retry.js';

export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

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
        title: 'Calendar Demo',
        description: 'FlowState calendar demo - temporarily unavailable'
      });
      return res.status(200).send(html);
    }

    // Mock scheduled tasks for the week
    const mockTasks = [
      {
        id: 'task-1',
        name: 'Complete project proposal',
        priority: 'HIGH',
        context: 'Deep Work',
        start: '2025-09-09T10:30:00Z',
        end: '2025-09-09T11:15:00Z',
        scheduled: true
      },
      {
        id: 'task-2',
        name: 'Review team feedback',
        priority: 'MEDIUM',
        context: 'Admin',
        due: '2025-09-09T14:00:00Z',
        scheduled: false
      },
      {
        id: 'task-3',
        name: 'Client call preparation',
        priority: 'HIGH',
        context: 'Call',
        start: '2025-09-09T14:00:00Z',
        end: '2025-09-09T14:30:00Z',
        scheduled: true
      },
      {
        id: 'task-4',
        name: 'Update project documentation',
        priority: 'LOW',
        context: 'Admin',
        due: '2025-09-10T09:00:00Z',
        scheduled: false
      }
    ];

    const children = `
      <h1>Calendar (Read-only Demo)</h1>
      <p>Visualize your schedule with drag-and-drop time management.</p>

      <h2>📅 Week View - September 9-15, 2025</h2>
      <div class="card">
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          
          <!-- Monday -->
          <div style="background-color: #f8fafc; padding: 10px; min-height: 200px;">
            <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937;">Mon, Sep 9</div>
            
            <!-- Scheduled task -->
            <div style="background-color: #ecfdf5; border-left: 4px solid #10B981; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
              <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">Complete project proposal</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px;">
                <span style="background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 600;">HIGH</span>
                <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">10:30–11:15</span>
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">Deep Work</span>
              </div>
            </div>
            
            <!-- Unscheduled task -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
              <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">Review team feedback</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px;">
                <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 600;">MEDIUM</span>
                <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">due 2:00 pm</span>
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">Admin</span>
              </div>
            </div>
            
            <!-- Scheduled task -->
            <div style="background-color: #ecfdf5; border-left: 4px solid #10B981; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
              <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">Client call preparation</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px;">
                <span style="background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 600;">HIGH</span>
                <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">2:00–2:30</span>
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">Call</span>
              </div>
            </div>
          </div>
          
          <!-- Tuesday -->
          <div style="background-color: #f8fafc; padding: 10px; min-height: 200px;">
            <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937;">Tue, Sep 10</div>
            
            <!-- Unscheduled task -->
            <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 8px; margin-bottom: 8px; border-radius: 4px;">
              <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">Update project documentation</div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px;">
                <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 600;">LOW</span>
                <span style="background-color: #dbeafe; color: #1e40af; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">due 9:00 am</span>
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 2px 6px; border-radius: 3px; font-size: 0.7rem;">Admin</span>
              </div>
            </div>
          </div>
          
          <!-- Wednesday through Sunday -->
          ${['Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => `
            <div style="background-color: #f8fafc; padding: 10px; min-height: 200px;">
              <div style="font-weight: 600; margin-bottom: 10px; color: #1f2937;">${day}, Sep ${day === 'Wed' ? '11' : day === 'Thu' ? '12' : day === 'Fri' ? '13' : day === 'Sat' ? '14' : '15'}</div>
              <div style="color: #64748b; font-size: 0.9rem; font-style: italic;">No scheduled tasks</div>
            </div>
          `).join('')}
        </div>
      </div>

      <h2>🎯 Drag & Drop Rules</h2>
      <div class="card">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h3 style="margin-top: 0;">Smart Scheduling</h3>
          <ul style="margin-bottom: 15px;">
            <li><strong>Scheduled tasks:</strong> Dragging moves startAt/endAt while preserving duration</li>
            <li><strong>Unscheduled tasks:</strong> Dragging to a slot sets startAt/endAt = slot time</li>
            <li><strong>Work hours:</strong> Tasks outside 9 AM - 6 PM snap to nearest valid window</li>
            <li><strong>Conflicts:</strong> Overlapping tasks show visual warnings</li>
          </ul>
          <p style="font-style: italic; color: #475569; margin-bottom: 0;">
            "Drag any task to reschedule it. The system automatically handles time conflicts and work hour constraints."
          </p>
        </div>
      </div>

      <h2>🏷️ Consistent Chips</h2>
      <div class="card">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h3 style="margin-top: 0;">Priority Levels</h3>
          <div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;">
            <span style="background-color: #fef2f2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">URGENT</span>
            <span style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">HIGH</span>
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">MEDIUM</span>
            <span style="background-color: #f0f9ff; color: #0ea5e9; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">LOW</span>
          </div>
          
          <h3 style="margin-top: 0;">Time Windows</h3>
          <div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;">
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">10:30–11:15</span>
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">due 2:00 pm</span>
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Tomorrow</span>
            <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Fri</span>
          </div>
          
          <h3 style="margin-top: 0;">Contexts</h3>
          <div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;">
            <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Deep Work</span>
            <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Admin</span>
            <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Call</span>
            <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">Errand</span>
          </div>
        </div>
      </div>

      <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Note:</strong> Interactive drag-and-drop, real-time conflict detection, and smart scheduling available in the live app.</p>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="/api/demo/access?utm_source=demo-calendar" class="cta-button">Open Interactive Demo</a>
        <a href="/demo" class="cta-button cta-secondary">Back to Overview</a>
      </div>
    `;

    const html = DemoLayout({
      children,
      title: 'Calendar Demo',
      description: 'FlowState calendar with drag-and-drop scheduling and consistent task chips'
    });

    res.status(200).send(html);

  } catch (error) {
    console.error('DEMO_CALENDAR: Error generating calendar page:', error);
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
