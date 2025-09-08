module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // Test basic functionality
    const testResults = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      tests: {}
    };

    // Test 1: Basic require
    try {
      const demoPages = require('../lib/demo-pages.js');
      testResults.tests.basicRequire = { success: true, exports: Object.keys(demoPages) };
    } catch (error) {
      testResults.tests.basicRequire = { success: false, error: error.message };
    }

    // Test 2: Try to call a simple function
    try {
      const demoPages = require('../lib/demo-pages.js');
      const html = await demoPages.renderDemoOverviewHTML();
      testResults.tests.renderFunction = { success: true, htmlLength: html.length };
    } catch (error) {
      testResults.tests.renderFunction = { success: false, error: error.message };
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(testResults);
  } catch (error) {
    return res.status(500).json({ 
      ok: false, 
      error: error.message,
      stack: error.stack 
    });
  }
};
