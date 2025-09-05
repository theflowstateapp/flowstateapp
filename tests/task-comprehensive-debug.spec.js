const { test, expect } = require('@playwright/test');

test('Task AI Analysis Comprehensive Debug Test', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Find the task title input
  const titleInput = page.getByPlaceholder('What needs to be done?');
  console.log('Title input found:', await titleInput.count());
  
  if (await titleInput.count() > 0) {
    // Test task creation with AI analysis
    const testInput = "Urgent meeting with Sarah tomorrow at 2pm about the project";
    console.log(`\n--- Testing Task Input: "${testInput}" ---`);
    
    // Fill in the title
    await titleInput.fill(testInput);
    
    // Wait a moment
    await page.waitForTimeout(1000);
    
    // Look for the AI button
    const aiButton = page.locator('button[title*="AI"]');
    console.log('AI button found:', await aiButton.count());
    
    if (await aiButton.count() > 0) {
      // Listen for console messages
      const consoleMessages = [];
      page.on('console', msg => {
        consoleMessages.push({
          type: msg.type(),
          text: msg.text()
        });
      });
      
      console.log('Clicking AI button...');
      await aiButton.click();
      
      // Wait for analysis to complete
      await page.waitForTimeout(3000);
      
      console.log('Console messages:', consoleMessages);
      
      // Check all form fields systematically
      console.log('\n--- Checking All Form Fields ---');
      
      // Check all select elements
      const allSelects = page.locator('select');
      const selectCount = await allSelects.count();
      console.log('Total select elements found:', selectCount);
      
      for (let i = 0; i < selectCount; i++) {
        const select = allSelects.nth(i);
        const label = await select.locator('..').locator('label').textContent().catch(() => 'No label');
        const value = await select.inputValue();
        console.log(`Select ${i + 1} (${label}): ${value}`);
      }
      
      // Check all input elements
      const allInputs = page.locator('input');
      const inputCount = await allInputs.count();
      console.log('\nTotal input elements found:', inputCount);
      
      for (let i = 0; i < inputCount; i++) {
        const input = allInputs.nth(i);
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        const value = await input.inputValue();
        console.log(`Input ${i + 1} (type: ${type}, placeholder: ${placeholder}): ${value}`);
      }
      
      // Check specific fields by their expected labels
      const prioritySelect = page.locator('select').filter({ hasText: 'Priority' });
      const contextSelect = page.locator('select').filter({ hasText: 'Context' });
      const typeSelect = page.locator('select').filter({ hasText: 'Type' });
      const projectSelect = page.locator('select').filter({ hasText: 'Project' });
      
      console.log('\n--- Specific Field Values ---');
      console.log('Priority select found:', await prioritySelect.count());
      if (await prioritySelect.count() > 0) {
        console.log('Priority value:', await prioritySelect.first().inputValue());
      }
      
      console.log('Context select found:', await contextSelect.count());
      if (await contextSelect.count() > 0) {
        console.log('Context value:', await contextSelect.first().inputValue());
      }
      
      console.log('Type select found:', await typeSelect.count());
      if (await typeSelect.count() > 0) {
        console.log('Type value:', await typeSelect.first().inputValue());
      }
      
      console.log('Project select found:', await projectSelect.count());
      if (await projectSelect.count() > 0) {
        console.log('Project value:', await projectSelect.first().inputValue());
      }
      
      // Check date and time inputs
      const startDateInput = page.locator('input[type="date"]').first();
      const dueDateInput = page.locator('input[type="date"]').nth(1);
      const reminderTimeInput = page.locator('input[type="time"]').first();
      
      console.log('\n--- Date and Time Values ---');
      console.log('Start date value:', await startDateInput.inputValue());
      console.log('Due date value:', await dueDateInput.inputValue());
      console.log('Reminder time value:', await reminderTimeInput.inputValue());
      
      // Test form submission
      const saveButton = page.getByRole('button', { name: 'Create Task' });
      console.log('\nCreate Task button found:', await saveButton.count());
      
      if (await saveButton.count() > 0) {
        console.log('Form is ready for submission');
      }
    }
  }
});
