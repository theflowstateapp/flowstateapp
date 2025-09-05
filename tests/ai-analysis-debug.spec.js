const { test, expect } = require('@playwright/test');

test('AI Analysis Debug Test', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Find the task title input
  const titleInput = page.getByPlaceholder('Enter task title...');
  console.log('Title input found:', await titleInput.count());
  
  if (await titleInput.count() > 0) {
    // Fill in a test input
    await titleInput.fill("Workout at 9am today");
    
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
      
      // Check if any fields were filled
      const lifeAreaSelect = page.locator('select').filter({ hasText: 'Life Area' });
      if (await lifeAreaSelect.count() > 0) {
        const value = await lifeAreaSelect.first().inputValue();
        console.log('Life Area value after AI:', value);
      }
      
      const dateInput = page.locator('input[type="date"]').first();
      if (await dateInput.count() > 0) {
        const value = await dateInput.inputValue();
        console.log('Date value after AI:', value);
      }
      
      const timeInput = page.locator('input[type="time"]').first();
      if (await timeInput.count() > 0) {
        const value = await timeInput.inputValue();
        console.log('Time value after AI:', value);
      }
      
      // Check if the AI button shows loading state
      const loadingSpinner = page.locator('button[title*="AI"] .animate-spin');
      console.log('Loading spinner found:', await loadingSpinner.count());
    }
  }
});
