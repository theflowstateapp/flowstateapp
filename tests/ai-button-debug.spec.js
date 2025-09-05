const { test, expect } = require('@playwright/test');

test('AI Button Debug Test', async ({ page }) => {
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
    
    // Look for the AI button more specifically
    const aiButton = page.locator('button[title*="AI"]');
    console.log('AI button with title found:', await aiButton.count());
    
    if (await aiButton.count() === 0) {
      // Try finding button with Sparkles icon
      const sparklesButton = page.locator('button').filter({ has: page.locator('svg') });
      console.log('Buttons with SVG found:', await sparklesButton.count());
      
      // Get all button texts to see what we have
      const buttonTexts = [];
      for (let i = 0; i < await sparklesButton.count(); i++) {
        const text = await sparklesButton.nth(i).getAttribute('title');
        buttonTexts.push(text);
      }
      console.log('Button titles:', buttonTexts);
      
      // Try clicking the first button with SVG
      if (await sparklesButton.count() > 0) {
        console.log('Clicking first SVG button...');
        await sparklesButton.first().click();
        
        // Wait for any changes
        await page.waitForTimeout(2000);
        
        // Check if any fields changed
        const lifeAreaSelect = page.locator('select').filter({ hasText: 'Life Area' });
        if (await lifeAreaSelect.count() > 0) {
          const value = await lifeAreaSelect.first().inputValue();
          console.log('Life Area value after click:', value);
        }
        
        const dateInput = page.locator('input[type="date"]').first();
        if (await dateInput.count() > 0) {
          const value = await dateInput.inputValue();
          console.log('Date value after click:', value);
        }
        
        const timeInput = page.locator('input[type="time"]').first();
        if (await timeInput.count() > 0) {
          const value = await timeInput.inputValue();
          console.log('Time value after click:', value);
        }
      }
    }
  }
});
