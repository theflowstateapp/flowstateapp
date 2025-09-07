// Test Supabase connection with service role key
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service Key (first 20 chars):', supabaseServiceKey?.substring(0, 20));
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase credentials',
        url: supabaseUrl ? 'Set' : 'Not set',
        serviceKey: supabaseServiceKey ? 'Set' : 'Not set'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Test a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error,
        url: supabaseUrl,
        keyPrefix: supabaseServiceKey?.substring(0, 20)
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supabase connection successful with service role',
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
