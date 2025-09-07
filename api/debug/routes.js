
export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "OPTIONS") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Expected routes based on our current API structure
  const expected = [
    "/api/health",
    "/api/demo/access",
    "/api/demo/exchange", 
    "/api/demo/static",
    "/api/demo/index",
    "/api/demo/test",
    "/api/demo/overview",
    "/api/demo/diag",
    "/api/demo/test-supabase",
    "/api/demo/tasks",
    "/api/demo/habits",
    "/api/demo/journal",
    "/api/demo/review",
    "/api/demo/agenda",
    "/api/demo/settings",
    "/api/tasks/create",
    "/api/tasks/schedule",
    "/api/tasks/list",
    "/api/tasks/today",
    "/api/tasks/next-suggested",
    "/api/schedule/propose",
    "/api/capture",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/profile",
    "/api/integrations/list",
    "/api/integrations/connect/google-calendar",
    "/api/integrations/connect/gmail",
    "/api/integrations/connect/apple-reminders",
    "/api/integrations/connect/todoist",
    "/api/integrations/auth/google/callback",
    "/api/ai/suggestions",
    "/api/ai/voice-process",
    "/api/projects/list",
    "/api/notes/list"
  ];
  
    res.status(200).json({
      expected,
      timestamp: new Date().toISOString(),
      runtime: "nodejs",
      region: process.env.VERCEL_REGION || "bom1",
      note: "This is a static list of expected routes. In production, this would scan the filesystem."
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
