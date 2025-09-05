const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExistingSchema() {
  console.log('🔍 Checking Existing Database Schema...\n');

  try {
    // Test connection
    console.log('1️⃣ Testing Supabase connection...');
    const { data: healthCheck, error: healthError } = await supabase.from('profiles').select('count').limit(1);
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return;
    }
    console.log('✅ Supabase connection successful\n');

    // Check existing tables
    console.log('2️⃣ Checking existing tables...');
    const tables = [
      'profiles',
      'projects',
      'goals', 
      'tasks',
      'life_areas',
      'task_projects',
      'task_goals',
      'task_dependencies',
      'time_tracking',
      'task_reports',
      'task_templates',
      'task_comments',
      'task_attachments',
      'task_history'
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.log(`❌ Table '${table}' not found:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists`);
          
          // Get table structure
          const { data: columns, error: columnError } = await supabase.rpc('get_table_columns', { table_name: table });
          if (!columnError && columns) {
            console.log(`   Columns: ${columns.map(col => col.column_name).join(', ')}`);
          }
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }

    // Check specific table structures
    console.log('\n3️⃣ Checking table structures...');
    
    // Check projects table structure
    try {
      const { data: projects, error } = await supabase.from('projects').select('*').limit(1);
      if (!error && projects.length > 0) {
        console.log('📊 Projects table columns:', Object.keys(projects[0]));
      }
    } catch (err) {
      console.log('❌ Error checking projects structure:', err.message);
    }

    // Check tasks table structure
    try {
      const { data: tasks, error } = await supabase.from('tasks').select('*').limit(1);
      if (!error && tasks.length > 0) {
        console.log('📊 Tasks table columns:', Object.keys(tasks[0]));
      }
    } catch (err) {
      console.log('❌ Error checking tasks structure:', err.message);
    }

    console.log('\n🎉 Schema check completed!');

  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

checkExistingSchema();
