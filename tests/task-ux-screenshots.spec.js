const { test, expect } = require('@playwright/test');

test('Task Form UX Analysis - Screenshots', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of empty form
  await page.screenshot({ 
    path: 'tests/screenshots/task-form-empty.png',
    fullPage: true 
  });
  
  // Fill in a test task
  const titleInput = page.getByPlaceholder('Enter task title...');
  await titleInput.fill("Urgent meeting with Sarah tomorrow at 2pm about the project");
  
  // Wait a moment
  await page.waitForTimeout(1000);
  
  // Take screenshot of filled form before AI
  await page.screenshot({ 
    path: 'tests/screenshots/task-form-filled-before-ai.png',
    fullPage: true 
  });
  
  // Click AI button
  const aiButton = page.locator('button[title*="AI"]');
  await aiButton.click();
  
  // Wait for AI analysis
  await page.waitForTimeout(3000);
  
  // Take screenshot after AI analysis
  await page.screenshot({ 
    path: 'tests/screenshots/task-form-after-ai.png',
    fullPage: true 
  });
  
  // Scroll to different sections and take screenshots
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ 
    path: 'tests/screenshots/task-form-header-section.png',
    clip: { x: 0, y: 0, width: 1200, height: 400 }
  });
  
  // Scroll to middle section
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.screenshot({ 
    path: 'tests/screenshots/task-form-middle-section.png',
    clip: { x: 0, y: 400, width: 1200, height: 400 }
  });
  
  // Scroll to bottom section
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.screenshot({ 
    path: 'tests/screenshots/task-form-bottom-section.png',
    clip: { x: 0, y: 800, width: 1200, height: 400 }
  });
  
  console.log('Screenshots taken successfully!');
});
