export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = process.env.APP_PREFERRED_REGION || "bom1";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    ts: new Date().toISOString(),
    env: process.env.VERCEL_ENV || process.env.NODE_ENV,
    runtime: "nodejs",
    dynamic: "force-dynamic",
    region: process.env.APP_PREFERRED_REGION || "bom1"
  }), { 
    status: 200, 
    headers: { 
      "content-type": "application/json",
      "cache-control": "no-cache, no-store, must-revalidate",
      "access-control-allow-origin": "*"
    }
  });
}
