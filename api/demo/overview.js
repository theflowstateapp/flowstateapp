export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('X-Robots-Tag', 'index,follow');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({ 
    message: 'New demo overview function working',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
