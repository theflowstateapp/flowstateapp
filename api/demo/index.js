// Vercel Serverless Function - Demo Overview
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('X-Robots-Tag', 'index,follow');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).send('<html><body><h1>Demo Overview</h1><p>This is a test.</p></body></html>');
}