
export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "POST" && req.method !== "OPTIONS") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    res.status(200).json({
      ok: true,
      message: "Test function working",
      timestamp: new Date().toISOString(),
      path: req.url
    });

  } catch (error) {
    console.error('TEST: Error:', error);
    res.status(500).json({
      ok: false,
      error: String(error?.message || error)
    });
  }
}
