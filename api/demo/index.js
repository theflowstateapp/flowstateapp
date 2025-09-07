export default async function handler(req, res) {
  try {
    console.log('DEMO_OVERVIEW: Generating demo overview page');
    
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
        <p>A snapshot of your productivity on <strong>${new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Kolkata'
        })}</strong>.</p>

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

        <div class="grid">
            <div class="card">
                <h3>📋 Today</h3>
                <p>Complete project proposal</p>
                <p>Review team feedback</p>
                <p>Update documentation</p>
                <p>Client call preparation</p>
                <p>Team standup</p>
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

        <h2>📋 Tasks Overview</h2>
        <div class="grid">
            <div class="card">
                <h4>📥 Inbox (3)</h4>
                <ul>
                    <li>Review client feedback</li>
                    <li>Update project timeline</li>
                    <li>Schedule team meeting</li>
                </ul>
            </div>
            <div class="card">
                <h4>⏭️ Next (2)</h4>
                <ul>
                    <li>Complete project proposal</li>
                    <li>Review team feedback</li>
                </ul>
            </div>
            <div class="card">
                <h4>🔄 In Progress (1)</h4>
                <ul>
                    <li>Update documentation</li>
                </ul>
            </div>
            <div class="card">
                <h4>✅ Done (5)</h4>
                <ul>
                    <li>Client call preparation</li>
                    <li>Team standup</li>
                    <li>Project planning</li>
                    <li>Code review</li>
                    <li>Documentation update</li>
                </ul>
            </div>
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
            <a href="/api/demo/access?utm_source=demo-overview" class="cta-button">Open Interactive Demo</a>
            <a href="/api/demo/static" class="cta-button cta-secondary">See Static Preview</a>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <h3>Explore More</h3>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                <a href="/demo/tasks" class="cta-button cta-secondary">Tasks</a>
                <a href="/demo/habits" class="cta-button cta-secondary">Habits</a>
                <a href="/demo/journal" class="cta-button cta-secondary">Journal</a>
                <a href="/demo/review" class="cta-button cta-secondary">Review</a>
                <a href="/demo/agenda" class="cta-button cta-secondary">Week Agenda</a>
                <a href="/demo/settings" class="cta-button cta-secondary">Settings</a>
            </div>
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