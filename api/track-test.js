module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    return res.status(200).json({
      ok: true,
      message: "Track endpoint working",
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
