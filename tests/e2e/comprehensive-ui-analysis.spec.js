const { test, expect } = require('@playwright/test');

test.describe('Comprehensive UI/UX Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Mock authentication by setting localStorage
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test User'
      }));
      localStorage.setItem('token', 'mock-token');
    });
    
    // Reload to apply auth state
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('Analyze AI Assistant page layout', async ({ page }) => {
    // Navigate to AI Assistant
    await page.click('[data-testid="ai-assistant-nav"]');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/ai-assistant-current.png', fullPage: true });
    
    // Check for layout issues
    const aiAssistantContainer = page.locator('[data-testid="ai-assistant-container"]');
    await expect(aiAssistantContainer).toBeVisible();
    
    // Check if there's a gap below input
    const inputArea = page.locator('[data-testid="ai-input-area"]');
    const inputRect = await inputArea.boundingBox();
    const viewportHeight = await page.viewportSize().height;
    
    console.log('Input area bottom:', inputRect.y + inputRect.height);
    console.log('Viewport height:', viewportHeight);
    
    // Check if top is cut off
    const header = page.locator('[data-testid="ai-assistant-header"]');
    const headerRect = await header.boundingBox();
    console.log('Header top:', headerRect.y);
  });

  test('Analyze Dashboard page layout', async ({ page }) => {
    // Navigate to Dashboard
    await page.click('[data-testid="dashboard-nav"]');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/dashboard-current.png', fullPage: true });
    
    // Check layout
    const dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    await expect(dashboardContainer).toBeVisible();
  });

  test('Analyze Tasks page layout', async ({ page }) => {
    // Navigate to Tasks
    await page.click('[data-testid="tasks-nav"]');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/tasks-current.png', fullPage: true });
    
    // Check if content is cut off
    const tasksContainer = page.locator('[data-testid="tasks-container"]');
    await expect(tasksContainer).toBeVisible();
  });

  test('Analyze Projects page layout', async ({ page }) => {
    // Navigate to Projects
    await page.click('[data-testid="projects-nav"]');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/projects-current.png', fullPage: true });
  });

  test('Analyze Goals page layout', async ({ page }) => {
    // Navigate to Goals
    await page.click('[data-testid="goals-nav"]');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/goals-current.png', fullPage: true });
  });

  test('Check overall layout and scrolling behavior', async ({ page }) => {
    // Check main layout structure
    const sidebar = page.locator('[data-testid="sidebar"]');
    const mainContent = page.locator('[data-testid="main-content"]');
    
    await expect(sidebar).toBeVisible();
    await expect(mainContent).toBeVisible();
    
    // Check if main content has proper scrolling
    const mainContentOverflow = await mainContent.evaluate(el => {
      return window.getComputedStyle(el).overflowY;
    });
    
    console.log('Main content overflow:', mainContentOverflow);
    
    // Take full page screenshot
    await page.screenshot({ path: 'tests/screenshots/full-layout-current.png', fullPage: true });
  });

  test('Measure page element sizes and spacing', async ({ page }) => {
    // Navigate to dashboard first
    await page.click('[data-testid="dashboard-nav"]');
    await page.waitForLoadState('networkidle');
    
    // Measure various elements
    const elements = [
      'dashboard-container',
      'quick-capture-section',
      'ai-assistant-section',
      'projects-section',
      'life-areas-section'
    ];
    
    for (const elementId of elements) {
      const element = page.locator(`[data-testid="${elementId}"]`);
      if (await element.count() > 0) {
        const rect = await element.boundingBox();
        console.log(`${elementId}:`, {
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y
        });
      }
    }
  });
});




