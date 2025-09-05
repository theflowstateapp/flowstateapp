const { test, expect } = require('@playwright/test');

test('Dashboard Screenshot', async ({ page }) => {
  // Navigate to the dashboard
  await page.goto('http://localhost:3000/dashboard');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a full page screenshot
  await page.screenshot({ 
    path: 'dashboard-current.png', 
    fullPage: true 
  });
  
  // Also take a viewport screenshot
  await page.screenshot({ 
    path: 'dashboard-viewport.png', 
    fullPage: false 
  });
  
  console.log('Screenshots saved: dashboard-current.png and dashboard-viewport.png');
});

