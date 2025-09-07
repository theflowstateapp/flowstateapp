export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = process.env.APP_PREFERRED_REGION || "bom1";

import { supabaseAdmin } from '../../../lib/supabase.js';
import { withDbRetry } from '../../../lib/retry.js';

export async function GET() {
  const out: any = { 
    ok: true, 
    timestamp: new Date().toISOString(),
    runtime: "nodejs",
    dynamic: "force-dynamic",
    region: process.env.APP_PREFERRED_REGION || "bom1"
  };

  try {
    const sb = supabaseAdmin();
    const { data, error } = await withDbRetry(async () => {
      const result = await sb.from("tasks").select("id").limit(1);
      if (result.error) throw result.error;
      return result.data;
    });
    
    out.postgrest = "ok";
    out.sampleData = data;
  } catch (e: any) {
    out.postgrest = `error: ${e.message || e}`;
  }

  try {
    // Test workspace query
    const sb = supabaseAdmin();
    const { data, error } = await withDbRetry(async () => {
      const result = await sb.from("workspaces").select("id").limit(1);
      if (result.error) throw result.error;
      return result.data;
    });
    
    out.workspaces = "ok";
    out.workspaceData = data;
  } catch (e: any) {
    out.workspaces = `error: ${e.message || e}`;
  }

  return new Response(JSON.stringify(out), {
    status: 200,
    headers: { 
      "content-type": "application/json",
      "cache-control": "no-cache, no-store, must-revalidate",
      "access-control-allow-origin": "*"
    }
  });
}
