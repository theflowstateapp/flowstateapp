const { test, expect } = require('@playwright/test');

test.describe('Comprehensive UX Analysis - LifeOS', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Mock authentication
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test User'
      }));
      localStorage.setItem('token', 'mock-token');
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('AI Assistant Page - Layout Analysis', async ({ page }) => {
    // Navigate to AI Assistant
    await page.click('text=AI Assistant');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/ai-assistant-fixed.png', fullPage: true });
    
    // Check layout issues
    const container = page.locator('[data-testid="ai-assistant-container"]');
    await expect(container).toBeVisible();
    
    // Check if there's no gap below input
    const inputArea = page.locator('[data-testid="ai-input-area"]');
    const inputRect = await inputArea.boundingBox();
    const viewportHeight = await page.viewportSize().height;
    
    console.log('AI Assistant - Input area bottom:', inputRect.y + inputRect.height);
    console.log('AI Assistant - Viewport height:', viewportHeight);
    
    // Check if top is not cut off
    const header = page.locator('[data-testid="ai-assistant-header"]');
    const headerRect = await header.boundingBox();
    console.log('AI Assistant - Header top:', headerRect.y);
    
    // Verify no gap at bottom
    const gap = viewportHeight - (inputRect.y + inputRect.height);
    console.log('AI Assistant - Gap below input:', gap);
    
    // Should be minimal gap (less than 20px)
    expect(gap).toBeLessThan(20);
  });

  test('Dashboard Page - Compact Layout Analysis', async ({ page }) => {
    // Navigate to Dashboard
    await page.click('text=Dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/dashboard-compact.png', fullPage: true });
    
    // Check if content fits well
    const dashboardContainer = page.locator('[data-testid="dashboard-container"]');
    await expect(dashboardContainer).toBeVisible();
    
    // Check main sections
    const sections = [
      'quick-capture-section',
      'ai-assistant-section', 
      'projects-section',
      'life-areas-section'
    ];
    
    for (const sectionId of sections) {
      const section = page.locator(`[data-testid="${sectionId}"]`);
      if (await section.count() > 0) {
        const rect = await section.boundingBox();
        console.log(`Dashboard ${sectionId}:`, {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          x: Math.round(rect.x),
          y: Math.round(rect.y)
        });
      }
    }
  });

  test('Tasks Page - Compact Layout Analysis', async ({ page }) => {
    // Navigate to Tasks
    await page.click('text=Tasks');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/tasks-compact.png', fullPage: true });
    
    // Check compact layout
    const tasksContainer = page.locator('[data-testid="tasks-container"]');
    await expect(tasksContainer).toBeVisible();
    
    // Check header size
    const header = page.locator('h1');
    const headerText = await header.textContent();
    console.log('Tasks header:', headerText);
    
    // Check if stats cards are compact
    const statsCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-4 > div');
    const cardCount = await statsCards.count();
    console.log('Tasks stats cards count:', cardCount);
    
    if (cardCount > 0) {
      const firstCard = statsCards.first();
      const cardRect = await firstCard.boundingBox();
      console.log('Tasks stats card dimensions:', {
        width: Math.round(cardRect.width),
        height: Math.round(cardRect.height)
      });
    }
  });

  test('Projects Page - Compact Layout Analysis', async ({ page }) => {
    // Navigate to Projects
    await page.click('text=Projects');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/projects-compact.png', fullPage: true });
    
    // Check compact layout
    const projectsContainer = page.locator('[data-testid="projects-container"]');
    await expect(projectsContainer).toBeVisible();
    
    // Check header
    const header = page.locator('h1');
    const headerText = await header.textContent();
    console.log('Projects header:', headerText);
  });

  test('Goals Page - Compact Layout Analysis', async ({ page }) => {
    // Navigate to Goals
    await page.click('text=Goals');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/goals-compact.png', fullPage: true });
    
    // Check compact layout
    const goalsContainer = page.locator('[data-testid="goals-container"]');
    await expect(goalsContainer).toBeVisible();
    
    // Check header
    const header = page.locator('h1');
    const headerText = await header.textContent();
    console.log('Goals header:', headerText);
  });

  test('Overall Layout and Scrolling Analysis', async ({ page }) => {
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
    expect(mainContentOverflow).toBe('auto');
    
    // Take full page screenshot
    await page.screenshot({ path: 'tests/screenshots/full-layout-fixed.png', fullPage: true });
    
    // Check sidebar width
    const sidebarRect = await sidebar.boundingBox();
    console.log('Sidebar width:', Math.round(sidebarRect.width));
    expect(sidebarRect.width).toBeLessThanOrEqual(256); // w-64 = 256px
  });

  test('Responsive Design Analysis', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1280, height: 720 }, // Desktop
      { width: 1024, height: 768 }, // Tablet
      { width: 768, height: 1024 }  // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `tests/screenshots/responsive-${viewport.width}x${viewport.height}.png`,
        fullPage: true 
      });
      
      // Check if sidebar adapts
      const sidebar = page.locator('[data-testid="sidebar"]');
      const sidebarRect = await sidebar.boundingBox();
      
      console.log(`Viewport ${viewport.width}x${viewport.height}:`, {
        sidebarWidth: Math.round(sidebarRect.width),
        sidebarVisible: await sidebar.isVisible()
      });
    }
  });

  test('UX Improvements Analysis', async ({ page }) => {
    // Navigate through all main pages
    const pages = ['Dashboard', 'Tasks', 'Projects', 'Goals', 'AI Assistant'];
    
    for (const pageName of pages) {
      await page.click(`text=${pageName}`);
      await page.waitForLoadState('networkidle');
      
      // Check for common UX issues
      const headings = page.locator('h1, h2, h3');
      const headingCount = await headings.count();
      
      console.log(`${pageName} page headings count:`, headingCount);
      
      // Check for proper spacing
      const containers = page.locator('[data-testid*="container"]');
      const containerCount = await containers.count();
      
      console.log(`${pageName} containers count:`, containerCount);
      
      // Check for buttons and interactive elements
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      console.log(`${pageName} buttons count:`, buttonCount);
      
      // Take screenshot
      await page.screenshot({ 
        path: `tests/screenshots/ux-analysis-${pageName.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true 
      });
    }
  });
});




