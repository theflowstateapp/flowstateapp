const { supabaseAdmin } = require("../../lib/supabase.js");
const { withDbRetry } = require("../../lib/retry.js");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ ok:false, error:"Method Not Allowed" });
    
    const sb = supabaseAdmin();
    const { data, error } = await withDbRetry(async () =>
      sb.from("analytics_events").select("*").order("ts", { ascending:false }).limit(20)
    );
    
    if (error) throw error;
    
    return res.status(200).json({ 
      ok:true, 
      count: data?.length || 0, 
      events: data || [] 
    });
  } catch (e) {
    return res.status(500).json({ 
      ok:false, 
      error: String(e?.message || e) 
    });
  }
};
