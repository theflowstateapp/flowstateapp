const { requireQASecret } = require("../../lib/qa-auth.js");
const { runSmoke } = require("../../lib/qa-smoke.js");
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  try {
    requireQASecret(req);
    if (req.method !== "POST" && req.method !== "GET") return res.status(405).json({ ok:false, error:"Method Not Allowed" });

    const startedAt = Date.now();
    const report = await runSmoke();
    const buildId = req.headers["x-site-build"] || process.env.SITE_BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || null;

    const row = {
      env: process.env.VERCEL_ENV || process.env.NODE_ENV || "production",
      build_id: buildId,
      version: buildId,
      ok: !!report.ok,
      total_ms: report.totalMs || (Date.now() - startedAt),
      steps: report.steps || [],
      artifacts: report.artifacts || {}
    };

    const { data, error } = await supabase
      .from("qa_runs")
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Failed to insert QA run:', error);
      return res.status(500).json({ ok: false, error: 'Failed to save QA run', details: error.message });
    }

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-QA-Secret, X-Site-Build");
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return res.status(200).json({ ok: true, saved: true, report, id: data.id });
  } catch (e) {
    console.error('QA Run error:', e);
    
    if (e.message === 'Forbidden') {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }
    
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
};
