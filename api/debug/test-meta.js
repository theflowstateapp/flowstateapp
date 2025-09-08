module.exports = async function handler(req, res) {
  try {
    const { resolveDemoPageMeta } = require('../lib/demo-pages.js');
    const page = (req.query.page || "overview").toString();
    const meta = resolveDemoPageMeta(page);
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      success: true,
      page,
      meta,
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
