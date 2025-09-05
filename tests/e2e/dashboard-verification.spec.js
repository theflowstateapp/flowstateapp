const { test, expect } = require('@playwright/test');

test('Dashboard Content Verification', async ({ page }) => {
  // Navigate to the dashboard with cache busting
  await page.goto('http://localhost:3000/dashboard?v=' + Date.now());
  
  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Check for Command Center text
  const commandCenter = await page.locator('text=Command Center').first();
  await expect(commandCenter).toBeVisible();
  
  // Check for Insights Preview text
  const insightsPreview = await page.locator('text=Insights Preview').first();
  await expect(insightsPreview).toBeVisible();
  
  // Check for Quick Stats
  const quickStats = await page.locator('text=Completed Today').first();
  await expect(quickStats).toBeVisible();
  
  // Check for Quick Actions
  const quickActions = await page.locator('text=New Task').first();
  await expect(quickActions).toBeVisible();
  
  // Take a screenshot for verification
  await page.screenshot({ 
    path: 'dashboard-verified.png', 
    fullPage: true 
  });
  
  console.log('Dashboard content verified successfully!');
});

