// Comprehensive Pre-Focus Ritual API Test Suite
// Tests all endpoints with intention and ritual data

const testPreFocusAPIs = async () => {
  console.log('🧘 Testing Pre-Focus Ritual APIs...\n');
  
  const baseURL = 'https://theflowstateapp.com';
  
  // Test 1: Start Focus Session with Intention and Ritual
  console.log('📝 Test 1: Starting focus session with intention and ritual...');
  try {
    const startResponse = await fetch(`${baseURL}/api/focus/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plannedMinutes: 25,
        intention: 'Complete the API documentation section and write 3 test cases',
        ritual: {
          tabsClosed: true,
          phoneSilent: true,
          materialsReady: false
        }
      })
    });
    
    const startData = await startResponse.json();
    
    if (startResponse.ok) {
      console.log('✅ Start API Success:', {
        sessionId: startData.sessionId,
        intention: startData.intention,
        ritual: startData.ritual,
        plannedMinutes: startData.plannedMinutes
      });
      
      // Test 2: Stop Focus Session and verify intention/ritual in response
      console.log('\n📝 Test 2: Stopping focus session and verifying response...');
      
      const stopResponse = await fetch(`${baseURL}/api/focus/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: startData.sessionId,
          selfRating: 4
        })
      });
      
      const stopData = await stopResponse.json();
      
      if (stopResponse.ok) {
        console.log('✅ Stop API Success:', {
          intention: stopData.summary?.intention,
          ritual: stopData.summary?.ritual,
          duration: stopData.summary?.duration,
          distractions: stopData.summary?.distractions,
          rating: stopData.summary?.rating
        });
        
        // Verify intention and ritual are preserved
        if (stopData.summary?.intention === startData.intention) {
          console.log('✅ Intention preserved correctly');
        } else {
          console.log('❌ Intention not preserved');
        }
        
        if (JSON.stringify(stopData.summary?.ritual) === JSON.stringify(startData.ritual)) {
          console.log('✅ Ritual preserved correctly');
        } else {
          console.log('❌ Ritual not preserved');
        }
        
      } else {
        console.log('❌ Stop API Error:', stopData);
      }
      
    } else {
      console.log('❌ Start API Error:', startData);
      
      // Check if it's a database schema issue
      if (startData.message?.includes('Could not find the table')) {
        console.log('\n🔧 Database Schema Issue Detected:');
        console.log('   The focus_sessions table needs to be created first.');
        console.log('   Please apply the database schema using the guide in DATABASE_SETUP_GUIDE.md');
        console.log('   Once applied, the Pre-Focus Ritual will work fully.');
      }
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
  
  // Test 3: Test with minimal data (backward compatibility)
  console.log('\n📝 Test 3: Testing backward compatibility (no intention/ritual)...');
  try {
    const minimalResponse = await fetch(`${baseURL}/api/focus/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plannedMinutes: 50
      })
    });
    
    const minimalData = await minimalResponse.json();
    
    if (minimalResponse.ok) {
      console.log('✅ Backward Compatibility Success:', {
        sessionId: minimalData.sessionId,
        intention: minimalData.intention || 'null',
        ritual: minimalData.ritual || 'null'
      });
    } else {
      console.log('❌ Backward Compatibility Error:', minimalData);
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
  
  // Test 4: Test intention length limits
  console.log('\n📝 Test 4: Testing intention length limits...');
  try {
    const longIntention = 'A'.repeat(250); // 250 characters
    const longResponse = await fetch(`${baseURL}/api/focus/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plannedMinutes: 25,
        intention: longIntention,
        ritual: { tabsClosed: true }
      })
    });
    
    const longData = await longResponse.json();
    
    if (longResponse.ok) {
      const returnedLength = longData.intention?.length || 0;
      console.log('✅ Intention Length Test:', {
        originalLength: longIntention.length,
        returnedLength: returnedLength,
        truncated: returnedLength < longIntention.length
      });
      
      if (returnedLength <= 200) {
        console.log('✅ Intention properly truncated to 200 chars');
      } else {
        console.log('❌ Intention not properly truncated');
      }
    } else {
      console.log('❌ Long Intention Error:', longData);
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
  
  console.log('\n🎉 Pre-Focus Ritual API testing complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Apply database schema if not already done');
  console.log('2. Test complete user flow in the app');
  console.log('3. Enable app tour for new users');
  console.log('4. Begin collecting analytics data');
};

// Run the tests
testPreFocusAPIs();
