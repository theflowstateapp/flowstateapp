const { test, expect } = require('@playwright/test');

test.describe('Dashboard Button Test', () => {
  test('Check if Quick Capture button exists', async ({ page }) => {
    // Listen for console errors
    page.on('console', msg => {
      console.log('Console message:', msg.type(), msg.text());
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
    
    await page.goto('http://localhost:3000/demo/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'dashboard-debug.png' });
    
    // Check for any buttons on the page
    const allButtons = await page.locator('button').count();
    console.log('Total buttons on page:', allButtons);
    
    // List all button texts
    const buttonTexts = await page.locator('button').allTextContents();
    console.log('Button texts:', buttonTexts);
    
    // Check for Quick Capture specifically
    const quickCaptureBtn = page.getByRole('button', { name: 'Quick Capture' });
    const exists = await quickCaptureBtn.count();
    console.log('Quick Capture button count:', exists);
    
    // Check page content for Quick Capture text
    const pageContent = await page.content();
    console.log('Page contains "Quick Capture":', pageContent.includes('Quick Capture'));
    console.log('Page contains "Plus":', pageContent.includes('Plus'));
    console.log('Page contains "Dashboard":', pageContent.includes('Dashboard'));
    console.log('Page contains "Your Complete Second Brain":', pageContent.includes('Your Complete Second Brain'));
    
    // Check for any button with Plus icon
    const plusButtons = page.locator('button svg').count();
    console.log('Buttons with SVG icons:', plusButtons);
    
    // Check what's in the main content area
    const mainContent = await page.locator('main').textContent();
    console.log('Main content preview:', mainContent?.substring(0, 200));
  });
});
