// Test Supabase connection with detailed logging
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key (first 20 chars):', supabaseKey?.substring(0, 20));
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase credentials',
        url: supabaseUrl ? 'Set' : 'Not set',
        key: supabaseKey ? 'Set' : 'Not set'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

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
        keyPrefix: supabaseKey?.substring(0, 20)
      });
    }

    res.status(200).json({
      success: true,
      message: 'Supabase connection successful',
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
