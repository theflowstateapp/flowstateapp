const { supabaseAdmin } = require("./supabase.js");
const { withDbRetry } = require("./retry.js");

async function logEventSafe(payload) {
  try {
    const sb = supabaseAdmin();
    const { error } = await withDbRetry(async () =>
      sb.from("analytics_events").insert([payload])
    );
    if (error) console.error("[analytics] insert error:", error.message || error);
  } catch (e) {
    console.error("[analytics] unexpected error:", e && e.message ? e.message : e);
  }
}

module.exports = { logEventSafe };
