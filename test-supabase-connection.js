// Test Supabase connection
// Add this to the browser console to test the connection

import { supabase } from './src/lib/supabase.js';

// Test the connection
async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
    console.log('Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
    
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful!');
    }
  } catch (err) {
    console.error('Connection test failed:', err);
  }
}

testSupabaseConnection();
