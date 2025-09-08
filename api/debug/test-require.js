module.exports = async function handler(req, res) {
  try {
    const testResults = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    // Test 1: Try to require from api/lib
    try {
      const demoPages = require('./lib/demo-pages.js');
      testResults.tests.apiLibRequire = { success: true, exports: Object.keys(demoPages) };
    } catch (error) {
      testResults.tests.apiLibRequire = { success: false, error: error.message };
    }

    // Test 2: Try to require from root lib
    try {
      const demoPages = require('../lib/demo-pages.js');
      testResults.tests.rootLibRequire = { success: true, exports: Object.keys(demoPages) };
    } catch (error) {
      testResults.tests.rootLibRequire = { success: false, error: error.message };
    }

    // Test 3: Try to require from lib (same level)
    try {
      const demoPages = require('../lib/demo-pages.js');
      testResults.tests.libRequire = { success: true, exports: Object.keys(demoPages) };
    } catch (error) {
      testResults.tests.libRequire = { success: false, error: error.message };
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
