export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = process.env.APP_PREFERRED_REGION || "bom1";

export async function GET() {
  const out: any = { 
    ok: true, 
    timestamp: new Date().toISOString(),
    runtime: "nodejs",
    dynamic: "force-dynamic",
    region: process.env.APP_PREFERRED_REGION || "bom1",
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlLength: process.env.SUPABASE_URL?.length || 0
    }
  };

  try {
    // Test basic Supabase client creation
    const { createClient } = await import('@supabase/supabase-js');
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    out.supabaseClient = "created successfully";
    
    // Test a simple query
    const { data, error } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (error) {
      out.query = `error: ${error.message}`;
    } else {
      out.query = "success";
      out.sampleData = data;
    }
    
  } catch (e: any) {
    out.error = e.message;
    out.stack = e.stack;
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
