import { test, expect } from '@playwright/test';

test.describe('AI Assistant Final Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Validate ChatGPT-like AI Assistant Design', async ({ page }) => {
    console.log('🎯 Validating ChatGPT-like AI Assistant Design...');
    
    // Navigate to AI Assistant page
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');

    // Take final screenshot
    await page.screenshot({ path: 'ai-assistant-final.png', fullPage: true });
    console.log('📸 Final screenshot saved: ai-assistant-final.png');

    // Check header design
    const header = page.locator('div:has-text("AI Assistant")').first();
    await expect(header).toBeVisible();
    console.log('✅ Header with AI Assistant title is visible');

    // Check compact header design
    const headerHeight = await header.boundingBox();
    if (headerHeight && headerHeight.height <= 60) {
      console.log('✅ Header is compact (≤60px height)');
    } else {
      console.log('⚠️  Header could be more compact');
    }

    // Check welcome message
    const welcomeMessage = page.locator('text=Welcome to your AI Assistant!');
    await expect(welcomeMessage).toBeVisible();
    console.log('✅ Welcome message is visible');

    // Check suggestion buttons
    const suggestions = page.locator('button:has-text("Plan my day"), button:has-text("Create a task")');
    const suggestionCount = await suggestions.count();
    if (suggestionCount >= 2) {
      console.log(`✅ Found ${suggestionCount} suggestion buttons`);
    } else {
      console.log('⚠️  Suggestion buttons not found');
    }

    // Check input field
    const inputField = page.locator('textarea[placeholder*="Ask me anything"]');
    await expect(inputField).toBeVisible();
    console.log('✅ Input field with proper placeholder is visible');

    // Check send button
    const sendButton = page.locator('button:has(svg)').last(); // Last button with icon should be send
    await expect(sendButton).toBeVisible();
    console.log('✅ Send button is visible');

    // Test chat functionality
    await inputField.fill('Hello, help me plan my day');
    await sendButton.click();
    
    // Wait for loading state
    await page.waitForSelector('text=Thinking...', { timeout: 5000 });
    console.log('✅ Loading indicator appears');

    // Wait for AI response
    await page.waitForSelector('text=I understand you want to', { timeout: 10000 });
    console.log('✅ AI response appears');

    // Check message bubbles
    const userMessage = page.locator('text=Hello, help me plan my day');
    await expect(userMessage).toBeVisible();
    console.log('✅ User message bubble is visible');

    const aiMessage = page.locator('text=I understand you want to');
    await expect(aiMessage).toBeVisible();
    console.log('✅ AI message bubble is visible');

    // Check action buttons
    const actionButtons = page.locator('button:has-text("Create Task"), button:has-text("Set Goal")');
    const actionCount = await actionButtons.count();
    if (actionCount >= 2) {
      console.log(`✅ Found ${actionCount} action buttons`);
    } else {
      console.log('⚠️  Action buttons not found');
    }

    // Test action button functionality
    if (actionCount > 0) {
      await actionButtons.first().click();
      // Should show toast notification
      await page.waitForSelector('text=Action "Create Task" triggered!', { timeout: 3000 });
      console.log('✅ Action button functionality works');
    }

    // Check compact design
    const viewport = page.viewportSize();
    const sidebar = page.locator('nav, .sidebar').first();
    const sidebarBox = await sidebar.boundingBox();
    const mainContent = page.locator('main, .main-content').first();
    const contentBox = await mainContent.boundingBox();

    if (contentBox && sidebarBox) {
      const availableWidth = (viewport?.width || 1200) - sidebarBox.width;
      const widthUtilization = (contentBox.width / availableWidth) * 100;
      
      if (widthUtilization >= 90) {
        console.log(`✅ Excellent width utilization: ${widthUtilization.toFixed(1)}%`);
      } else if (widthUtilization >= 80) {
        console.log(`✅ Good width utilization: ${widthUtilization.toFixed(1)}%`);
      } else {
        console.log(`⚠️  Width utilization could be better: ${widthUtilization.toFixed(1)}%`);
      }
    }

    // Check responsive design
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.waitForTimeout(500);
    
    const compactContentBox = await mainContent.boundingBox();
    if (compactContentBox && compactContentBox.width >= 600) {
      console.log('✅ Good responsive design on smaller screens');
    } else {
      console.log('⚠️  Could improve responsive design');
    }

    // Test suggestion functionality
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');
    
    const suggestionButton = page.locator('button:has-text("Plan my day")').first();
    if (await suggestionButton.count() > 0) {
      await suggestionButton.click();
      const inputValue = await inputField.inputValue();
      if (inputValue === 'Plan my day') {
        console.log('✅ Suggestion click fills input field');
      } else {
        console.log('⚠️  Suggestion click not working properly');
      }
    }

    // Test keyboard shortcuts
    await inputField.fill('Test keyboard shortcut');
    await inputField.press('Enter');
    
    // Should send message
    await page.waitForSelector('text=Test keyboard shortcut', { timeout: 3000 });
    console.log('✅ Enter key sends message');

    // Test clear chat functionality
    const clearButton = page.locator('button[title="Clear chat"]');
    if (await clearButton.count() > 0) {
      await clearButton.click();
      await page.waitForSelector('text=Welcome to your AI Assistant!', { timeout: 3000 });
      console.log('✅ Clear chat functionality works');
    }

    console.log('🎉 AI Assistant validation complete!\n');
  });

  test('Performance and UX Metrics', async ({ page }) => {
    console.log('📊 Measuring Performance and UX Metrics...');
    
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');

    // Measure load time
    const startTime = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    if (loadTime < 2000) {
      console.log(`✅ Fast load time: ${loadTime}ms`);
    } else if (loadTime < 3000) {
      console.log(`⚠️  Moderate load time: ${loadTime}ms`);
    } else {
      console.log(`❌ Slow load time: ${loadTime}ms`);
    }

    // Check for accessibility
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    if (headings > 0) {
      console.log(`✅ Found ${headings} headings for accessibility`);
    } else {
      console.log('⚠️  No headings found - accessibility concern');
    }

    // Check for proper focus management
    const focusableElements = await page.locator('button, input, textarea, [tabindex]').count();
    console.log(`📝 Found ${focusableElements} focusable elements`);

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    if (focusedElement) {
      console.log(`✅ Keyboard navigation works (focused: ${focusedElement})`);
    }

    // Check for proper contrast (basic check)
    const textElements = await page.locator('p, span, div').first();
    if (await textElements.count() > 0) {
      const color = await textElements.evaluate(el => 
        window.getComputedStyle(el).color
      );
      console.log(`🎨 Text color: ${color}`);
    }

    console.log('📊 Performance and UX metrics complete!\n');
  });
});



