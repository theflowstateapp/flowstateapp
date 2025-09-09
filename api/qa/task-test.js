const { createClient } = require('@supabase/supabase-js');
const { requireQASecret } = require('../lib/qa-auth');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    requireQASecret(req);

    // Test task creation with minimal data
    const taskData = {
      name: 'Test Task',
      user_id: 'f6f735ad-aff1-4845-b4eb-1f160d304d70', // Existing user
      status: 'Not Started',
      priority_matrix: 'Priority 1. Important & Urgent'
    };

    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        ok: false,
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }

    res.status(200).json({
      ok: true,
      task: task
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
