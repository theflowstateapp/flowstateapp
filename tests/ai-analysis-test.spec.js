const { test, expect } = require('@playwright/test');

test('AI Task Analysis Test - New Design', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Find the task title input
  const titleInput = page.getByPlaceholder('Enter task title...');
  console.log('Title input found:', await titleInput.count());
  
  if (await titleInput.count() > 0) {
    // Test different natural language inputs
    const testInputs = [
      "I'm going to schedule a workout at 9 am which is walking on a treadmill for today",
      "Meeting with Sarah tomorrow at 2pm about the project",
      "Call the dentist office to schedule an appointment",
      "Buy groceries for dinner tonight",
      "Review the quarterly budget report by Friday"
    ];
    
    for (let i = 0; i < testInputs.length; i++) {
      const testInput = testInputs[i];
      console.log(`\n--- Testing Input ${i + 1}: "${testInput}" ---`);
      
      // Clear and fill the title input
      await titleInput.clear();
      await titleInput.fill(testInput);
      
      // Wait a moment
      await page.waitForTimeout(1000);
      
      // Look for the AI button (Sparkles icon)
      const aiButton = page.locator('button').filter({ has: page.locator('svg') });
      console.log('AI button found:', await aiButton.count());
      
      if (await aiButton.count() > 0) {
        console.log('Clicking AI button...');
        await aiButton.first().click();
        
        // Wait for analysis to complete
        await page.waitForTimeout(3000);
        
        // Check what fields were filled
        const prioritySelect = page.locator('select').filter({ hasText: 'Priority' });
        const lifeAreaSelect = page.locator('select').filter({ hasText: 'Life Area' });
        const projectSelect = page.locator('select').filter({ hasText: 'Project' });
        const dateInput = page.locator('input[type="date"]');
        const timeInput = page.locator('input[type="time"]');
        
        console.log('Priority field found:', await prioritySelect.count());
        console.log('Life Area field found:', await lifeAreaSelect.count());
        console.log('Project field found:', await projectSelect.count());
        console.log('Date input found:', await dateInput.count());
        console.log('Time input found:', await timeInput.count());
        
        // Get the values if they exist
        if (await prioritySelect.count() > 0) {
          const priorityValue = await prioritySelect.first().inputValue();
          console.log('Priority value:', priorityValue);
        }
        
        if (await lifeAreaSelect.count() > 0) {
          const lifeAreaValue = await lifeAreaSelect.first().inputValue();
          console.log('Life Area value:', lifeAreaValue);
        }
        
        if (await dateInput.count() > 0) {
          const dateValue = await dateInput.first().inputValue();
          console.log('Date value:', dateValue);
        }
        
        if (await timeInput.count() > 0) {
          const timeValue = await timeInput.first().inputValue();
          console.log('Time value:', timeValue);
        }
        
        // Check if any fields were actually filled
        const filledFields = [];
        if (await prioritySelect.count() > 0 && await prioritySelect.first().inputValue() !== 'Medium') {
          filledFields.push('Priority');
        }
        if (await lifeAreaSelect.count() > 0 && await lifeAreaSelect.first().inputValue() !== '') {
          filledFields.push('Life Area');
        }
        if (await dateInput.count() > 0 && await dateInput.first().inputValue() !== '') {
          filledFields.push('Date');
        }
        if (await timeInput.count() > 0 && await timeInput.first().inputValue() !== '') {
          filledFields.push('Time');
        }
        
        console.log('Fields filled by AI:', filledFields);
      }
    }
  }
});
