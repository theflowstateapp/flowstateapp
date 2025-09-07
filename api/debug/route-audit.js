export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Expected routes based on our current API structure
    const expectedRoutes = [
      // Demo pages
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
      "/api/demo/calendar",
      
      // Review API
      "/api/review/plan-next-week",
      
      // Health and debug
      "/api/health",
      "/api/debug/routes",
      
      // Tasks API
      "/api/tasks/create",
      "/api/tasks/schedule",
      "/api/tasks/list",
      "/api/tasks/today",
      "/api/tasks/next-suggested",
      
      // Other APIs
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

    // Expected rewrites (demo pages)
    const expectedRewrites = [
      "/demo",
      "/demo/tasks",
      "/demo/habits", 
      "/demo/journal",
      "/demo/review",
      "/demo/agenda",
      "/demo/settings",
      "/demo/calendar"
    ];

    const audit = {
      ok: true,
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      region: process.env.VERCEL_REGION || 'unknown',
      
      // Route information
      currentPath: req.url,
      method: req.method,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-vercel-id': req.headers['x-vercel-id']
      },
      
      // Expected routes
      expectedRoutes,
      expectedRewrites,
      
      // Function detection
      functionDetection: {
        hasDefaultExport: true,
        handlerType: typeof handler,
        isAsync: handler.constructor.name === 'AsyncFunction'
      },
      
      // Environment variables (safe ones only)
      env: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      },
      
      // Instructions
      instructions: {
        testRoutes: "Test each expected route with curl or browser",
        checkRewrites: "Verify /demo/* routes redirect to /api/demo/*",
        checkFunctions: "Ensure all functions export default handler",
        checkVercelConfig: "Verify vercel.json has correct rewrites and functions"
      }
    };

    res.status(200).json(audit);

  } catch (error) {
    console.error('Route audit error:', error);
    res.status(500).json({
      ok: false,
      error: String(error?.message || error),
      timestamp: new Date().toISOString()
    });
  }
}
