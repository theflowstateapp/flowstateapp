// Force Node.js runtime and avoid static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('X-Robots-Tag', 'index,follow');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({ 
    message: 'Demo test working via individual function',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
