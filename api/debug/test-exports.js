module.exports = async function handler(req, res) {
  try {
    const demoPages = require('../lib/demo-pages.js');
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      exports: Object.keys(demoPages),
      resolveDemoPageMetaType: typeof demoPages.resolveDemoPageMeta,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ 
      ok: false, 
      error: error.message,
      stack: error.stack 
    });
  }
};
