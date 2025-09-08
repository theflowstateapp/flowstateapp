module.exports = async function handler(req, res) {
  try {
    const { to, src, v, plan } = req.query || {};
    
    return res.status(200).json({
      ok: true,
      method: req.method,
      query: { to, src, v, plan },
      headers: {
        'user-agent': req.headers['user-agent'],
        'referer': req.headers['referer']
      }
    });
  } catch (e) {
    return res.status(500).json({ 
      ok: false, 
      error: String(e?.message || e) 
    });
  }
};
