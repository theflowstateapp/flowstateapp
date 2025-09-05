#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('REACT_APP_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyUsagePricingSchema() {
  try {
    console.log('🚀 Applying usage-based pricing schema for Life OS...');
    console.log('📍 Configured for Indian market with Razorpay integration');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'supabase-usage-pricing-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 Schema file loaded successfully');
    console.log('⚡ Executing schema in Supabase...');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
            errorCount++;
          } else {
            successCount++;
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Exception executing statement ${i + 1}:`, err.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n📊 Execution Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('🎉 Usage-based pricing schema applied successfully!');
    } else {
      console.log('⚠️  Schema applied with some errors. Check the output above.');
    }
    
    // Verify the tables were created
    console.log('\n🔍 Verifying schema...');
    
    const tables = [
      'subscription_plans',
      'user_subscriptions', 
      'ai_usage_logs',
      'billing_history',
      'usage_alerts'
    ];
    
    let verifiedTables = 0;
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.error(`❌ Error verifying table ${table}:`, error.message);
        } else {
          console.log(`✅ Table ${table} exists and is accessible`);
          verifiedTables++;
        }
      } catch (err) {
        console.error(`❌ Exception verifying table ${table}:`, err.message);
      }
    }
    
    console.log(`\n📊 Verification Summary: ${verifiedTables}/${tables.length} tables verified`);
    
    if (verifiedTables === tables.length) {
      console.log('🎉 Usage-based pricing system is ready for Life OS!');
      console.log('\n📋 Next steps:');
      console.log('1. Test the usage tracking with AI features');
      console.log('2. Set up Razorpay payment integration');
      console.log('3. Configure usage alerts and notifications');
      console.log('4. Test billing and subscription management');
    } else {
      console.log('⚠️  Some tables may not be properly created. Check the verification output above.');
    }
    
  } catch (error) {
    console.error('❌ Failed to apply usage pricing schema:', error);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your Supabase credentials');
    console.log('2. Ensure you have the service role key (not anon key)');
    console.log('3. Try running the SQL manually in Supabase SQL editor');
    console.log('4. Check the schema file exists: supabase-usage-pricing-schema.sql');
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution
async function applySchemaDirectly() {
  try {
    console.log('🚀 Applying usage-based pricing schema (direct method)...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'supabase-usage-pricing-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⚡ Executing complete schema...');
    
    // Execute the entire schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('❌ Error executing schema:', error);
      throw error;
    }
    
    console.log('✅ Usage-based pricing schema applied successfully!');
    
  } catch (error) {
    console.error('❌ Failed to apply schema:', error);
    console.log('\n💡 Manual execution instructions:');
    console.log('1. Open your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy the contents of supabase-usage-pricing-schema.sql');
    console.log('4. Paste and execute the SQL');
    console.log('5. Verify the tables were created');
    process.exit(1);
  }
}

// Check command line arguments
const useDirect = process.argv.includes('--direct');
const verbose = process.argv.includes('--verbose');

if (verbose) {
  console.log('🔍 Verbose mode enabled');
}

console.log('🏢 Life OS Usage-Based Pricing Setup');
console.log('🇮🇳 Configured for Indian market with Razorpay');
console.log('');

if (useDirect) {
  applySchemaDirectly();
} else {
  applyUsagePricingSchema();
}
