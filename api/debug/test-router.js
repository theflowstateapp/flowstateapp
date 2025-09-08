module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // Set headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const debug = {
      url: req.url,
      query: req.query,
      route: req.query.route,
      page: req.query.page,
      isDemoRoute: req.query.route === 'demo',
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(debug);
  } catch (error) {
    return res.status(500).json({ 
      ok: false, 
      error: error.message,
      stack: error.stack 
    });
  }
};
