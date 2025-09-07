// Force Node.js runtime and avoid static optimization
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { 
  renderDemoOverviewHTML, 
  renderDemoTasksHTML, 
  renderDemoHabitsHTML, 
  renderDemoJournalHTML, 
  renderDemoReviewHTML, 
  renderDemoAgendaHTML, 
  renderDemoSettingsHTML 
} from "../../lib/demo-pages.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // Get the page from query (?page=overview|tasks|habits|journal|review|agenda|settings)
    const page = (req.query.page || "overview").toString();

    let html;
    switch (page) {
      case "overview":  
        html = await renderDemoOverviewHTML(); 
        break;
      case "tasks":     
        html = await renderDemoTasksHTML(); 
        break;
      case "habits":    
        html = await renderDemoHabitsHTML(); 
        break;
      case "journal":   
        html = await renderDemoJournalHTML(); 
        break;
      case "review":    
        html = await renderDemoReviewHTML(); 
        break;
      case "agenda":    
        html = await renderDemoAgendaHTML(); 
        break;
      case "settings":  
        html = await renderDemoSettingsHTML(); 
        break;
      default:          
        html = await renderDemoOverviewHTML(); 
        break;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("X-Robots-Tag", "index,follow");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(html);
  } catch (e) {
    const msg = (e && e.message) ? e.message : String(e);
    const fallback = `<!doctype html><html><head><meta charset="utf-8"><title>Demo (temporary issue)</title></head><body style="font-family:system-ui;padding:24px;max-width:960px;margin:auto;">
      <h1>Demo temporarily unavailable</h1>
      <p>We hit a deployment hiccup. Please try again in a minute.</p>
      <pre style="background:#f6f6f6;padding:12px;border-radius:8px;white-space:pre-wrap;">${msg}</pre>
      <p><a href="/api/demo/access">Open Interactive Demo →</a></p>
    </body></html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(fallback);
  }
}
