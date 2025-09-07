// Force Node.js runtime and avoid static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { renderDemoOverviewHTML } from '../lib/demo-pages.js';

export default async function handler(req, res) {
  try {
    // Test the import
    const html = await renderDemoOverviewHTML();
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.status(200).send(html);
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.status(200).json({
      ok: true,
      ts: new Date().toISOString(),
      env: process.env.VERCEL_ENV || process.env.NODE_ENV,
      runtime: "nodejs",
      dynamic: "force-dynamic",
      region: process.env.APP_PREFERRED_REGION || "bom1",
      error: String(error?.message || error)
    });
  }
}
