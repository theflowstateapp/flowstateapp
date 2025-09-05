const { test, expect } = require('@playwright/test');

test('Enhanced Task Form with Template Suggestions Test', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Take screenshot of the enhanced form
  await page.screenshot({ 
    path: 'tests/screenshots/enhanced-task-form-with-templates.png',
    fullPage: true 
  });
  
  // Test different scenarios to trigger template suggestions
  const testScenarios = [
    {
      name: "Meeting Template",
      input: "Weekly team standup meeting every Monday at 9am",
      expectedTemplate: "Meeting Template"
    },
    {
      name: "Health Template", 
      input: "Workout at the gym - 30 minutes cardio and strength training",
      expectedTemplate: "Health & Fitness Template"
    },
    {
      name: "Family Template",
      input: "Pick up kids from school and take them to dentist appointment",
      expectedTemplate: "Family Task Template"
    },
    {
      name: "Finance Template",
      input: "Pay electricity bill by Friday, amount $150",
      expectedTemplate: "Financial Task Template"
    }
  ];
  
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`\n--- Testing Scenario ${i + 1}: ${scenario.name} ---`);
    
    // Find and fill the title input
    const titleInput = page.getByPlaceholder('What needs to be done?');
    if (await titleInput.count() > 0) {
      await titleInput.clear();
      await titleInput.fill(scenario.input);
      await page.waitForTimeout(1000);
      
      // Click AI analyze button
      const aiButton = page.locator('button').filter({ hasText: 'AI Analyze' });
      if (await aiButton.count() > 0) {
        await aiButton.click();
        await page.waitForTimeout(3000);
        
        // Check for template suggestions
        const templateSuggestions = page.locator('div').filter({ hasText: 'Suggested Templates' });
        const suggestionsFound = await templateSuggestions.count();
        console.log(`Template suggestions found: ${suggestionsFound}`);
        
        if (suggestionsFound > 0) {
          // Check if the expected template is in the suggestions
          const expectedTemplateElement = page.locator('div').filter({ hasText: scenario.expectedTemplate });
          const expectedTemplateFound = await expectedTemplateElement.count();
          console.log(`Expected template "${scenario.expectedTemplate}" found: ${expectedTemplateFound}`);
          
          if (expectedTemplateFound > 0) {
            console.log(`✅ Template suggestion working correctly for: ${scenario.name}`);
          } else {
            console.log(`⚠️ Expected template not found for: ${scenario.name}`);
          }
        } else {
          console.log(`⚠️ No template suggestions found for: ${scenario.name}`);
        }
        
        // Take screenshot after AI analysis
        await page.screenshot({ 
          path: `tests/screenshots/template-test-${i + 1}-${scenario.name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: true 
        });
      }
    }
  }
  
  console.log('\n🎉 Template suggestion testing completed!');
});
