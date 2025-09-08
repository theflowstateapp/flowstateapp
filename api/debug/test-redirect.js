module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const { to, src, v, plan } = req.query || {};
    
    return res.status(200).json({
      ok: true,
      query: { to, src, v, plan },
      method: req.method,
      url: req.url
    });
  } catch (e) {
    return res.status(500).json({ 
      ok: false, 
      error: String(e?.message || e) 
    });
  }
};
