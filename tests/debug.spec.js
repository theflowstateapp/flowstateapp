const { test, expect } = require('@playwright/test');

test.describe('Debug Tests', () => {
  test('Check if app loads and shows authentication', async ({ page }) => {
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser console error:', msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'debug-landing.png' });
    
    // Check if we're on landing page or app
    const url = page.url();
    console.log('Current URL:', url);
    
    if (url.includes('/app') || url.includes('/dashboard')) {
      // We're in the app, check for sidebar
      const sidebar = page.locator('nav').first();
      await expect(sidebar).toBeVisible();
      
      // Check for specific navigation items
      const dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
      await expect(dashboardLink).toBeVisible();
    } else {
      // We're on landing page, check for auth buttons
      const startTrialBtn = page.getByRole('button', { name: 'Start Free Trial' }).first();
      await expect(startTrialBtn).toBeVisible();
      
      // Click Try Demo to go to app
      const tryDemoLink = page.getByRole('link', { name: 'Try Demo' });
      await expect(tryDemoLink).toBeVisible();
      
      // Log the href attribute
      const href = await tryDemoLink.getAttribute('href');
      console.log('Try Demo href:', href);
      
      await tryDemoLink.click();
      
      // Wait a bit and check the URL
      await page.waitForTimeout(2000);
      console.log('URL after click:', page.url());
      
      // Wait for navigation
      await page.waitForURL('**/demo/dashboard');
      
      // Log the current URL and page content
      console.log('Current URL after navigation:', page.url());
      
      // Take a screenshot to see what's happening
      await page.screenshot({ path: 'debug-dashboard.png' });
      
      // Check if we're actually on the dashboard
      const pageContent = await page.content();
      console.log('Page contains "Dashboard":', pageContent.includes('Dashboard'));
      console.log('Page contains "nav":', pageContent.includes('nav'));
      console.log('Page contains "Life OS":', pageContent.includes('Life OS'));
      console.log('Page contains "Loading":', pageContent.includes('Loading'));
      console.log('Page contains "error":', pageContent.includes('error'));
      
      // Log the first 1000 characters of the page content
      console.log('Page content preview:', pageContent.substring(0, 1000));
      
      // Now check for sidebar
      const sidebar = page.locator('nav').first();
      await expect(sidebar).toBeVisible();
      
      // Check for specific navigation items
      const dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
      await expect(dashboardLink).toBeVisible();
    }
  });
});
