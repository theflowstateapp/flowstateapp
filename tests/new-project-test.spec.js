const { test, expect } = require('@playwright/test');

test('New Project Form Test', async ({ page }) => {
  // Navigate to the new project page
  await page.goto('http://localhost:3000/new-project');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Find the project title input
  const titleInput = page.getByPlaceholder('Enter project title...');
  console.log('Title input found:', await titleInput.count());
  
  if (await titleInput.count() > 0) {
    // Test project creation with AI analysis
    const testInput = "Urgent marketing campaign for Q4 product launch, 3 months duration, $50k budget";
    console.log(`\n--- Testing Project Input: "${testInput}" ---`);
    
    // Fill in the title
    await titleInput.fill(testInput);
    
    // Wait a moment
    await page.waitForTimeout(1000);
    
    // Look for the AI button
    const aiButton = page.locator('button[title*="AI"]');
    console.log('AI button found:', await aiButton.count());
    
    if (await aiButton.count() > 0) {
      console.log('Clicking AI button...');
      await aiButton.click();
      
      // Wait for analysis to complete
      await page.waitForTimeout(3000);
      
      // Check what fields were filled
      const typeSelect = page.locator('select').filter({ hasText: 'Type' });
      const prioritySelect = page.locator('select').filter({ hasText: 'Priority' });
      const categorySelect = page.locator('select').filter({ hasText: 'Category' });
      const areaSelect = page.locator('select').filter({ hasText: 'Area' });
      const startDateInput = page.locator('input[type="date"]').first();
      const dueDateInput = page.locator('input[type="date"]').nth(1);
      const durationInput = page.locator('input[placeholder*="3 months"]');
      const budgetInput = page.locator('input[placeholder*="0.00"]').first();
      
      console.log('Type field found:', await typeSelect.count());
      console.log('Priority field found:', await prioritySelect.count());
      console.log('Category field found:', await categorySelect.count());
      console.log('Area field found:', await areaSelect.count());
      console.log('Start date input found:', await startDateInput.count());
      console.log('Due date input found:', await dueDateInput.count());
      console.log('Duration input found:', await durationInput.count());
      console.log('Budget input found:', await budgetInput.count());
      
      // Get the values if they exist
      if (await typeSelect.count() > 0) {
        const typeValue = await typeSelect.first().inputValue();
        console.log('Type value:', typeValue);
      }
      
      if (await prioritySelect.count() > 0) {
        const priorityValue = await prioritySelect.first().inputValue();
        console.log('Priority value:', priorityValue);
      }
      
      if (await categorySelect.count() > 0) {
        const categoryValue = await categorySelect.first().inputValue();
        console.log('Category value:', categoryValue);
      }
      
      if (await areaSelect.count() > 0) {
        const areaValue = await areaSelect.first().inputValue();
        console.log('Area value:', areaValue);
      }
      
      if (await durationInput.count() > 0) {
        const durationValue = await durationInput.inputValue();
        console.log('Duration value:', durationValue);
      }
      
      if (await budgetInput.count() > 0) {
        const budgetValue = await budgetInput.inputValue();
        console.log('Budget value:', budgetValue);
      }
      
      // Check if any fields were actually filled
      const filledFields = [];
      if (await typeSelect.count() > 0 && await typeSelect.first().inputValue() !== 'Project') {
        filledFields.push('Type');
      }
      if (await prioritySelect.count() > 0 && await prioritySelect.first().inputValue() !== 'Medium') {
        filledFields.push('Priority');
      }
      if (await categorySelect.count() > 0 && await categorySelect.first().inputValue() !== '') {
        filledFields.push('Category');
      }
      if (await areaSelect.count() > 0 && await areaSelect.first().inputValue() !== '') {
        filledFields.push('Area');
      }
      if (await durationInput.count() > 0 && await durationInput.inputValue() !== '') {
        filledFields.push('Duration');
      }
      if (await budgetInput.count() > 0 && await budgetInput.inputValue() !== '') {
        filledFields.push('Budget');
      }
      
      console.log('Fields filled by AI:', filledFields);
      console.log('AI Analysis Score:', `${filledFields.length}/6 fields filled`);
      
      // Test form submission (without actually submitting)
      const createButton = page.getByRole('button', { name: 'Create Project' });
      console.log('Create Project button found:', await createButton.count());
      
      if (await createButton.count() > 0) {
        console.log('Form is ready for submission');
      }
    }
  }
});
