const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function analyzeExistingSchema() {
  console.log('🔍 Analyzing Existing Database Schema...\n');

  try {
    // Test connection
    console.log('1️⃣ Testing Supabase connection...');
    const { data: healthCheck, error: healthError } = await supabase.from('profiles').select('count').limit(1);
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return;
    }
    console.log('✅ Supabase connection successful\n');

    // Analyze existing tables structure
    console.log('2️⃣ Analyzing table structures...');
    
    // Check projects table structure
    try {
      const { data: projects, error } = await supabase.from('projects').select('*').limit(1);
      if (!error && projects.length > 0) {
        console.log('📊 Projects table columns:', Object.keys(projects[0]));
      } else {
        console.log('📊 Projects table exists but has no data');
        // Try to get structure from empty table
        const { data: projectStructure, error: structureError } = await supabase
          .from('projects')
          .select('id, title, description, status, priority, due_date, start_date, completed_date, progress, created_at, updated_at')
          .limit(0);
        if (!structureError) {
          console.log('📊 Projects table structure available');
        }
      }
    } catch (err) {
      console.log('❌ Error checking projects structure:', err.message);
    }

    // Check tasks table structure
    try {
      const { data: tasks, error } = await supabase.from('tasks').select('*').limit(1);
      if (!error && tasks.length > 0) {
        console.log('📊 Tasks table columns:', Object.keys(tasks[0]));
      } else {
        console.log('📊 Tasks table exists but has no data');
        // Try to get structure from empty table
        const { data: taskStructure, error: structureError } = await supabase
          .from('tasks')
          .select('id, title, description, status, priority, due_date, start_date, completed_date, progress, created_at, updated_at')
          .limit(0);
        if (!structureError) {
          console.log('📊 Tasks table structure available');
        }
      }
    } catch (err) {
      console.log('❌ Error checking tasks structure:', err.message);
    }

    // Check goals table structure
    try {
      const { data: goals, error } = await supabase.from('goals').select('*').limit(1);
      if (!error && goals.length > 0) {
        console.log('📊 Goals table columns:', Object.keys(goals[0]));
      } else {
        console.log('📊 Goals table exists but has no data');
      }
    } catch (err) {
      console.log('❌ Error checking goals structure:', err.message);
    }

    console.log('\n🎉 Schema analysis completed!');

  } catch (error) {
    console.error('❌ Schema analysis failed:', error);
  }
}

analyzeExistingSchema();
