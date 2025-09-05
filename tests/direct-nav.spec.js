const { test, expect } = require('@playwright/test');

test.describe('Direct Navigation Test', () => {
  test('Navigate directly to demo dashboard', async ({ page }) => {
    // Listen for console errors
    page.on('console', msg => {
      console.log('Console message:', msg.type(), msg.text());
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
    
    // Listen for request failures
    page.on('requestfailed', request => {
      console.log('Request failed:', request.url(), request.failure().errorText);
    });
    
    // Navigate directly to demo dashboard
    await page.goto('http://localhost:3000/demo/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot
    await page.screenshot({ path: 'direct-demo.png' });
    
    // Log the current URL
    console.log('Current URL:', page.url());
    
    // Check page content
    const pageContent = await page.content();
    console.log('Page contains "Dashboard":', pageContent.includes('Dashboard'));
    console.log('Page contains "nav":', pageContent.includes('nav'));
    console.log('Page contains "Life OS":', pageContent.includes('Life OS'));
    console.log('Page contains "Loading":', pageContent.includes('Loading'));
    console.log('Page contains "error":', pageContent.includes('error'));
    
    // Try to find any React content
    const reactRoot = page.locator('#root');
    const rootContent = await reactRoot.textContent();
    console.log('Root content:', rootContent);
    
    // Check if root has any children
    const rootChildren = await reactRoot.locator('*').count();
    console.log('Root children count:', rootChildren);
    
    // Check what's in the first child
    if (rootChildren > 0) {
      const firstChild = reactRoot.locator('*').first();
      const childTag = await firstChild.evaluate(el => el.tagName);
      const childContent = await firstChild.textContent();
      const childClasses = await firstChild.getAttribute('class');
      console.log('First child tag:', childTag);
      console.log('First child content:', childContent);
      console.log('First child classes:', childClasses);
    }
    
    // Check root visibility
    const isVisible = await reactRoot.isVisible();
    console.log('Root is visible:', isVisible);
    
    // Check root computed style
    const display = await reactRoot.evaluate(el => window.getComputedStyle(el).display);
    console.log('Root display style:', display);
  });
});
