import { createClient, SupabaseClient } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line no-var
  var __supabaseAdmin__: SupabaseClient | undefined;
}

export function supabaseAdmin() {
  if (!global.__supabaseAdmin__) {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    
    global.__supabaseAdmin__ = createClient(url, key, {
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
  return global.__supabaseAdmin__!;
}
