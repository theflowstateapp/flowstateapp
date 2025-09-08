const { createClient } = require("@supabase/supabase-js");

// Use globalThis instead of global for ES modules compatibility
const globalCache = globalThis;

function supabaseAdmin() {
  if (!globalCache.__supabaseAdmin__) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    
    globalCache.__supabaseAdmin__ = createClient(url, key, {
      auth: { 
        persistSession: false, 
        autoRefreshToken: false 
      },
      global: { 
        headers: { 
          "x-application-name": "flowstate-demo/1.0" 
        } 
      },
    });
  }
  return globalCache.__supabaseAdmin__;
}

module.exports = { supabaseAdmin };
