import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), ".vercel", "output", "functions");
const want = [
  "api/health.func",
  "api/demo/access.func",
  "api/demo/exchange.func",
  "api/demo/static.func",
  "api/demo/index.func",
  "api/demo/test.func",
  "api/demo/overview.func",
  "api/debug/routes.func",
  "api/tasks/create.func",
  "api/tasks/schedule.func",
  "api/tasks/list.func",
  "api/tasks/today.func",
  "api/tasks/next-suggested.func",
  "api/schedule/propose.func",
  "api/capture.func",
  "api/auth/login.func",
  "api/auth/register.func",
  "api/auth/profile.func",
  "api/integrations/list.func",
  "api/integrations/connect/google-calendar.func",
  "api/integrations/connect/gmail.func",
  "api/integrations/connect/apple-reminders.func",
  "api/integrations/connect/todoist.func",
  "api/integrations/auth/google/callback.func",
  "api/ai/suggestions.func",
  "api/ai/voice-process.func",
  "api/projects/list.func",
  "api/notes/list.func"
];

if (!fs.existsSync(root)) {
  console.error("No .vercel/output/functions directory. Run: npm run build:vercel");
  process.exit(1);
}

const found = [];
function walk(dir, rel = "") {
  for (const e of fs.readdirSync(dir)) {
    const abs = path.join(dir, e);
    const r = path.join(rel, e);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) walk(abs, r);
    else if (e.endsWith(".vc-config.json")) found.push(rel);
  }
}
walk(root);

const missing = want.filter(w => !found.some(f => f.startsWith(w)));
console.log("Found functions:", found.sort());
if (missing.length) {
  console.error("Missing functions:", missing);
  process.exit(2);
} else {
  console.log("All expected functions are present in the build output ✅");
}
