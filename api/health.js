export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "OPTIONS") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.status(200).json({
      ok: true,
      ts: new Date().toISOString(),
      env: process.env.VERCEL_ENV || process.env.NODE_ENV,
      runtime: "nodejs",
      region: process.env.VERCEL_REGION || "bom1"
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
