export default async function handler(req, res) {
  try {
    console.log('STATIC_DEMO: Starting handler');
    
    // Set headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

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
    <title>FlowState Demo - AI-Powered Productivity Platform</title>
    <meta name="description" content="Experience FlowState's AI-powered productivity platform with GTD methodology, task management, habit tracking, and intelligent automation.">
    <meta name="robots" content="index,follow">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="FlowState Demo - AI-Powered Productivity Platform">
    <meta property="og:description" content="Experience FlowState's AI-powered productivity platform with GTD methodology, task management, habit tracking, and intelligent automation.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://theflowstateapp.com/api/demo/static">
    <meta property="og:image" content="https://theflowstateapp.com/og-image.svg">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="FlowState Demo - AI-Powered Productivity Platform">
    <meta name="twitter:description" content="Experience FlowState's AI-powered productivity platform with GTD methodology, task management, habit tracking, and intelligent automation.">
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
      h1 { 
        color: #1F2937; 
        margin-bottom: 20px; 
        font-size: 2.5rem; 
        text-align: center; 
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
      .task-title { 
        font-weight: 600; 
        margin-bottom: 8px; 
      }
      .task-chips { 
        display: flex; 
        gap: 8px; 
        margin-bottom: 8px; 
        flex-wrap: wrap; 
      }
      .priority { 
        background-color: #fef3c7; 
        color: #92400e; 
        padding: 2px 8px; 
        border-radius: 4px; 
        font-size: 0.8rem; 
        font-weight: 600; 
      }
      .time-window { 
        background-color: #dbeafe; 
        color: #1e40af; 
        padding: 2px 8px; 
        border-radius: 4px; 
        font-size: 0.8rem; 
      }
      .context-chip { 
        background-color: #f3e8ff; 
        color: #7c3aed; 
        padding: 2px 8px; 
        border-radius: 4px; 
        font-size: 0.8rem; 
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
    <div class="container">
        <h1>FlowState Demo</h1>
        <p style="text-align: center; font-size: 1.1rem; color: #64748b; margin-bottom: 30px;">
            A snapshot of your productivity on <strong>${today}</strong>
        </p>

        <h2>📊 Dashboard Snapshot</h2>
        <div class="stat-grid">
            <div class="stat-item">
                <div class="stat-number">12</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">5</div>
                <div class="stat-label">Completed This Week</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">8.5</div>
                <div class="stat-label">Scheduled Hours</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">2</div>
                <div class="stat-label">Active Projects</div>
            </div>
        </div>

        <h2>📋 Tasks Overview</h2>
        <div class="grid">
            <div class="card">
                <h3>📋 Today</h3>
                <div class="task-title">Complete project proposal</div>
                <div class="task-chips">
                    <span class="priority">HIGH</span>
                    <span class="time-window">Wed, 10:30–11:15</span>
                    <span class="context-chip">Deep Work</span>
                </div>
                
                <div class="task-title">Review team feedback</div>
                <div class="task-chips">
                    <span class="priority">MEDIUM</span>
                    <span class="time-window">due 5:30 pm</span>
                    <span class="context-chip">Admin</span>
                </div>
                
                <div class="task-title">Update documentation</div>
                <div class="task-chips">
                    <span class="priority">LOW</span>
                    <span class="time-window">Tomorrow</span>
                </div>
                
                <div class="task-title">Client call preparation</div>
                <div class="task-chips">
                    <span class="priority">HIGH</span>
                    <span class="time-window">Fri</span>
                    <span class="context-chip">Call</span>
                </div>
                
                <div class="task-title">Team standup</div>
                <div class="task-chips">
                    <span class="priority">MEDIUM</span>
                    <span class="time-window">Wed, 9:00–9:30</span>
                </div>
            </div>

            <div class="card">
                <h3>🎯 Next suggested task</h3>
                <div style="background-color: #ecfdf5; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px;">
                    <div style="font-weight: 600; margin-bottom: 8px;">Complete project proposal</div>
                    <div style="color: #065f46; margin-bottom: 8px;">
                        Proposed: <strong>Wed, 10:30–11:15</strong> • Fits your deep work window
                    </div>
                    <div style="font-size: 0.9rem; color: #64748b;">
                        Accept/Reshuffle available in the interactive app.
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

        <h2>🤖 AI Capture (Read-only example)</h2>
        <div class="card">
            <h3>Example input</h3>
            <p style="font-style: italic; color: #64748b; margin-bottom: 20px;">
                "Finish landing page hero for DXB funnel by Friday; 45 mins; urgent"
            </p>
            
            <h3>What we heard</h3>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
                <div style="margin-bottom: 15px;">
                    <strong>Title:</strong> Finish landing page hero<br>
                    <strong>PARA:</strong> Project → DXB Real Estate Funnel<br>
                    <strong>Priority:</strong> <span class="priority">URGENT</span><br>
                    <strong>Due:</strong> Fri, 12 Sep, 5:00 pm<br>
                    <strong>Estimate:</strong> 45 mins<br>
                    <strong>Context:</strong> <span class="context-chip">Deep Work</span><br>
                    <strong>Suggested time block:</strong> <span class="time-window">Fri, 10:00–10:45</span> • fits deep-work window
                </div>
            </div>
            
            <p style="margin-top: 20px; text-align: center;">
                <a href="/api/demo/access" class="cta-button">Try this live → /api/demo/access</a>
            </p>
        </div>

        <h2>📈 Weekly Review Preview</h2>
        <div class="grid">
            <div class="card">
                <h3>✅ Completed This Week</h3>
                <ul>
                    <li>Project proposal draft</li>
                    <li>Team feedback review</li>
                    <li>Documentation updates</li>
                    <li>Client call preparation</li>
                    <li>Team standup</li>
                </ul>
            </div>
            <div class="card">
                <h3>⏳ Carry-overs</h3>
                <ul>
                    <li>Final project proposal</li>
                    <li>Team meeting scheduling</li>
                    <li>Code review completion</li>
                </ul>
            </div>
            <div class="card">
                <h3>🌟 Highlights</h3>
                <ul>
                    <li>Great team collaboration on Q4 launch</li>
                    <li>Successful AI integration testing</li>
                    <li>Improved work-life balance this week</li>
                </ul>
            </div>
        </div>

        <div style="text-align: center; margin: 40px 0;">
            <a href="/api/demo/access" class="cta-button">Open Interactive Demo</a>
            <a href="/demo" class="cta-button cta-secondary">See Demo Overview</a>
        </div>
    </div>
</body>
</html>`;

    console.log('STATIC_DEMO: Sending response');
    res.status(200).send(html);

  } catch (error) {
    console.error('STATIC_DEMO: Error:', error);
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