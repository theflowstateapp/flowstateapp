const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please check your .env file contains:');
  console.log('REACT_APP_SUPABASE_URL=your_supabase_project_url');
  console.log('REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseSchema() {
  console.log('🔍 Testing Database Schema...\n');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1️⃣ Testing Supabase connection...');
    const { data: healthCheck, error: healthError } = await supabase.from('profiles').select('count').limit(1);
    
    if (healthError) {
      console.error('❌ Connection failed:', healthError.message);
      return;
    }
    console.log('✅ Supabase connection successful\n');

    // Test 2: Check if tables exist
    console.log('2️⃣ Checking if tables exist...');
    const tables = [
      'profiles',
      'life_areas', 
      'projects',
      'goals',
      'tasks',
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
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }
    console.log('');

    // Test 3: Check sample data
    console.log('3️⃣ Checking sample data...');
    
    // Check life areas
    const { data: lifeAreas, error: lifeAreasError } = await supabase
      .from('life_areas')
      .select('*')
      .limit(5);
    
    if (lifeAreasError) {
      console.log('❌ Error fetching life areas:', lifeAreasError.message);
    } else {
      console.log(`✅ Found ${lifeAreas.length} life areas`);
      lifeAreas.forEach(area => {
        console.log(`   - ${area.name} (${area.color})`);
      });
    }

    // Check projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
    
    if (projectsError) {
      console.log('❌ Error fetching projects:', projectsError.message);
    } else {
      console.log(`✅ Found ${projects.length} projects`);
      projects.forEach(project => {
        console.log(`   - ${project.title} (${project.status})`);
      });
    }

    // Check goals
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .limit(5);
    
    if (goalsError) {
      console.log('❌ Error fetching goals:', goalsError.message);
    } else {
      console.log(`✅ Found ${goals.length} goals`);
      goals.forEach(goal => {
        console.log(`   - ${goal.title} (${goal.icon})`);
      });
    }

    // Check tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(5);
    
    if (tasksError) {
      console.log('❌ Error fetching tasks:', tasksError.message);
    } else {
      console.log(`✅ Found ${tasks.length} tasks`);
      tasks.forEach(task => {
        console.log(`   - ${task.name} (${task.status})`);
      });
    }

    console.log('\n🎉 Database schema test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabaseSchema();
