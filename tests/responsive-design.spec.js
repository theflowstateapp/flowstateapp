import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test('should display properly on 15-inch MacBook Air (1440x900)', async ({ page }) => {
    // Set viewport to 15-inch MacBook Air resolution
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the app
    await page.goto('http://localhost:3001');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'macbook-air-layout.png', fullPage: true });
    
    // Check if the main content area is properly sized
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    // Get the bounding box of the main content
    const mainContentBox = await mainContent.boundingBox();
    console.log('Main content bounding box:', mainContentBox);
    
    // Check if there's excessive gap on the left
    const sidebar = page.locator('[data-testid="sidebar"]');
    const sidebarBox = await sidebar.boundingBox();
    console.log('Sidebar bounding box:', sidebarBox);
    
    // The main content should start right after the sidebar
    if (sidebarBox && mainContentBox) {
      const expectedLeft = sidebarBox.x + sidebarBox.width;
      const actualLeft = mainContentBox.x;
      const gap = actualLeft - expectedLeft;
      
      console.log(`Expected main content left: ${expectedLeft}`);
      console.log(`Actual main content left: ${actualLeft}`);
      console.log(`Gap: ${gap}px`);
      
      // There should be minimal gap (less than 20px)
      expect(gap).toBeLessThan(20);
    }
    
    // Check if the main content takes up the remaining width
    const viewportWidth = 1440;
    const sidebarWidth = sidebarBox?.width || 0;
    const expectedMainWidth = viewportWidth - sidebarWidth;
    const actualMainWidth = mainContentBox?.width || 0;
    
    console.log(`Viewport width: ${viewportWidth}`);
    console.log(`Sidebar width: ${sidebarWidth}`);
    console.log(`Expected main content width: ${expectedMainWidth}`);
    console.log(`Actual main content width: ${actualMainWidth}`);
    
    // The main content should take up most of the remaining space
    expect(actualMainWidth).toBeGreaterThan(expectedMainWidth * 0.9);
  });
  
  test('should display properly on desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'desktop-layout.png', fullPage: true });
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const mainContentBox = await mainContent.boundingBox();
    console.log('Desktop main content bounding box:', mainContentBox);
  });
  
  test('should display properly on tablet (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ path: 'tablet-layout.png', fullPage: true });
    
    // On tablet, sidebar should be hidden by default
    const sidebar = page.locator('[data-testid="sidebar"]');
    const sidebarBox = await sidebar.boundingBox();
    
    if (sidebarBox) {
      // Sidebar should be hidden or very narrow on tablet
      expect(sidebarBox.width).toBeLessThan(100);
    }
  });
});
