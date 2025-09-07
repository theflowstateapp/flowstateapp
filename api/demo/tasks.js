export default async function handler(req, res) {
  try {
    console.log('DEMO_TASKS: Generating tasks demo page');
    
    // Set headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tasks Demo - FlowState Demo</title>
    <meta name="description" content="FlowState tasks management with intelligent prioritization and time-blocking">
    <meta name="robots" content="index,follow">
    <meta property="og:title" content="Tasks Demo - FlowState Demo">
    <meta property="og:description" content="FlowState tasks management with intelligent prioritization and time-blocking">
    <meta property="og:image" content="https://theflowstateapp.com/og-image.svg">
    <meta property="og:url" content="https://theflowstateapp.com/demo/tasks">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Tasks Demo - FlowState Demo">
    <meta name="twitter:description" content="FlowState tasks management with intelligent prioritization and time-blocking">
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
      .priority { 
        display: inline-block; 
        padding: 2px 8px; 
        border-radius: 4px; 
        font-size: 0.75rem; 
        font-weight: 600; 
        margin-left: 8px; 
      }
      .priority.urgent { 
        background-color: #fee2e2; 
        color: #EF4444; 
      }
      .priority.high { 
        background-color: #fef3c7; 
        color: #F59E0B; 
      }
      .priority.medium { 
        background-color: #dbeafe; 
        color: #3B82F6; 
      }
      .priority.low { 
        background-color: #d1fae5; 
        color: #10B981; 
      }
      .time-chip { 
        background-color: #DBEAFE; 
        color: #1E40AF; 
        padding: 2px 8px; 
        border-radius: 12px; 
        font-size: 0.75rem; 
        font-weight: 600; 
        font-family: monospace; 
        margin-left: 8px; 
      }
      .context-chip { 
        background-color: #F3E8FF; 
        color: #7C3AED; 
        padding: 2px 8px; 
        border-radius: 12px; 
        font-size: 0.75rem; 
        font-weight: 600; 
        margin-left: 8px; 
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 15px; 
      }
      th, td { 
        border: 1px solid #e2e8f0; 
        padding: 10px; 
        text-align: left; 
      }
      th { 
        background-color: #f1f5f9; 
        font-weight: 600; 
        color: #475569; 
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
        <h1>Tasks (Read-only Demo)</h1>
        <p>Manage your tasks with intelligent prioritization and time-blocking.</p>

        <h2>📋 Alive Today</h2>
        <div class="card">
            <div style="margin-bottom: 15px; padding: 10px; background-color: #f8fafc; border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Complete project proposal</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                    <span class="priority high">HIGH</span>
                    <span class="time-chip">10:30–11:15</span>
                    <span class="context-chip">Deep Work</span>
                </div>
            </div>
            <div style="margin-bottom: 15px; padding: 10px; background-color: #f8fafc; border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Review team feedback</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                    <span class="priority medium">MEDIUM</span>
                    <span class="time-chip">due 2:00 pm</span>
                    <span class="context-chip">Admin</span>
                </div>
            </div>
            <div style="margin-bottom: 15px; padding: 10px; background-color: #f8fafc; border-radius: 6px;">
                <div style="font-weight: 600; margin-bottom: 8px;">Client call preparation</div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
                    <span class="priority high">HIGH</span>
                    <span class="time-chip">14:00–14:30</span>
                    <span class="context-chip">Call</span>
                </div>
            </div>
        </div>

        <h2>📊 Board Snapshot</h2>
        <div class="grid">
            <div class="card">
                <h3>📥 Inbox <span style="background-color: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">3</span></h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Review client feedback
                        <span class="priority high" style="margin-left: 8px;">HIGH</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">due Tomorrow</span>
                    </li>
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Update project timeline
                        <span class="priority medium" style="margin-left: 8px;">MEDIUM</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">due Fri</span>
                    </li>
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Schedule team meeting
                        <span class="priority low" style="margin-left: 8px;">LOW</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">due Next week</span>
                    </li>
                </ul>
            </div>

            <div class="card">
                <h3>⏭️ Next <span style="background-color: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">2</span></h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Complete project proposal
                        <span class="priority high" style="margin-left: 8px;">HIGH</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">due Today</span>
                    </li>
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Review team feedback
                        <span class="priority medium" style="margin-left: 8px;">MEDIUM</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">due Today</span>
                    </li>
                </ul>
            </div>

            <div class="card">
                <h3>🔄 In Progress <span style="background-color: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">1</span></h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Update documentation
                        <span class="priority low" style="margin-left: 8px;">LOW</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">due Tomorrow</span>
                    </li>
                </ul>
            </div>

            <div class="card">
                <h3>✅ Done <span style="background-color: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">5</span></h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Client call preparation
                        <span class="priority high" style="margin-left: 8px;">HIGH</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">completed Today</span>
                    </li>
                    <li style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; margin-bottom: 8px; font-size: 0.9rem;">
                        Team standup
                        <span class="priority medium" style="margin-left: 8px;">MEDIUM</span>
                        <span style="color: #64748b; font-size: 0.8rem; margin-left: 8px;">completed Today</span>
                    </li>
                </ul>
            </div>
        </div>

        <h2>📋 All Tasks (Top 20)</h2>
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Status</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Due</th>
                        <th scope="col">Estimate</th>
                        <th scope="col">Project/Area</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Complete project proposal</td>
                        <td>Next</td>
                        <td><span class="priority high">HIGH</span></td>
                        <td>Today</td>
                        <td>45m</td>
                        <td>Q4 Launch</td>
                    </tr>
                    <tr>
                        <td>Review team feedback</td>
                        <td>Next</td>
                        <td><span class="priority medium">MEDIUM</span></td>
                        <td>Today</td>
                        <td>30m</td>
                        <td>Q4 Launch</td>
                    </tr>
                    <tr>
                        <td>Update documentation</td>
                        <td>In Progress</td>
                        <td><span class="priority low">LOW</span></td>
                        <td>Tomorrow</td>
                        <td>60m</td>
                        <td>Technical</td>
                    </tr>
                    <tr>
                        <td>Client call preparation</td>
                        <td>Done</td>
                        <td><span class="priority high">HIGH</span></td>
                        <td>Today</td>
                        <td>30m</td>
                        <td>Sales</td>
                    </tr>
                    <tr>
                        <td>Team standup</td>
                        <td>Done</td>
                        <td><span class="priority medium">MEDIUM</span></td>
                        <td>Today</td>
                        <td>15m</td>
                        <td>Team</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Note:</strong> Drag-drop and edits available in interactive app.</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
            <a href="/api/demo/access?utm_source=demo-tasks" class="cta-button">Open Interactive Demo</a>
            <a href="/demo" class="cta-button cta-secondary">Back to Overview</a>
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

    res.status(200).send(html);

  } catch (error) {
    console.error('DEMO_TASKS: Error generating tasks page:', error);
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