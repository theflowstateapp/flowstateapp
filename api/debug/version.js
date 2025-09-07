// Force Node.js runtime and avoid static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel node function config (helps with recognition + region)
export const config = { runtime: "nodejs", maxDuration: 5, regions: ["bom1"] };

// bump this string each commit (or set via env in CI)
const BUILD_ID = process.env.SITE_BUILD_ID || new Date().toISOString();

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("X-Site-Build", BUILD_ID);

    const response = {
      ok: true,
      ts: new Date().toISOString(),
      buildId: BUILD_ID,
      env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      region: process.env.VERCEL_REGION || 'unknown',
      runtime: 'nodejs18.x'
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('VERSION: Error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("X-Site-Build", BUILD_ID);
    
    res.status(500).json({
      ok: false,
      error: String(error?.message || error),
      buildId: BUILD_ID,
      ts: new Date().toISOString()
    });
  }
}
