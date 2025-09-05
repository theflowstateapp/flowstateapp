const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function applyDatabaseSchema() {
  console.log('🔧 Applying Enhanced Database Schema...\n');

  try {
    // Read the schema file
    const fs = require('fs');
    const schemaSQL = fs.readFileSync('supabase-schema.sql', 'utf8');
    
    console.log('📄 Schema file loaded successfully');
    console.log('🚀 Applying schema to Supabase...\n');

    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // Some statements might fail if they already exist, which is okay
            if (error.message.includes('already exists') || 
                error.message.includes('duplicate key') ||
                error.message.includes('relation') && error.message.includes('already exists')) {
              console.log(`⚠️  Statement ${i + 1} skipped (already exists)`);
            } else {
              console.log(`❌ Statement ${i + 1} failed:`, error.message);
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} skipped:`, err.message);
        }
      }
    }

    console.log('\n🎉 Schema application completed!');
    console.log('🔍 Running verification test...\n');

    // Run verification test
    await verifySchema();

  } catch (error) {
    console.error('❌ Schema application failed:', error);
  }
}

async function verifySchema() {
  console.log('🔍 Verifying Database Schema...\n');

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

    let existingTables = 0;
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.log(`❌ Table '${table}' not found:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists`);
          existingTables++;
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }
    console.log(`\n📊 ${existingTables}/${tables.length} tables exist\n`);

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

    console.log('\n🎉 Database schema verification completed!');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Run the schema application
applyDatabaseSchema();
