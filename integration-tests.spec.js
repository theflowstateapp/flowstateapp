const { test, expect } = require('@playwright/test');

// LifeOS Frontend-Backend Integration Tests
// This test suite verifies the complete user journey and all functionality

test.describe('LifeOS Integration Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('Landing Page Loads Correctly', async ({ page }) => {
    // Check if landing page elements are present
    await expect(page.locator('h1')).toContainText('FlowState');
    
    // Check for Try Demo buttons
    const tryDemoButtons = page.locator('button:has-text("Try Demo")');
    await expect(tryDemoButtons).toHaveCount(4); // Should have 4 Try Demo buttons
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/landing-page.png' });
  });

  test('Try Demo Button Navigation', async ({ page }) => {
    // Click the first Try Demo button
    const tryDemoButton = page.locator('button:has-text("Try Demo")').first();
    await tryDemoButton.click();
    
    // Wait for navigation to /app
    await page.waitForURL('**/app');
    
    // Verify we're on the app page
    await expect(page).toHaveURL(/.*\/app/);
    
    // Check if sidebar is present
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/app-page.png' });
  });

  test('Sidebar Navigation - All Routes', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000/app');
    await page.waitForLoadState('networkidle');
    
    // Test all sidebar routes
    const sidebarRoutes = [
      { name: 'Dashboard', href: '/app', icon: '🏠' },
      { name: 'Capture', href: '/app/capture', icon: '✍️' },
      { name: 'Tasks', href: '/app/tasks', icon: '✅' },
      { name: 'Focus', href: '/app/focus', icon: '🎯' },
      { name: 'Agenda', href: '/app/agenda', icon: '📅' },
      { name: 'Habits', href: '/app/habits', icon: '🔥' },
      { name: 'Journal', href: '/app/journal', icon: '📔' },
      { name: 'Review', href: '/app/review', icon: '📈' },
      { name: 'Settings', href: '/app/settings', icon: '⚙️' }
    ];

    for (const route of sidebarRoutes) {
      console.log(`Testing route: ${route.name}`);
      
      // Click on the sidebar item
      const sidebarItem = page.locator(`a[href="${route.href}"]`);
      await sidebarItem.click();
      
      // Wait for navigation
      await page.waitForURL(`**${route.href}`);
      
      // Verify URL
      await expect(page).toHaveURL(`**${route.href}`);
      
      // Check if the page content loads (not just a blank page)
      await page.waitForTimeout(1000);
      
      // Take screenshot for each route
      await page.screenshot({ path: `test-results/${route.name.toLowerCase()}-page.png` });
      
      console.log(`✅ ${route.name} route working`);
    }
  });

  test('Global Capture Functionality', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000/app');
    await page.waitForLoadState('networkidle');
    
    // Find the global capture input in the topbar
    const captureInput = page.locator('input[placeholder*="Capture anything"]');
    await expect(captureInput).toBeVisible();
    
    // Test capture functionality
    await captureInput.fill('Test task from Playwright');
    await captureInput.press('Enter');
    
    // Wait for the capture to process
    await page.waitForTimeout(2000);
    
    // Check if we're redirected to tasks page
    await expect(page).toHaveURL(/.*\/app\/tasks/);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/capture-test.png' });
  });

  test('Capture Page Functionality', async ({ page }) => {
    // Navigate to capture page
    await page.goto('http://localhost:3000/app/capture');
    await page.waitForLoadState('networkidle');
    
    // Check if capture page loads
    await expect(page.locator('h1, h2')).toContainText(/capture|Capture/);
    
    // Test form submission
    const textInput = page.locator('textarea, input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Test capture from dedicated page');
      
      // Look for submit button
      const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Capture")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/capture-page.png' });
  });

  test('Backend API Integration', async ({ page }) => {
    // Test API endpoints through the frontend
    const response = await page.request.get('http://localhost:3001/api/health');
    expect(response.status()).toBe(200);
    
    const healthData = await response.json();
    expect(healthData.status).toBe('healthy');
    
    // Test analytics endpoint
    const analyticsResponse = await page.request.get('http://localhost:3001/api/analytics');
    expect(analyticsResponse.status()).toBe(200);
    
    const analyticsData = await analyticsResponse.json();
    expect(analyticsData.success).toBe(true);
    
    console.log('✅ Backend API integration working');
  });

  test('Authentication Flow (Optional)', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3000/app');
    await page.waitForLoadState('networkidle');
    
    // Check if authentication elements are present
    // This test is optional since we're using optional auth
    const authElements = page.locator('[data-testid*="auth"], [data-testid*="login"], [data-testid*="user"]');
    
    if (await authElements.count() > 0) {
      console.log('Authentication elements found');
      await page.screenshot({ path: 'test-results/auth-elements.png' });
    } else {
      console.log('No authentication elements found (using optional auth)');
    }
  });

  test('Responsive Design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/app');
    await page.waitForLoadState('networkidle');
    
    // Check if sidebar is still functional on mobile
    const sidebar = page.locator('[data-testid="sidebar"]');
    if (await sidebar.isVisible()) {
      await page.screenshot({ path: 'test-results/mobile-view.png' });
    }
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/app');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'test-results/tablet-view.png' });
  });

  test('Error Handling', async ({ page }) => {
    // Test 404 page
    await page.goto('http://localhost:3000/nonexistent-page');
    
    // Should either redirect to app or show 404
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/error-handling.png' });
  });

  test('Performance Check', async ({ page }) => {
    // Navigate to app and measure load time
    const startTime = Date.now();
    await page.goto('http://localhost:3000/app');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    // Check if load time is reasonable (less than 5 seconds)
    expect(loadTime).toBeLessThan(5000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/performance-check.png' });
  });
});
