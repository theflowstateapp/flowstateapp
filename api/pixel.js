function ip(req){ 
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() 
      || req.headers["x-real-ip"] 
      || req.connection?.remoteAddress 
      || ""; 
}

// Pre-encoded 1×1 transparent GIF bytes
const GIF = Buffer.from("47494638396101000100f00000ffffff00000021f90401000001002c00000000010001000002024401003b","hex");

module.exports = async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin","*");
      res.setHeader("Access-Control-Allow-Methods","GET,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers","content-type");
      return res.status(204).end();
    }
    if (req.method !== "GET") return res.status(405).end();

    const { page, v, src } = req.query || {};
    
    // Fire-and-forget log (simplified for now)
    console.log("[analytics] View event:", {
      type: "view",
      src: src ? String(src) : "page",
      variant: v ? String(v) : null,
      to_key: null,
      plan: null,
      path: req.url,
      referer: req.headers["referer"] || "",
      ip: ip(req),
      ua: req.headers["user-agent"] || ""
    });

    res.setHeader("Content-Type","image/gif");
    res.setHeader("Cache-Control","no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Content-Length", String(GIF.length));
    return res.status(200).end(GIF);
  } catch (e) {
    // On error still return a tiny gif to avoid breaking pages
    res.setHeader("Content-Type","image/gif");
    return res.status(200).end(GIF);
  }
};