const { utcToZonedTime, zonedTimeToUtc } = require("date-fns-tz");
const { startOfWeek, addMinutes, addDays } = require("date-fns");
const { supabaseAdmin } = require("./supabase.js");
const { withDbRetry } = require("./retry.js");

const IST = "Asia/Kolkata";

function nowIST() {
  return utcToZonedTime(new Date(), IST);
}

function weekStartIST(d) {
  return startOfWeek(d, { weekStartsOn: 1 });
}

/** Rebase mock JSON to current IST week (Mon–Sun) */
function rebaseMock(mock) {
  const now = nowIST();
  const wkStart = weekStartIST(now); // Mon 00:00 IST
  
  // Map tasks
  const tasks = (mock.tasks || []).map(t => {
    const dueAt = t.dueShiftDays != null ? zonedTimeToUtc(addDays(wkStart, t.dueShiftDays), IST) : null;
    let startAt = null, endAt = null;
    if (t.startShiftMins != null && t.durationMins != null) {
      const s = zonedTimeToUtc(addMinutes(wkStart, t.startShiftMins), IST);
      const e = zonedTimeToUtc(addMinutes(wkStart, t.startShiftMins + t.durationMins), IST);
      startAt = s; 
      endAt = e;
    }
    return { ...t, dueAt, startAt, endAt };
  });
  
  // Map habit logs to real dates (UTC instants at local noon)
  const logs = (mock.habitLogs || []).map(h => {
    const z = addDays(wkStart, h.dayShift || 0);
    const noonZ = new Date(z); 
    noonZ.setHours(12,0,0,0);
    const at = zonedTimeToUtc(noonZ, IST);
    return { ...h, at };
  });
  
  // Journal dates
  const journal = (mock.journal || []).map(j => {
    const z = addDays(wkStart, j.dayShift || 0);
    const nineZ = new Date(z); 
    nineZ.setHours(9,0,0,0);
    const at = zonedTimeToUtc(nineZ, IST);
    return { ...j, at };
  });
  
  return { ...mock, tasks, habitLogs: logs, journal };
}

/** Try Supabase; fallback to mock JSON on error or zero rows */
async function fetchDemoDataSafe(opts = {}) {
  const { force } = opts;
  
  // Force mock mode - skip Supabase entirely
  if (force === "mock") {
    try {
      const mock = require("../data/demo-mock.json");
      const rebased = rebaseMock(mock);
      return { source: "mock", ...rebased };
    } catch (e) {
      // ultimate fallback: empty safe object
      return { 
        source: "empty", 
        workspace: { id:"demo-mock", name:"FlowState Demo (Empty)", timezone: IST }, 
        tasks: [], 
        habits: [], 
        habitLogs: [], 
        journal: [] 
      };
    }
  }
  
  // Force live mode - try Supabase only, throw on error
  if (force === "live") {
    try {
      const sb = supabaseAdmin();
      const [{ data: ws }, { data: tasks }, { data: habits }] = await Promise.all([
        withDbRetry(() => sb.from("workspaces").select("id,name,timezone").eq("is_demo", true).limit(1).maybeSingle()),
        withDbRetry(() => sb.from("tasks").select("id,title,status,priority,estimate_mins,context,project_id,area_id,due_at,start_at,end_at").limit(50)),
        withDbRetry(() => sb.from("habits").select("id,name,target_per_week").limit(20))
      ]);

      if (!ws || !tasks || tasks.length === 0) {
        throw new Error("demo data missing");
      }

      return { source: "supabase", ws, tasks, habits };
    } catch (e) {
      throw new Error(`Live mode failed: ${e.message}`);
    }
  }
  
  // Default behavior - try Supabase, fallback to mock
  try {
    const sb = supabaseAdmin();
    const [{ data: ws }, { data: tasks }, { data: habits }] = await Promise.all([
      withDbRetry(() => sb.from("workspaces").select("id,name,timezone").eq("is_demo", true).limit(1).maybeSingle()),
      withDbRetry(() => sb.from("tasks").select("id,title,status,priority,estimate_mins,context,project_id,area_id,due_at,start_at,end_at").limit(50)),
      withDbRetry(() => sb.from("habits").select("id,name,target_per_week").limit(20))
    ]);

    if (!ws || !tasks || tasks.length === 0) throw new Error("demo data missing");

    return { source: "supabase", ws, tasks, habits };
  } catch (e) {
    // Fallback to mock
    try {
      const mock = require("../data/demo-mock.json");
      const rebased = rebaseMock(mock);
      return { source: "mock", ...rebased };
    } catch (e2) {
      // ultimate fallback: empty safe object
      return { 
        source: "empty", 
        workspace: { id:"demo-mock", name:"FlowState Demo (Empty)", timezone: IST }, 
        tasks: [], 
        habits: [], 
        habitLogs: [], 
        journal: [] 
      };
    }
  }
}

module.exports = { fetchDemoDataSafe, IST };
