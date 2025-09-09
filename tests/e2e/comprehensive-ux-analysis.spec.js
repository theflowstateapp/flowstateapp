const { test, expect } = require('@playwright/test');

test.describe('Comprehensive UX Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Sign up and login
    await page.click('text=Start Free Trial');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'test123456');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('Analyze Dashboard Layout and Spacing', async ({ page }) => {
    console.log('=== DASHBOARD ANALYSIS ===');
    
    // Take screenshot of full dashboard
    await page.screenshot({ path: 'screenshots/dashboard-full.png', fullPage: true });
    
    // Check main layout structure
    const sidebar = page.locator('[class*="w-64"]');
    const mainContent = page.locator('[class*="ml-64"]');
    
    await expect(sidebar).toBeVisible();
    await expect(mainContent).toBeVisible();
    
    // Check if content fits in viewport
    const viewportSize = page.viewportSize();
    console.log(`Viewport size: ${viewportSize.width}x${viewportSize.height}`);
    
    // Check for horizontal scrolling
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = viewportSize.width;
    console.log(`Body width: ${bodyWidth}, Viewport width: ${viewportWidth}`);
    
    if (bodyWidth > viewportWidth) {
      console.log('⚠️ Horizontal scrolling detected!');
    } else {
      console.log('✅ No horizontal scrolling');
    }
    
    // Check vertical scrolling
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const viewportHeight = viewportSize.height;
    console.log(`Body height: ${bodyHeight}, Viewport height: ${viewportHeight}`);
    
    if (bodyHeight > viewportHeight) {
      console.log('⚠️ Vertical scrolling detected!');
    } else {
      console.log('✅ No vertical scrolling');
    }
  });

  test('Analyze AI Assistant Layout', async ({ page }) => {
    console.log('=== AI ASSISTANT ANALYSIS ===');
    
    // Navigate to AI Assistant
    await page.click('text=AI Assistant');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'screenshots/ai-assistant-full.png', fullPage: true });
    
    // Check AI Assistant layout
    const aiContainer = page.locator('.h-screen');
    const messagesArea = page.locator('.flex-1');
    const inputArea = page.locator('.flex-shrink-0');
    
    await expect(aiContainer).toBeVisible();
    await expect(messagesArea).toBeVisible();
    await expect(inputArea).toBeVisible();
    
    // Check if AI Assistant fits in available space
    const aiRect = await aiContainer.boundingBox();
    const viewportSize = page.viewportSize();
    const availableWidth = viewportSize.width - 256; // Subtract sidebar width
    
    console.log(`AI Assistant dimensions: ${aiRect.width}x${aiRect.height}`);
    console.log(`Available width: ${availableWidth}`);
    console.log(`Viewport height: ${viewportSize.height}`);
    
    if (aiRect.width > availableWidth) {
      console.log('⚠️ AI Assistant is too wide!');
    } else {
      console.log('✅ AI Assistant width is appropriate');
    }
    
    if (aiRect.height > viewportSize.height) {
      console.log('⚠️ AI Assistant is too tall!');
    } else {
      console.log('✅ AI Assistant height is appropriate');
    }
    
    // Check message area size
    const messagesRect = await messagesArea.boundingBox();
    console.log(`Messages area: ${messagesRect.width}x${messagesRect.height}`);
    
    // Check if there's unused space
    const unusedHeight = viewportSize.height - aiRect.height;
    console.log(`Unused height: ${unusedHeight}px`);
    
    if (unusedHeight > 100) {
      console.log('⚠️ Significant unused space detected - AI Assistant could be bigger');
    }
  });

  test('Analyze All Main Pages Layout', async ({ page }) => {
    console.log('=== ALL PAGES ANALYSIS ===');
    
    const pages = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Tasks', path: '/tasks' },
      { name: 'Projects', path: '/projects' },
      { name: 'Areas', path: '/areas' },
      { name: 'Resources', path: '/resources' },
      { name: 'Archives', path: '/archives' },
      { name: 'Health', path: '/health' },
      { name: 'Learning', path: '/learning' },
      { name: 'Relationships', path: '/relationships' },
      { name: 'Finance', path: '/finance' },
      { name: 'Goals', path: '/goals' },
      { name: 'Calendar', path: '/calendar' }
    ];
    
    for (const pageInfo of pages) {
      console.log(`\n--- Analyzing ${pageInfo.name} ---`);
      
      try {
        await page.goto(`http://localhost:3000${pageInfo.path}`);
        await page.waitForLoadState('networkidle');
        
        // Take screenshot
        await page.screenshot({ 
          path: `screenshots/${pageInfo.name.toLowerCase()}-layout.png`, 
          fullPage: true 
        });
        
        // Check layout issues
        const viewportSize = page.viewportSize();
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
        
        console.log(`${pageInfo.name} - Body: ${bodyWidth}x${bodyHeight}, Viewport: ${viewportSize.width}x${viewportSize.height}`);
        
        if (bodyWidth > viewportSize.width) {
          console.log(`⚠️ ${pageInfo.name} has horizontal scrolling!`);
        }
        
        if (bodyHeight > viewportSize.height) {
          console.log(`⚠️ ${pageInfo.name} has vertical scrolling!`);
        }
        
        // Check for common layout issues
        const overflowingElements = await page.evaluate(() => {
          const elements = document.querySelectorAll('*');
          const overflowing = [];
          
          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
              overflowing.push({
                tag: el.tagName,
                class: el.className,
                rect: { width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom }
              });
            }
          });
          
          return overflowing;
        });
        
        if (overflowingElements.length > 0) {
          console.log(`⚠️ ${pageInfo.name} has ${overflowingElements.length} overflowing elements`);
        }
        
      } catch (error) {
        console.log(`❌ Error analyzing ${pageInfo.name}: ${error.message}`);
      }
    }
  });

  test('Check Interlinking Between Components', async ({ page }) => {
    console.log('=== INTERLINKING ANALYSIS ===');
    
    // Test navigation between main sections
    const sections = [
      { name: 'Tasks', selector: 'text=Tasks' },
      { name: 'Projects', selector: 'text=Projects' },
      { name: 'Areas', selector: 'text=Areas' },
      { name: 'Resources', selector: 'text=Resources' },
      { name: 'Archives', selector: 'text=Archives' }
    ];
    
    for (const section of sections) {
      console.log(`\n--- Testing ${section.name} Navigation ---`);
      
      try {
        // Navigate to section
        await page.click(section.selector);
        await page.waitForLoadState('networkidle');
        
        // Check if page loaded correctly
        const currentUrl = page.url();
        console.log(`${section.name} URL: ${currentUrl}`);
        
        // Check for common elements that should be present
        const hasContent = await page.locator('body').textContent();
        if (hasContent && hasContent.length > 100) {
          console.log(`✅ ${section.name} has content`);
        } else {
          console.log(`⚠️ ${section.name} seems empty or has minimal content`);
        }
        
        // Take screenshot
        await page.screenshot({ 
          path: `screenshots/${section.name.toLowerCase()}-navigation.png` 
        });
        
      } catch (error) {
        console.log(`❌ Error navigating to ${section.name}: ${error.message}`);
      }
    }
  });

  test('Analyze Responsive Behavior', async ({ page }) => {
    console.log('=== RESPONSIVE BEHAVIOR ANALYSIS ===');
    
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];
    
    for (const viewport of viewports) {
      console.log(`\n--- Testing ${viewport.name} (${viewport.width}x${viewport.height}) ---`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      await page.screenshot({ 
        path: `screenshots/responsive-${viewport.name.toLowerCase()}.png` 
      });
      
      // Check for layout issues
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      
      console.log(`Body: ${bodyWidth}x${bodyHeight}, Viewport: ${viewport.width}x${viewport.height}`);
      
      if (bodyWidth > viewport.width) {
        console.log(`⚠️ Horizontal overflow on ${viewport.name}`);
      }
      
      if (bodyHeight > viewport.height) {
        console.log(`⚠️ Vertical overflow on ${viewport.name}`);
      }
      
      // Check sidebar behavior
      const sidebar = page.locator('[class*="w-64"]');
      const sidebarVisible = await sidebar.isVisible();
      console.log(`Sidebar visible on ${viewport.name}: ${sidebarVisible}`);
      
      if (viewport.width < 768 && sidebarVisible) {
        console.log(`⚠️ Sidebar should be hidden on mobile`);
      }
    }
  });

  test('Generate UX Recommendations', async ({ page }) => {
    console.log('=== UX RECOMMENDATIONS ===');
    
    // Navigate to AI Assistant for detailed analysis
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');
    
    const viewportSize = page.viewportSize();
    const availableWidth = viewportSize.width - 256; // Sidebar width
    const availableHeight = viewportSize.height - 64; // Header height
    
    console.log(`\nAvailable space for AI Assistant:`);
    console.log(`Width: ${availableWidth}px`);
    console.log(`Height: ${availableHeight}px`);
    
    // Check current AI Assistant size
    const aiContainer = page.locator('.h-screen');
    const aiRect = await aiContainer.boundingBox();
    
    console.log(`\nCurrent AI Assistant size:`);
    console.log(`Width: ${aiRect.width}px`);
    console.log(`Height: ${aiRect.height}px`);
    
    // Calculate potential improvements
    const widthUtilization = (aiRect.width / availableWidth) * 100;
    const heightUtilization = (aiRect.height / availableHeight) * 100;
    
    console.log(`\nSpace utilization:`);
    console.log(`Width: ${widthUtilization.toFixed(1)}%`);
    console.log(`Height: ${heightUtilization.toFixed(1)}%`);
    
    // Recommendations
    console.log(`\n=== RECOMMENDATIONS ===`);
    
    if (widthUtilization < 90) {
      console.log(`1. Increase AI Assistant width to better utilize available space`);
    }
    
    if (heightUtilization < 90) {
      console.log(`2. Increase AI Assistant height to better utilize available space`);
    }
    
    console.log(`3. Ensure all screens fit in one view without scrolling`);
    console.log(`4. Implement proper data interlinking between tasks, projects, areas, resources, and archives`);
    console.log(`5. Add real-time updates when data changes in one place`);
    console.log(`6. Optimize responsive design for different screen sizes`);
  });
});




