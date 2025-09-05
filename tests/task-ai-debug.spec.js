const { test, expect } = require('@playwright/test');

test('Task AI Analysis Debug Test', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Find the task title input
  const titleInput = page.getByPlaceholder('Enter task title...');
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
      
      // Check what fields were filled
      const typeSelect = page.locator('select').filter({ hasText: 'Type' });
      const prioritySelect = page.locator('select').filter({ hasText: 'Priority' });
      const projectSelect = page.locator('select').filter({ hasText: 'Project' });
      const contextSelect = page.locator('select').filter({ hasText: 'Context' });
      const startDateInput = page.locator('input[type="date"]').first();
      const dueDateInput = page.locator('input[type="date"]').nth(1);
      const estimatedHoursInput = page.locator('input[type="number"]').first();
      const reminderTimeInput = page.locator('input[type="time"]').first();
      
      console.log('Type field found:', await typeSelect.count());
      console.log('Priority field found:', await prioritySelect.count());
      console.log('Project field found:', await projectSelect.count());
      console.log('Context field found:', await contextSelect.count());
      console.log('Start date input found:', await startDateInput.count());
      console.log('Due date input found:', await dueDateInput.count());
      console.log('Estimated hours input found:', await estimatedHoursInput.count());
      console.log('Reminder time input found:', await reminderTimeInput.count());
      
      // Get the values if they exist
      if (await typeSelect.count() > 0) {
        const typeValue = await typeSelect.first().inputValue();
        console.log('Type value:', typeValue);
      }
      
      if (await prioritySelect.count() > 0) {
        const priorityValue = await prioritySelect.first().inputValue();
        console.log('Priority value:', priorityValue);
      }
      
      if (await projectSelect.count() > 0) {
        const projectValue = await projectSelect.first().inputValue();
        console.log('Project value:', projectValue);
      }
      
      if (await contextSelect.count() > 0) {
        const contextValue = await contextSelect.first().inputValue();
        console.log('Context value:', contextValue);
      }
      
      if (await startDateInput.count() > 0) {
        const startDateValue = await startDateInput.inputValue();
        console.log('Start date value:', startDateValue);
      }
      
      if (await dueDateInput.count() > 0) {
        const dueDateValue = await dueDateInput.inputValue();
        console.log('Due date value:', dueDateValue);
      }
      
      if (await estimatedHoursInput.count() > 0) {
        const estimatedHoursValue = await estimatedHoursInput.inputValue();
        console.log('Estimated hours value:', estimatedHoursValue);
      }
      
      if (await reminderTimeInput.count() > 0) {
        const reminderTimeValue = await reminderTimeInput.inputValue();
        console.log('Reminder time value:', reminderTimeValue);
      }
      
      // Check if any fields were actually filled
      const filledFields = [];
      if (await typeSelect.count() > 0 && await typeSelect.first().inputValue() !== 'Task') {
        filledFields.push('Type');
      }
      if (await prioritySelect.count() > 0 && await prioritySelect.first().inputValue() !== 'Medium') {
        filledFields.push('Priority');
      }
      if (await projectSelect.count() > 0 && await projectSelect.first().inputValue() !== '') {
        filledFields.push('Project');
      }
      if (await contextSelect.count() > 0 && await contextSelect.first().inputValue() !== '') {
        filledFields.push('Context');
      }
      if (await startDateInput.count() > 0 && await startDateInput.inputValue() !== '') {
        filledFields.push('Start Date');
      }
      if (await dueDateInput.count() > 0 && await dueDateInput.inputValue() !== '') {
        filledFields.push('Due Date');
      }
      if (await estimatedHoursInput.count() > 0 && await estimatedHoursInput.inputValue() !== '') {
        filledFields.push('Estimated Hours');
      }
      if (await reminderTimeInput.count() > 0 && await reminderTimeInput.inputValue() !== '') {
        filledFields.push('Reminder Time');
      }
      
      console.log('Fields filled by AI:', filledFields);
      console.log('AI Analysis Score:', `${filledFields.length}/8 fields filled`);
      
      // Test form submission
      const saveButton = page.getByRole('button', { name: 'Create Task' });
      console.log('Create Task button found:', await saveButton.count());
      
      if (await saveButton.count() > 0) {
        console.log('Form is ready for submission');
      }
    }
  }
});
