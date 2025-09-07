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
    <title>Journal Demo - FlowState Demo</title>
    <meta name="description" content="FlowState journal with mood tracking, tagging, and reflection features">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; line-height: 1.6; }
      .container { max-width: 960px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      header { background-color: #1f2937; color: white; padding: 15px 20px; margin-bottom: 20px; border-radius: 8px; }
      header a { color: #60a5fa; text-decoration: none; margin: 0 8px; }
      h1 { color: #1F2937; margin-bottom: 20px; font-size: 2.5rem; }
      h2 { color: #1F2937; margin-top: 30px; margin-bottom: 15px; font-size: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
      .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
      .priority { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; margin-left: 8px; }
      .priority.positive { background-color: #d1fae5; color: #10B981; }
      .priority.neutral { background-color: #dbeafe; color: #3B82F6; }
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
        <h1>Journal (Read-only Demo)</h1>
        <p>Capture thoughts, track mood, and reflect on your daily progress.</p>

        <h2>📝 Today's Entry</h2>
        <div class="card">
            <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <span style="color: #64748b; font-size: 0.9rem; margin-right: 15px;">
                        ${new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          timeZone: 'Asia/Kolkata'
                        })}
                    </span>
                    <span class="priority positive">Positive</span>
                </div>
                <p>Great progress on the project today. Team collaboration was excellent and we made significant headway on the Q4 launch planning. The AI integration testing went smoothly, and I'm feeling optimistic about our timeline...</p>
                <div style="margin-top: 10px;">
                    <small style="color: #64748b;">Tags: </small>
                    <span style="background-color: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem; margin-right: 5px;">work</span>
                    <span style="background-color: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem; margin-right: 5px;">team</span>
                    <span style="background-color: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem; margin-right: 5px;">progress</span>
                </div>
            </div>
        </div>

        <h2>📚 Recent Entries</h2>
        <div class="card">
            <div style="border-bottom: 1px solid #e2e8f0; padding: 15px 0; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="color: #64748b; font-size: 0.9rem; margin-right: 15px;">
                        ${new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          timeZone: 'Asia/Kolkata'
                        })}
                    </span>
                    <span class="priority neutral">Neutral</span>
                </div>
                <p style="margin-bottom: 8px;">Focused on documentation updates and code reviews. Productive day but feeling a bit overwhelmed with the number of tasks...</p>
                <div>
                    <small style="color: #64748b;">Tags: </small>
                    <span style="background-color: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem; margin-right: 5px;">work</span>
                    <span style="background-color: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 12px; font-size: 0.75rem; margin-right: 5px;">documentation</span>
                </div>
            </div>
        </div>

        <h2>🔗 Related Tasks & Projects</h2>
        <div class="card">
            <p style="color: #64748b; margin-bottom: 15px;">Quick links to related work:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">Project Proposal</span>
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">Team Meeting</span>
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">Client Call</span>
                <span style="background-color: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">Documentation</span>
            </div>
        </div>

        <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Note:</strong> Full editor, tagging, and search available in interactive app.</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
            <a href="/api/demo/access?utm_source=demo-journal" class="cta-button">Open Interactive Demo</a>
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