export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Habits Demo - FlowState Demo</title>
    <meta name="description" content="FlowState habit tracking with streak visualization and progress heatmaps">
    <meta name="robots" content="index,follow">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; line-height: 1.6; }
      .container { max-width: 960px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      header { background-color: #1f2937; color: white; padding: 15px 20px; margin-bottom: 20px; border-radius: 8px; }
      header a { color: #60a5fa; text-decoration: none; margin: 0 8px; }
      h1 { color: #1F2937; margin-bottom: 20px; font-size: 2.5rem; }
      h2 { color: #1F2937; margin-top: 30px; margin-bottom: 15px; font-size: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
      .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
      .habit-streak { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; }
      .streak-number { font-size: 1.5rem; font-weight: 700; color: #0284c7; }
      .habit-pattern { font-family: monospace; font-size: 1.1rem; margin-top: 5px; }
      .cta-button { background-color: #0284c7; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; margin: 10px 5px; }
      .cta-secondary { background-color: #e0f2fe; color: #0284c7; border: 1px solid #0284c7; }
      footer { text-align: center; margin-top: 50px; padding: 20px; color: #6B7280; border-top: 1px solid #E5E7EB; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>FlowState Demo</h1>
            <div style="margin: 10px 0;">
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
        <h1>Habits (Read-only Demo)</h1>
        <p>Build and track habits with visual progress and streak tracking.</p>

        <h2>🔥 Habit Streaks</h2>
        <div class="card">
            <div class="habit-streak">
                <div>
                    <strong>Daily Exercise</strong><br>
                    <small>Daily</small>
                    <div class="habit-pattern">✓ ✓ ✓ ✓ ✓ ✓ ✓</div>
                </div>
                <div>
                    <div class="streak-number">7</div>
                    <small style="color: #64748b;">current streak</small><br>
                    <small style="color: #64748b;">longest: 15</small>
                </div>
            </div>
            <div class="habit-streak">
                <div>
                    <strong>Morning Meditation</strong><br>
                    <small>Daily</small>
                    <div class="habit-pattern">✓ ✓ ✓ ✓ ✓ ✓ ✓</div>
                </div>
                <div>
                    <div class="streak-number">12</div>
                    <small style="color: #64748b;">current streak</small><br>
                    <small style="color: #64748b;">longest: 25</small>
                </div>
            </div>
            <div class="habit-streak">
                <div>
                    <strong>Read Books</strong><br>
                    <small>Daily</small>
                    <div class="habit-pattern">✓ ✓ ✓ ✓ ✓ · ·</div>
                </div>
                <div>
                    <div class="streak-number">5</div>
                    <small style="color: #64748b;">current streak</small><br>
                    <small style="color: #64748b;">longest: 20</small>
                </div>
            </div>
        </div>

        <h2>📊 90-Day Heatmap</h2>
        <div class="card">
            <p style="text-align: center; color: #64748b; margin-bottom: 20px;">
                <span style="background-color: #10B981; color: white; padding: 2px 6px; border-radius: 3px; margin-right: 10px;">■</span>
                Completed
                <span style="background-color: #e2e8f0; color: #64748b; padding: 2px 6px; border-radius: 3px; margin-left: 20px; margin-right: 10px;">■</span>
                Not completed
            </p>
            <div style="font-family: monospace; font-size: 0.8rem; line-height: 1.2; text-align: center;">
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; max-width: 400px; margin: 0 auto;">
                    <div style="text-align: center; font-weight: bold; padding: 4px;">S</div>
                    <div style="text-align: center; font-weight: bold; padding: 4px;">M</div>
                    <div style="text-align: center; font-weight: bold; padding: 4px;">T</div>
                    <div style="text-align: center; font-weight: bold; padding: 4px;">W</div>
                    <div style="text-align: center; font-weight: bold; padding: 4px;">T</div>
                    <div style="text-align: center; font-weight: bold; padding: 4px;">F</div>
                    <div style="text-align: center; font-weight: bold; padding: 4px;">S</div>
                    <div style="background-color: #10B981; width: 12px; height: 12px; border-radius: 2px; margin: 1px;"></div>
                    <div style="background-color: #10B981; width: 12px; height: 12px; border-radius: 2px; margin: 1px;"></div>
                    <div style="background-color: #10B981; width: 12px; height: 12px; border-radius: 2px; margin: 1px;"></div>
                    <div style="background-color: #10B981; width: 12px; height: 12px; border-radius: 2px; margin: 1px;"></div>
                    <div style="background-color: #10B981; width: 12px; height: 12px; border-radius: 2px; margin: 1px;"></div>
                    <div style="background-color: #e2e8f0; width: 12px; height: 12px; border-radius: 2px; margin: 1px;"></div>
                    <div style="background-color: #10B981; width: 12px; height: 12px; border-radius: 2px; margin: 1px;"></div>
                </div>
            </div>
        </div>

        <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Note:</strong> 1-tap check-ins and heatmap interactions available in interactive app.</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
            <a href="/api/demo/access?utm_source=demo-habits" class="cta-button">Open Interactive Demo</a>
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
    res.status(500).send('<html><body><h1>Demo temporarily unavailable</h1></body></html>');
  }
}