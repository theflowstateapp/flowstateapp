const IST = "Asia/Kolkata";

/** Simple mock data without external dependencies */
function getSimpleMockData() {
  return {
    source: "mock",
    workspace: { 
      id: "demo-mock", 
      name: "FlowState Demo (Mock)", 
      timezone: IST 
    },
    tasks: [
      { 
        id: "t1",
        title: "Finish landing hero",
        status: "NEXT",
        priority: "HIGH",
        estimateMins: 45,
        context: "Deep Work",
        projectId: "p1",
        dueShiftDays: 0,
        startShiftMins: 90,
        durationMins: 45 
      },
      { 
        id: "t2",
        title: "Email partner re: UTM",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        estimateMins: 20,
        context: "Admin",
        projectId: "p2",
        dueShiftDays: 0,
        startShiftMins: 210,
        durationMins: 30 
      }
    ],
    habits: [
      { id: "h1", name: "Daily Exercise", targetPerWeek: 3 },
      { id: "h2", name: "Morning Meditation", targetPerWeek: 5 }
    ],
    habitLogs: [
      { habitId: "h1", dayShift: 0 },
      { habitId: "h1", dayShift: -1 },
      { habitId: "h2", dayShift: 0 },
      { habitId: "h2", dayShift: -2 }
    ],
    journal: [
      { 
        id: "j1",
        dayShift: 0, 
        mood: "🙂",
        excerpt: "Shipped homepage copy and tracked redirects." 
      }
    ]
  };
}

/** Try Supabase; fallback to simple mock on error */
async function fetchDemoDataSafe() {
  try {
    // For now, always return mock data to test the system
    return getSimpleMockData();
  } catch (e) {
    // Fallback to simple mock
    return getSimpleMockData();
  }
}

module.exports = { fetchDemoDataSafe, IST };