const { resolveDemoPageMeta } = require('../lib/demo-pages.js');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const page = (req.query.page || "overview").toString();
    const meta = resolveDemoPageMeta(page);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
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
