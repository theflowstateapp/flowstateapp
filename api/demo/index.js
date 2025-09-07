export default async function handler(req, res) {
  console.log('DEMO_OVERVIEW: Starting handler');
  
  try {
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
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
      .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
      h1 { color: #333; }
      .cta-button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>FlowState Demo Overview</h1>
        <p>This is a simplified demo overview page.</p>
        <p>Current time: ${new Date().toISOString()}</p>
        <a href="/api/demo/access" class="cta-button">Open Interactive Demo</a>
    </div>
</body>
</html>`;

    console.log('DEMO_OVERVIEW: Sending response');
    res.status(200).send(html);

  } catch (error) {
    console.error('DEMO_OVERVIEW: Error:', error);
    res.status(500).send('Error: ' + error.message);
  }
}