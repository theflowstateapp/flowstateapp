export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = process.env.APP_PREFERRED_REGION || "bom1";

export async function GET() {
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
  
  return new Response(JSON.stringify({
    expected,
    timestamp: new Date().toISOString(),
    runtime: "nodejs",
    dynamic: "force-dynamic",
    region: process.env.APP_PREFERRED_REGION || "bom1",
    note: "This is a static list of expected routes. In production, this would scan the filesystem."
  }), {
    status: 200,
    headers: { 
      "content-type": "application/json",
      "cache-control": "no-cache, no-store, must-revalidate",
      "access-control-allow-origin": "*"
    }
  });
}
