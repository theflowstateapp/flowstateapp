// Simplified supabase without external dependencies
function supabaseAdmin() {
  // Return a mock client that always fails
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          limit: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: new Error("Mock Supabase - always fails") })
          })
        })
      })
    })
  };
}

module.exports = { supabaseAdmin };