#!/usr/bin/env node

// Supabase Database Schema Setup Script
// This script applies the database schema to your Supabase project

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Check if Supabase is configured
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Supabase not configured!');
  console.log('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  console.log('See SUPABASE_SETUP_GUIDE.md for instructions');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Read schema file
const schemaPath = path.join(__dirname, '..', 'supabase-complete-schema.sql');

if (!fs.existsSync(schemaPath)) {
  console.log('❌ Schema file not found:', schemaPath);
  console.log('Please ensure supabase-complete-schema.sql exists in the project root');
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, 'utf8');

// Split by semicolon and clean up statements
const statements = schema
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt && !stmt.startsWith('--') && !stmt.startsWith('/*'));

console.log('🚀 Setting up Supabase database schema...');
console.log(`📄 Found ${statements.length} SQL statements to execute`);

async function applySchema() {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    if (!statement) continue;

    try {
      console.log(`\n📝 Executing statement ${i + 1}/${statements.length}...`);
      
      // Use direct SQL execution
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql: statement + ';' 
      });

      if (error) {
        console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
        // Continue with other statements even if one fails
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ Statement ${i + 1} error:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 Schema Setup Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📄 Total: ${statements.length}`);

  if (successCount > 0) {
    console.log('\n🎉 Database schema setup completed!');
    console.log('You can now:');
    console.log('1. Test user registration in the app');
    console.log('2. Create tasks and notes');
    console.log('3. Verify data persists in Supabase dashboard');
  } else {
    console.log('\n❌ No statements executed successfully');
    console.log('Please check your Supabase configuration and try again');
  }
}

// Test connection first
async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.log('❌ Connection test failed:', err.message);
    return false;
  }
}

// Main execution
async function main() {
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    console.log('2. Ensure your Supabase project is not paused');
    console.log('3. Verify your internet connection');
    process.exit(1);
  }

  await applySchema();
}

main().catch(console.error);
