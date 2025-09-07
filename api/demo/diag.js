
import { supabaseAdmin } from '../../lib/supabase.js';
import { withDbRetry } from '../../lib/retry.js';

export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "OPTIONS") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }
    
    res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const out = { 
    ok: true, 
    timestamp: new Date().toISOString(),
    runtime: "nodejs",
    dynamic: "force-dynamic",
    region: process.env.APP_PREFERRED_REGION || "bom1"
  };

  try {
    const sb = supabaseAdmin();
    const { data, error } = await withDbRetry(async () => {
      const result = await sb.from("tasks").select("id").limit(1);
      if (result.error) throw result.error;
      return result.data;
    });
    
    out.postgrest = "ok";
    out.sampleData = data;
  } catch (e) {
    out.postgrest = `error: ${e.message || e}`;
  }

  try {
    // Test workspace query
    const sb = supabaseAdmin();
    const { data, error } = await withDbRetry(async () => {
      const result = await sb.from("workspaces").select("id").limit(1);
      if (result.error) throw result.error;
      return result.data;
    });
    
    out.workspaces = "ok";
    out.workspaceData = data;
  } catch (e) {
    out.workspaces = `error: ${e.message || e}`;
  }

    res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
