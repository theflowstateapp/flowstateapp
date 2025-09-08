const DESTS = {
  demo_access:  "/api/demo/access",
  static_preview:"/api/demo/static",
  pricing_free: "/api/demo/access",
  pro_waitlist: "mailto:hello@theflowstateapp.com?subject=Join%20Pro%20waitlist"
};

function buildURL(base, params) {
  const hasQ = base.includes("?");
  const sep = hasQ ? "&" : "?";
  const q = new URLSearchParams(params).toString();
  return base + sep + q;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "content-type");
      return res.status(204).end();
    }
    if (req.method !== "GET") {
      return res.status(405).json({ ok:false, error:"Method Not Allowed" });
    }

    const { to, src, v, plan } = req.query || {};
    const toKey = String(to || "");
    if (!DESTS[toKey]) {
      return res.status(400).json({ ok:false, error:"Unknown destination" });
    }

    // Build destination with UTM + variant
    const dest = DESTS[toKey];
    const params = {};
    if (toKey === "demo_access")  params.utm_source = src || "redirect";
    if (toKey === "static_preview") params.utm_source = src || "redirect";
    if (plan) params.plan = String(plan);
    if (v)    params.v = String(v);

    const location = buildURL(dest, params);

    // Log event (fire-and-forget) - simplified for now
    console.log("[analytics] Event:", {
      type: "click",
      src: src ? String(src) : null,
      variant: v ? String(v) : null,
      plan: plan ? String(plan) : null,
      to_key: toKey,
      path: req.url,
      referer: req.headers["referer"] || "",
      ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "",
      ua: req.headers["user-agent"] || ""
    });

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Location", location);
    return res.status(302).end();
  } catch (e) {
    return res.status(500).json({ ok:false, error: String(e?.message || e) });
  }
};