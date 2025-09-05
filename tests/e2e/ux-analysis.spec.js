import { test, expect } from '@playwright/test';

test.describe('UX Analysis - All Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('Analyze Dashboard Layout and UX', async ({ page }) => {
    console.log('🔍 Analyzing Dashboard...');
    
    // Check if sidebar is properly sized
    const sidebar = page.locator('[data-testid="sidebar"], .sidebar, nav');
    if (await sidebar.count() > 0) {
      const sidebarBox = await sidebar.first().boundingBox();
      console.log(`📏 Sidebar width: ${sidebarBox?.width}px`);
      
      // Check if sidebar is too wide for compact view
      if (sidebarBox && sidebarBox.width > 320) {
        console.log('⚠️  Sidebar too wide for compact view - should be max 280px');
      }
    }

    // Check main content area
    const mainContent = page.locator('main, .main-content, [role="main"]');
    if (await mainContent.count() > 0) {
      const contentBox = await mainContent.first().boundingBox();
      console.log(`📏 Main content width: ${contentBox?.width}px`);
      
      // Check if content is cramped
      if (contentBox && contentBox.width < 600) {
        console.log('⚠️  Main content too narrow - content appears cramped');
      }
    }

    // Check for proper spacing
    const sections = page.locator('.space-y-6, .space-y-4, .p-6, .p-4');
    const sectionCount = await sections.count();
    console.log(`📦 Found ${sectionCount} sections with spacing`);

    // Check for responsive design issues
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    const compactView = page.locator('.ml-80, .ml-72');
    if (await compactView.count() > 0) {
      console.log('✅ Compact sidebar layout detected');
    }

    // Check for floating elements
    const floatingElements = page.locator('.fixed.bottom-6.right-6, .fixed.top-0, .z-50');
    const floatingCount = await floatingElements.count();
    if (floatingCount > 0) {
      console.log(`⚠️  Found ${floatingCount} floating elements that should be removed`);
    }

    // Check typography hierarchy
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    console.log(`📝 Found ${headingCount} headings - checking hierarchy...`);

    // Check color contrast (basic check)
    const textElements = page.locator('p, span, div').first();
    if (await textElements.count() > 0) {
      const color = await textElements.evaluate(el => 
        window.getComputedStyle(el).color
      );
      console.log(`🎨 Text color: ${color}`);
    }

    console.log('✅ Dashboard analysis complete\n');
  });

  test('Analyze AI Assistant Page', async ({ page }) => {
    console.log('🔍 Analyzing AI Assistant Page...');
    
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');

    // Check chat interface layout
    const chatContainer = page.locator('.flex-1, .chat-container');
    if (await chatContainer.count() > 0) {
      const chatBox = await chatContainer.first().boundingBox();
      console.log(`💬 Chat container width: ${chatBox?.width}px`);
      
      if (chatBox && chatBox.width < 500) {
        console.log('⚠️  Chat interface too narrow - should be at least 600px');
      }
    }

    // Check message bubbles
    const messages = page.locator('[class*="message"], .bg-blue-500, .bg-white');
    const messageCount = await messages.count();
    console.log(`💭 Found ${messageCount} message elements`);

    // Check input area
    const inputArea = page.locator('textarea, input[type="text"]');
    if (await inputArea.count() > 0) {
      const inputBox = await inputArea.first().boundingBox();
      console.log(`⌨️  Input area height: ${inputBox?.height}px`);
      
      if (inputBox && inputBox.height < 40) {
        console.log('⚠️  Input area too small - should be at least 48px');
      }
    }

    // Check sidebar
    const sidebar = page.locator('.w-80, .sidebar');
    if (await sidebar.count() > 0) {
      const sidebarBox = await sidebar.first().boundingBox();
      console.log(`📏 AI Assistant sidebar width: ${sidebarBox?.width}px`);
      
      if (sidebarBox && sidebarBox.width > 320) {
        console.log('⚠️  AI Assistant sidebar too wide - should be max 280px');
      }
    }

    console.log('✅ AI Assistant analysis complete\n');
  });

  test('Analyze All Main Pages', async ({ page }) => {
    const pages = [
      { name: 'Tasks', path: '/tasks' },
      { name: 'Projects', path: '/projects' },
      { name: 'Calendar', path: '/calendar' },
      { name: 'Goals', path: '/goals' },
      { name: 'Health', path: '/health' },
      { name: 'Finance', path: '/finance' },
      { name: 'Learning', path: '/learning' },
      { name: 'Relationships', path: '/relationships' },
      { name: 'Time Management', path: '/time' },
      { name: 'Knowledge', path: '/knowledge' },
      { name: 'Journal', path: '/journal' },
      { name: 'Habits', path: '/habits' },
      { name: 'Workouts', path: '/workouts' },
      { name: 'Meals', path: '/meals' },
      { name: 'Settings', path: '/settings' },
      { name: 'System', path: '/system' }
    ];

    for (const pageInfo of pages) {
      console.log(`🔍 Analyzing ${pageInfo.name} page...`);
      
      try {
        await page.goto(`http://localhost:3000${pageInfo.path}`);
        await page.waitForLoadState('networkidle');

        // Check page title
        const title = await page.title();
        console.log(`📄 Page title: ${title}`);

        // Check main content area
        const mainContent = page.locator('main, .main-content, [role="main"]');
        if (await mainContent.count() > 0) {
          const contentBox = await mainContent.first().boundingBox();
          console.log(`📏 Content width: ${contentBox?.width}px`);
          
          if (contentBox && contentBox.width < 600) {
            console.log(`⚠️  ${pageInfo.name} content too narrow`);
          }
        }

        // Check for proper spacing
        const containers = page.locator('.p-6, .p-4, .px-6, .px-4');
        const containerCount = await containers.count();
        console.log(`📦 Found ${containerCount} containers with padding`);

        // Check for cards/grid layouts
        const cards = page.locator('.grid, .card, .bg-white, .rounded-lg');
        const cardCount = await cards.count();
        console.log(`🃏 Found ${cardCount} card/grid elements`);

        // Check for buttons
        const buttons = page.locator('button, .btn, [role="button"]');
        const buttonCount = await buttons.count();
        console.log(`🔘 Found ${buttonCount} buttons`);

        // Check for forms
        const forms = page.locator('form, input, textarea, select');
        const formCount = await forms.count();
        console.log(`📝 Found ${formCount} form elements`);

        // Check for tables
        const tables = page.locator('table, .table');
        const tableCount = await tables.count();
        if (tableCount > 0) {
          console.log(`📊 Found ${tableCount} tables - checking responsiveness`);
          
          // Check if tables are responsive
          const table = tables.first();
          const tableBox = await table.boundingBox();
          if (tableBox && tableBox.width > 800) {
            console.log('⚠️  Table may not be responsive - consider horizontal scroll');
          }
        }

        // Check for modals
        const modals = page.locator('.fixed.inset-0, .modal, [role="dialog"]');
        const modalCount = await modals.count();
        if (modalCount > 0) {
          console.log(`🪟 Found ${modalCount} modal elements`);
        }

        console.log(`✅ ${pageInfo.name} analysis complete\n`);

      } catch (error) {
        console.log(`❌ Error analyzing ${pageInfo.name}: ${error.message}\n`);
      }
    }
  });

  test('Check Responsive Design', async ({ page }) => {
    console.log('🔍 Testing responsive design...');
    
    const viewports = [
      { name: 'Desktop', width: 1200, height: 800 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');

      // Check if sidebar adapts
      const sidebar = page.locator('nav, .sidebar');
      if (await sidebar.count() > 0) {
        const sidebarBox = await sidebar.first().boundingBox();
        console.log(`📏 Sidebar width: ${sidebarBox?.width}px`);
        
        if (viewport.width < 768 && sidebarBox && sidebarBox.width > 0) {
          console.log('⚠️  Sidebar should be hidden/collapsed on mobile');
        }
      }

      // Check main content
      const mainContent = page.locator('main, .main-content');
      if (await mainContent.count() > 0) {
        const contentBox = await mainContent.first().boundingBox();
        console.log(`📏 Main content width: ${contentBox?.width}px`);
        
        if (viewport.width < 768 && contentBox && contentBox.width < viewport.width * 0.9) {
          console.log('⚠️  Content not utilizing full width on mobile');
        }
      }

      // Check for horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = viewport.width;
      
      if (bodyWidth > viewportWidth) {
        console.log(`⚠️  Horizontal scroll detected: ${bodyWidth}px > ${viewportWidth}px`);
      }

      console.log(`✅ ${viewport.name} viewport test complete\n`);
    }
  });

  test('Check Accessibility and UX Best Practices', async ({ page }) => {
    console.log('🔍 Checking accessibility and UX best practices...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log(`📝 Found ${headings.length} headings`);
    
    let h1Count = 0;
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      if (tagName === 'h1') h1Count++;
    }
    
    if (h1Count === 0) {
      console.log('⚠️  No H1 heading found - should have one per page');
    } else if (h1Count > 1) {
      console.log(`⚠️  Multiple H1 headings found (${h1Count}) - should have only one per page`);
    }

    // Check for alt text on images
    const images = await page.locator('img').all();
    console.log(`🖼️  Found ${images.length} images`);
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (!alt) {
        console.log('⚠️  Image missing alt text');
      }
    }

    // Check for proper button labels
    const buttons = await page.locator('button').all();
    console.log(`🔘 Found ${buttons.length} buttons`);
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      if (!text && !ariaLabel) {
        console.log('⚠️  Button missing accessible label');
      }
    }

    // Check for proper form labels
    const inputs = await page.locator('input, textarea, select').all();
    console.log(`📝 Found ${inputs.length} form inputs`);
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      if (!id && !ariaLabel && !placeholder) {
        console.log('⚠️  Form input missing accessible label');
      }
    }

    // Check for proper focus management
    const focusableElements = await page.locator('button, input, textarea, select, a, [tabindex]').all();
    console.log(`🎯 Found ${focusableElements.length} focusable elements`);

    // Check for proper color contrast (basic check)
    const textElements = await page.locator('p, span, div, h1, h2, h3, h4, h5, h6').first();
    if (await textElements.count() > 0) {
      const color = await textElements.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          color: styles.color,
          backgroundColor: styles.backgroundColor
        };
      });
      console.log(`🎨 Text color: ${color.color}, Background: ${color.backgroundColor}`);
    }

    console.log('✅ Accessibility and UX check complete\n');
  });

  test('Performance and Loading Analysis', async ({ page }) => {
    console.log('🔍 Analyzing performance and loading...');
    
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️  Page load time: ${loadTime}ms`);
    
    if (loadTime > 3000) {
      console.log('⚠️  Page load time is slow - should be under 3 seconds');
    }

    // Check for large images
    const images = await page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        // This is a basic check - in real implementation, you'd check actual file sizes
        console.log(`🖼️  Image source: ${src}`);
      }
    }

    // Check for unused CSS/JS
    const stylesheets = await page.locator('link[rel="stylesheet"]').all();
    console.log(`🎨 Found ${stylesheets.length} stylesheets`);

    const scripts = await page.locator('script[src]').all();
    console.log(`📜 Found ${scripts.length} external scripts`);

    console.log('✅ Performance analysis complete\n');
  });
});

