const { test, expect } = require('@playwright/test');

test.describe('UX Layout Analysis', () => {
  test('Analyze Landing Page Layout', async ({ page }) => {
    console.log('=== LANDING PAGE ANALYSIS ===');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/landing-page.png', fullPage: true });
    
    // Check viewport and content dimensions
    const viewportSize = page.viewportSize();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    
    console.log(`Viewport: ${viewportSize.width}x${viewportSize.height}`);
    console.log(`Body: ${bodyWidth}x${bodyHeight}`);
    
    // Check for scrolling issues
    if (bodyWidth > viewportSize.width) {
      console.log('⚠️ Horizontal scrolling detected!');
    } else {
      console.log('✅ No horizontal scrolling');
    }
    
    if (bodyHeight > viewportSize.height) {
      console.log('⚠️ Vertical scrolling detected!');
    } else {
      console.log('✅ No vertical scrolling');
    }
    
    // Check key elements
    const header = page.locator('header, nav');
    const hero = page.locator('section').first();
    
    await expect(header).toBeVisible();
    await expect(hero).toBeVisible();
    
    console.log('✅ Landing page elements are visible');
  });

  test('Analyze Dashboard Layout (without auth)', async ({ page }) => {
    console.log('=== DASHBOARD LAYOUT ANALYSIS ===');
    
    // Try to access dashboard directly
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/dashboard-direct.png', fullPage: true });
    
    // Check if we're redirected to landing page
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully accessed dashboard');
      
      // Analyze layout
      const viewportSize = page.viewportSize();
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      
      console.log(`Viewport: ${viewportSize.width}x${viewportSize.height}`);
      console.log(`Body: ${bodyWidth}x${bodyHeight}`);
      
      // Check for layout issues
      if (bodyWidth > viewportSize.width) {
        console.log('⚠️ Dashboard has horizontal scrolling!');
      }
      
      if (bodyHeight > viewportSize.height) {
        console.log('⚠️ Dashboard has vertical scrolling!');
      }
      
      // Check sidebar and main content
      const sidebar = page.locator('[class*="w-64"], [class*="w-72"]');
      const mainContent = page.locator('[class*="ml-64"], [class*="ml-72"]');
      
      const sidebarVisible = await sidebar.isVisible();
      const mainContentVisible = await mainContent.isVisible();
      
      console.log(`Sidebar visible: ${sidebarVisible}`);
      console.log(`Main content visible: ${mainContentVisible}`);
      
      if (sidebarVisible && mainContentVisible) {
        console.log('✅ Layout structure is correct');
      }
      
    } else {
      console.log('⚠️ Redirected to landing page - authentication required');
    }
  });

  test('Analyze AI Assistant Layout (without auth)', async ({ page }) => {
    console.log('=== AI ASSISTANT LAYOUT ANALYSIS ===');
    
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/ai-assistant-direct.png', fullPage: true });
    
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/ai-assistant')) {
      console.log('✅ Successfully accessed AI Assistant');
      
      // Analyze AI Assistant layout
      const viewportSize = page.viewportSize();
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      
      console.log(`Viewport: ${viewportSize.width}x${viewportSize.height}`);
      console.log(`Body: ${bodyWidth}x${bodyHeight}`);
      
      // Check for AI Assistant specific elements
      const aiContainer = page.locator('.h-screen, .flex.flex-col');
      const messagesArea = page.locator('.flex-1, .overflow-y-auto');
      const inputArea = page.locator('.flex-shrink-0, .border-t');
      
      const aiContainerVisible = await aiContainer.isVisible();
      const messagesAreaVisible = await messagesArea.isVisible();
      const inputAreaVisible = await inputArea.isVisible();
      
      console.log(`AI Container visible: ${aiContainerVisible}`);
      console.log(`Messages area visible: ${messagesAreaVisible}`);
      console.log(`Input area visible: ${inputAreaVisible}`);
      
      if (aiContainerVisible) {
        const aiRect = await aiContainer.boundingBox();
        console.log(`AI Container: ${aiRect.width}x${aiRect.height}`);
        
        // Calculate space utilization
        const availableWidth = viewportSize.width - 256; // Assuming sidebar
        const availableHeight = viewportSize.height - 64; // Assuming header
        
        const widthUtilization = (aiRect.width / availableWidth) * 100;
        const heightUtilization = (aiRect.height / availableHeight) * 100;
        
        console.log(`Width utilization: ${widthUtilization.toFixed(1)}%`);
        console.log(`Height utilization: ${heightUtilization.toFixed(1)}%`);
        
        if (widthUtilization < 80) {
          console.log('⚠️ AI Assistant could use more width');
        }
        
        if (heightUtilization < 80) {
          console.log('⚠️ AI Assistant could use more height');
        }
      }
      
    } else {
      console.log('⚠️ Redirected to landing page - authentication required');
    }
  });

  test('Check All Page Routes', async ({ page }) => {
    console.log('=== PAGE ROUTES ANALYSIS ===');
    
    const routes = [
      '/dashboard',
      '/ai-assistant', 
      '/tasks',
      '/projects',
      '/areas',
      '/resources',
      '/archives',
      '/health',
      '/learning',
      '/relationships',
      '/finance',
      '/goals',
      '/calendar'
    ];
    
    for (const route of routes) {
      console.log(`\n--- Testing ${route} ---`);
      
      try {
        await page.goto(`http://localhost:3000${route}`);
        await page.waitForLoadState('networkidle');
        
        const currentUrl = page.url();
        console.log(`${route} -> ${currentUrl}`);
        
        // Take screenshot
        await page.screenshot({ 
          path: `screenshots/route-${route.replace('/', '')}.png` 
        });
        
        // Check for layout issues
        const viewportSize = page.viewportSize();
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        
        if (bodyWidth > viewportSize.width) {
          console.log(`⚠️ ${route} has horizontal overflow`);
        }
        
        if (bodyHeight > viewportSize.height) {
          console.log(`⚠️ ${route} has vertical overflow`);
        }
        
        // Check if page has content
        const hasContent = await page.locator('body').textContent();
        if (hasContent && hasContent.length > 50) {
          console.log(`✅ ${route} has content`);
        } else {
          console.log(`⚠️ ${route} seems empty`);
        }
        
      } catch (error) {
        console.log(`❌ Error accessing ${route}: ${error.message}`);
      }
    }
  });

  test('Generate Layout Recommendations', async ({ page }) => {
    console.log('=== LAYOUT RECOMMENDATIONS ===');
    
    // Test different viewport sizes
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet', width: 768, height: 1024 }
    ];
    
    for (const viewport of viewports) {
      console.log(`\n--- Testing ${viewport.name} (${viewport.width}x${viewport.height}) ---`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Test landing page
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      
      console.log(`Landing page - Body: ${bodyWidth}x${bodyHeight}`);
      
      if (bodyWidth > viewport.width) {
        console.log(`⚠️ Landing page overflows horizontally on ${viewport.name}`);
      }
      
      if (bodyHeight > viewport.height) {
        console.log(`⚠️ Landing page overflows vertically on ${viewport.name}`);
      }
      
      // Test AI Assistant if accessible
      await page.goto('http://localhost:3000/ai-assistant');
      await page.waitForLoadState('networkidle');
      
      const currentUrl = page.url();
      if (currentUrl.includes('/ai-assistant')) {
        const aiBodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const aiBodyHeight = await page.evaluate(() => document.body.scrollHeight);
        
        console.log(`AI Assistant - Body: ${aiBodyWidth}x${aiBodyHeight}`);
        
        if (aiBodyWidth > viewport.width) {
          console.log(`⚠️ AI Assistant overflows horizontally on ${viewport.name}`);
        }
        
        if (aiBodyHeight > viewport.height) {
          console.log(`⚠️ AI Assistant overflows vertically on ${viewport.name}`);
        }
      }
    }
    
    console.log('\n=== RECOMMENDATIONS ===');
    console.log('1. Ensure all pages fit within viewport without scrolling');
    console.log('2. Make AI Assistant chat window utilize more available space');
    console.log('3. Implement proper responsive design for different screen sizes');
    console.log('4. Add proper data interlinking between all components');
    console.log('5. Ensure real-time updates across all interconnected elements');
  });
});



