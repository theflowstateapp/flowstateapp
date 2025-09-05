const { test, expect } = require('@playwright/test');

test('Enhanced Project Form UX Test', async ({ page }) => {
  // Navigate to the new project page
  await page.goto('http://localhost:3000/new-project');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Take screenshot of the enhanced form
  await page.screenshot({ 
    path: 'tests/screenshots/enhanced-project-form.png',
    fullPage: true 
  });
  
  // Check if the enhanced elements are present
  const titleInput = page.getByPlaceholder('What project are you creating?');
  console.log('Enhanced title input found:', await titleInput.count());
  
  const aiButton = page.locator('button').filter({ hasText: 'AI Analyze' });
  console.log('Enhanced AI button found:', await aiButton.count());
  
  const header = page.locator('h1').filter({ hasText: 'Create New Project' });
  console.log('Enhanced header found:', await header.count());
  
  const aiPoweredBadge = page.locator('div').filter({ hasText: 'AI Powered' });
  console.log('AI Powered badge found:', await aiPoweredBadge.count());
  
  // Test the enhanced form interaction
  if (await titleInput.count() > 0) {
    await titleInput.fill("Urgent marketing campaign for Q4 product launch, 3 months duration, $50k budget");
    await page.waitForTimeout(1000);
    
    // Take screenshot after filling title
    await page.screenshot({ 
      path: 'tests/screenshots/enhanced-project-form-filled.png',
      fullPage: true 
    });
    
    if (await aiButton.count() > 0) {
      await aiButton.click();
      await page.waitForTimeout(3000);
      
      // Take screenshot after AI analysis
      await page.screenshot({ 
        path: 'tests/screenshots/enhanced-project-form-after-ai.png',
        fullPage: true 
      });
      
      console.log('Enhanced project form interaction completed successfully!');
    }
  }
});
