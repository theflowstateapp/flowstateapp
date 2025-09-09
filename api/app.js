const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    // Set headers for HTML content
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Served-By', 'react-app-server');

    // Try to read the built React app
    const buildPath = path.join(process.cwd(), 'build', 'index.html');
    
    if (fs.existsSync(buildPath)) {
      // Serve the built React app
      const html = fs.readFileSync(buildPath, 'utf8');
      res.status(200).send(html);
    } else {
      // Fallback: serve a simple HTML page with React app loading
      const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowState App - Loading...</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0; 
            padding: 40px; 
            background: #f8fafc; 
            text-align: center;
        }
        .loading { 
            color: #64748b; 
            font-size: 18px; 
            margin-top: 20px;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <h1>FlowState App</h1>
    <div class="spinner"></div>
    <div class="loading">Loading Sidebar v2...</div>
    <p>If this page doesn't load properly, please try refreshing or contact support.</p>
</body>
</html>`;
      res.status(200).send(fallbackHtml);
    }
  } catch (error) {
    console.error('Error serving React app:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>FlowState - Error</title></head>
        <body style="font-family: system-ui; text-align: center; padding: 40px;">
          <h1>App Temporarily Unavailable</h1>
          <p>We're experiencing technical difficulties. Please try again later.</p>
          <p><a href="/demo">Try Demo Instead</a></p>
        </body>
      </html>
    `);
  }
};
