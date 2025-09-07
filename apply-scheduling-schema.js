import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function applySchema() {
  try {
    console.log('Applying scheduling schema...');
    
    // Read the SQL file
    const sql = fs.readFileSync('scheduling-schema.sql', 'utf8');
    
    // Split into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() });
        if (error) {
          console.error('Error executing statement:', error);
        } else {
          console.log('✓ Success');
        }
      }
    }
    
    console.log('Schema applied successfully!');
  } catch (error) {
    console.error('Error applying schema:', error);
  }
}

applySchema();
