import { test, expect } from '@playwright/test';

test.describe('AI Assistant UX Analysis', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Analyze AI Assistant Page Design', async ({ page }) => {
    console.log('🔍 Analyzing AI Assistant Page Design...');
    
    // Navigate to AI Assistant page
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual analysis
    await page.screenshot({ path: 'ai-assistant-current.png', fullPage: true });
    console.log('📸 Screenshot saved: ai-assistant-current.png');

    // Check overall layout dimensions
    const viewport = page.viewportSize();
    console.log(`📏 Viewport: ${viewport?.width}x${viewport?.height}`);

    // Check sidebar width
    const sidebar = page.locator('nav, .sidebar').first();
    if (await sidebar.count() > 0) {
      const sidebarBox = await sidebar.boundingBox();
      console.log(`📏 Sidebar width: ${sidebarBox?.width}px`);
    }

    // Check main content area
    const mainContent = page.locator('main, .main-content').first();
    if (await mainContent.count() > 0) {
      const contentBox = await mainContent.boundingBox();
      console.log(`📏 Main content width: ${contentBox?.width}px`);
      console.log(`📏 Main content height: ${contentBox?.height}px`);
    }

    // Check AI Assistant specific elements
    const chatContainer = page.locator('.flex-1, .chat-container, [class*="chat"]').first();
    if (await chatContainer.count() > 0) {
      const chatBox = await chatContainer.boundingBox();
      console.log(`💬 Chat container width: ${chatBox?.width}px`);
      console.log(`💬 Chat container height: ${chatBox?.height}px`);
    }

    // Check input area
    const inputArea = page.locator('textarea, input[type="text"], [class*="input"]').first();
    if (await inputArea.count() > 0) {
      const inputBox = await inputArea.boundingBox();
      console.log(`⌨️  Input area width: ${inputBox?.width}px`);
      console.log(`⌨️  Input area height: ${inputBox?.height}px`);
    }

    // Check message bubbles
    const messages = page.locator('[class*="message"], .bg-blue-500, .bg-white').all();
    const messageCount = await messages.length;
    console.log(`💭 Found ${messageCount} message elements`);

    // Check suggestion buttons
    const suggestions = page.locator('button, [class*="suggestion"], [class*="chip"]').all();
    const suggestionCount = await suggestions.length;
    console.log(`💡 Found ${suggestionCount} suggestion buttons`);

    // Check for ChatGPT-like elements
    const chatElements = {
      messageBubbles: await page.locator('[class*="bubble"], [class*="message"]').count(),
      inputField: await page.locator('textarea, input[type="text"]').count(),
      sendButton: await page.locator('button[class*="send"], button:has-text("Send")').count(),
      suggestions: await page.locator('[class*="suggestion"], [class*="chip"]').count(),
      typingIndicator: await page.locator('[class*="typing"], [class*="loading"]').count()
    };

    console.log('🤖 ChatGPT-like elements found:', chatElements);

    // Check spacing and padding
    const containers = page.locator('.p-6, .p-4, .px-6, .px-4, .py-6, .py-4').all();
    const containerCount = await containers.length;
    console.log(`📦 Found ${containerCount} containers with padding`);

    // Check if content fits in sidebar view
    const sidebarOpen = await page.locator('.ml-72, .ml-80').count() > 0;
    console.log(`📱 Sidebar open: ${sidebarOpen}`);

    if (sidebarOpen) {
      const availableWidth = (viewport?.width || 1200) - 288; // 288px for sidebar
      console.log(`📏 Available content width: ${availableWidth}px`);
      
      if (availableWidth < 600) {
        console.log('⚠️  Content area too narrow for optimal chat experience');
      }
    }

    // Check for proper chat interface elements
    const chatInterface = {
      hasWelcomeMessage: await page.locator('text=Welcome').count() > 0,
      hasInputPlaceholder: await page.locator('input[placeholder], textarea[placeholder]').count() > 0,
      hasSendButton: await page.locator('button:has-text("Send"), button[class*="send"]').count() > 0,
      hasSuggestions: await page.locator('[class*="suggestion"], [class*="chip"]').count() > 0,
      hasMessageHistory: await page.locator('[class*="message"]').count() > 0
    };

    console.log('💬 Chat interface elements:', chatInterface);

    // Check for compact design issues
    const compactIssues = [];
    
    // Check if messages are too spaced out
    const messageSpacing = await page.evaluate(() => {
      const messages = document.querySelectorAll('[class*="message"]');
      if (messages.length < 2) return 0;
      const first = messages[0].getBoundingClientRect();
      const second = messages[1].getBoundingClientRect();
      return second.top - first.bottom;
    });
    
    if (messageSpacing > 20) {
      compactIssues.push(`Messages too spaced out: ${messageSpacing}px`);
    }

    // Check if input area is too large
    const inputHeight = await page.evaluate(() => {
      const input = document.querySelector('textarea, input[type="text"]');
      return input ? input.getBoundingClientRect().height : 0;
    });
    
    if (inputHeight > 60) {
      compactIssues.push(`Input area too large: ${inputHeight}px height`);
    }

    // Check if suggestions take too much space
    const suggestionArea = await page.evaluate(() => {
      const suggestions = document.querySelectorAll('[class*="suggestion"], [class*="chip"]');
      if (suggestions.length === 0) return 0;
      const container = suggestions[0].parentElement;
      return container ? container.getBoundingClientRect().height : 0;
    });
    
    if (suggestionArea > 80) {
      compactIssues.push(`Suggestions take too much space: ${suggestionArea}px height`);
    }

    console.log('⚠️  Compact design issues:', compactIssues);

    // Check for ChatGPT-style improvements needed
    const improvements = [];
    
    if (chatElements.messageBubbles === 0) {
      improvements.push('Add message bubbles for better chat feel');
    }
    
    if (chatElements.suggestions === 0) {
      improvements.push('Add suggestion chips for better UX');
    }
    
    if (chatElements.typingIndicator === 0) {
      improvements.push('Add typing indicator for better feedback');
    }

    console.log('🚀 Suggested improvements:', improvements);

    console.log('✅ AI Assistant analysis complete\n');
  });

  test('Test AI Assistant Responsiveness', async ({ page }) => {
    console.log('🔍 Testing AI Assistant Responsiveness...');
    
    await page.goto('http://localhost:3000/ai-assistant');
    await page.waitForLoadState('networkidle');

    // Test different viewport sizes
    const viewports = [
      { name: 'Desktop with Sidebar', width: 1200, height: 800 },
      { name: 'Desktop Compact', width: 1000, height: 800 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);

      // Check if content fits properly
      const contentBox = await page.locator('main, .main-content').first().boundingBox();
      if (contentBox) {
        console.log(`📏 Content area: ${contentBox.width}x${contentBox.height}px`);
        
        // Check if content is cramped
        if (contentBox.width < 400) {
          console.log('⚠️  Content too narrow for good chat experience');
        }
        
        if (contentBox.height < 500) {
          console.log('⚠️  Content too short for chat interface');
        }
      }

      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `ai-assistant-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: true 
      });
    }

    console.log('✅ Responsiveness test complete\n');
  });
});



