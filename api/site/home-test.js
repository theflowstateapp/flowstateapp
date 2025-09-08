module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "OPTIONS") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // Set headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("X-Served-By", "site-router");
    res.setHeader("X-Site-Build", "test-build");

    // Check if this is a demo route
    if (req.query.route === 'demo') {
      const page = (req.query.page || "overview").toString();
      
      try {
        const demoPages = require('./lib/demo-pages.js');
        let html;
        
        switch (page) {
          case "overview":
            html = await demoPages.renderDemoOverviewHTML();
            break;
          case "tasks":
            html = await demoPages.renderDemoTasksHTML();
            break;
          case "habits":
            html = await demoPages.renderDemoHabitsHTML();
            break;
          case "journal":
            html = await demoPages.renderDemoJournalHTML();
            break;
          case "review":
            html = await demoPages.renderDemoReviewHTML();
            break;
          case "agenda":
            html = await demoPages.renderDemoAgendaHTML();
            break;
          case "settings":
            html = await demoPages.renderDemoSettingsHTML();
            break;
          default:
            html = await demoPages.renderDemoOverviewHTML();
            break;
        }
        
        return res.status(200).send(html);
      } catch (error) {
        console.error('DEMO_ROUTER: Error rendering demo page:', error);
        const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Temporarily Unavailable - FlowState</title>
    <style>
        body { font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }
        .error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px; }
    </style>
</head>
<body>
    <h1>Demo Temporarily Unavailable</h1>
    <div class="error">
        <strong>Error:</strong> We're experiencing technical difficulties. Please try again in a moment.
        <br><br>
        <strong>Debug Info:</strong> ${error.message}
    </div>
    <a href="/api/demo/access" class="cta-button">Open Interactive Demo</a>
    <a href="/api/demo/static" class="cta-button">See Static Preview</a>
    <small style="display: block; margin-top: 20px; color: #64748b;">Build: test-build</small>
</body>
</html>`;
        return res.status(200).send(fallbackHtml);
      }
    }

    // Default: Return a simple homepage
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowState - Test Homepage</title>
    <style>
        body { font-family: system-ui; padding: 40px; max-width: 600px; margin: 0 auto; text-align: center; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 10px; }
    </style>
</head>
<body>
    <h1>FlowState Test Homepage</h1>
    <p>This is a test version of the homepage.</p>
    <a href="/demo" class="cta-button">View Demo</a>
    <a href="/api/demo/static" class="cta-button">Static Preview</a>
    <small style="display: block; margin-top: 20px; color: #64748b;">Build: test-build</small>
</body>
</html>`;

    return res.status(200).send(html);
  } catch (error) {
    console.error('SITE_ROUTER: Error:', error);
    return res.status(500).json({ 
      ok: false, 
      error: error.message,
      stack: error.stack 
    });
  }
};
