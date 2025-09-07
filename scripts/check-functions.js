#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const API_DIR = './api';
const EXPECTED_FUNCTIONS = [
  'demo/access.js',
  'demo/exchange.js',
  'demo/static.js',
  'demo/index.js',
  'demo/test.js',
  'demo/overview.js',
  'demo/diag.js',
  'demo/test-supabase.js',
  'demo/habits.js',
  'demo/calendar.js',
  'demo/tasks.js',
  'demo/journal.js',
  'demo/review.js',
  'demo/agenda.js',
  'demo/settings.js',
  'review/plan-next-week.js',
  'health.js',
  'debug/routes.js',
  'debug/route-audit.js'
];

function checkFunction(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for default export
    const hasDefaultExport = content.includes('export default');
    
    // Check for handler function
    const hasHandler = content.includes('function handler(') || content.includes('async function handler(');
    
    // Check for proper error handling
    const hasTryCatch = content.includes('try {') && content.includes('} catch');
    
    // Check for method validation
    const hasMethodCheck = content.includes('req.method') && content.includes('405');
    
    return {
      exists: true,
      hasDefaultExport,
      hasHandler,
      hasTryCatch,
      hasMethodCheck,
      isValid: hasDefaultExport && hasHandler && hasTryCatch
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
}

function main() {
  console.log('🔍 Vercel Functions Build Check\n');
  
  let allValid = true;
  const results = [];
  
  for (const func of EXPECTED_FUNCTIONS) {
    const filePath = path.join(API_DIR, func);
    const result = checkFunction(filePath);
    
    results.push({
      function: func,
      ...result
    });
    
    if (!result.exists) {
      console.log(`❌ ${func} - File not found`);
      allValid = false;
    } else if (!result.isValid) {
      console.log(`⚠️  ${func} - Invalid structure:`);
      if (!result.hasDefaultExport) console.log('   - Missing default export');
      if (!result.hasHandler) console.log('   - Missing handler function');
      if (!result.hasTryCatch) console.log('   - Missing try/catch');
      if (!result.hasMethodCheck) console.log('   - Missing method validation');
      allValid = false;
    } else {
      console.log(`✅ ${func} - Valid`);
    }
  }
  
  console.log('\n📊 Summary:');
  const validCount = results.filter(r => r.exists && r.isValid).length;
  const totalCount = EXPECTED_FUNCTIONS.length;
  
  console.log(`Valid functions: ${validCount}/${totalCount}`);
  
  if (allValid) {
    console.log('\n🎉 All functions are properly structured!');
    process.exit(0);
  } else {
    console.log('\n❌ Some functions need fixes.');
    process.exit(1);
  }
}

main();
