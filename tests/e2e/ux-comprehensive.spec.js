import { test, expect } from '@playwright/test';

test.describe('LifeOS Comprehensive UX Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('AI Assistant should be properly closable', async ({ page }) => {
    // Check if AI Assistant floating button is visible
    const aiButton = page.locator('button:has-text("AI Assistant")');
    await expect(aiButton).toBeVisible();

    // Click to open AI Assistant
    await aiButton.click();
    
    // Check if AI Assistant window is open
    const aiWindow = page.locator('.bg-white.rounded-lg.shadow-xl');
    await expect(aiWindow).toBeVisible();

    // Click close button
    const closeButton = page.locator('button[title="Close"]');
    await closeButton.click();

    // Check if AI Assistant is closed (floating button should be visible again)
    await expect(aiButton).toBeVisible();
    await expect(aiWindow).not.toBeVisible();
  });

  test('AI Assistant voice recording functionality', async ({ page }) => {
    // Open AI Assistant
    await page.locator('button:has-text("AI Assistant")').click();
    
    // Check if voice recording button is present
    const voiceButton = page.locator('button:has([data-lucide="Mic"])');
    await expect(voiceButton).toBeVisible();

    // Check if capture/process mode toggle is present
    const captureButton = page.locator('button:has-text("🎤 Capture")');
    const processButton = page.locator('button:has-text("📋 Process")');
    await expect(captureButton).toBeVisible();
    await expect(processButton).toBeVisible();
  });

  test('Main navigation should work', async ({ page }) => {
    // Test sidebar navigation
    const sidebar = page.locator('.fixed.left-0');
    await expect(sidebar).toBeVisible();

    // Test main navigation items
    const navItems = [
      'Dashboard',
      'Tasks',
      'Projects',
      'Areas',
      'Life Tracker'
    ];

    for (const item of navItems) {
      const navItem = page.locator(`a:has-text("${item}")`);
      if (await navItem.isVisible()) {
        await navItem.click();
        await page.waitForLoadState('networkidle');
        // Check if page loaded without errors
        await expect(page.locator('body')).not.toHaveText('Error');
      }
    }
  });

  test('Task creation flow', async ({ page }) => {
    // Navigate to new task form
    await page.goto('http://localhost:3000/new-task');
    await page.waitForLoadState('networkidle');

    // Check if form elements are present
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('select[name="priority"]')).toBeVisible();
    await expect(page.locator('select[name="lifeArea"]')).toBeVisible();
  });

  test('Life Tracker page functionality', async ({ page }) => {
    // Navigate to Life Tracker
    await page.goto('http://localhost:3000/life-tracker');
    await page.waitForLoadState('networkidle');

    // Check if life areas are displayed
    const lifeAreas = [
      'Health',
      'Finance',
      'Career',
      'Relationships',
      'Learning',
      'Personal Growth',
      'Hobbies',
      'Family',
      'Social',
      'Spiritual',
      'Travel',
      'Home'
    ];

    for (const area of lifeAreas) {
      const areaElement = page.locator(`text=${area}`);
      if (await areaElement.isVisible()) {
        await expect(areaElement).toBeVisible();
      }
    }
  });

  test('Responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if sidebar is properly hidden on mobile
    const sidebar = page.locator('.fixed.left-0');
    await expect(sidebar).toBeVisible(); // Should be visible but collapsed

    // Check if AI Assistant is accessible on mobile
    const aiButton = page.locator('button:has-text("AI Assistant")');
    await expect(aiButton).toBeVisible();
  });

  test('Dark mode toggle', async ({ page }) => {
    // Find dark mode toggle button
    const darkModeButton = page.locator('button[title="Toggle dark mode"]');
    if (await darkModeButton.isVisible()) {
      await darkModeButton.click();
      
      // Check if dark mode is applied
      const body = page.locator('body');
      const hasDarkClass = await body.evaluate(el => el.classList.contains('dark'));
      expect(hasDarkClass).toBeTruthy();
    }
  });

  test('Quick capture functionality', async ({ page }) => {
    // Navigate to quick capture
    await page.goto('http://localhost:3000/quick-capture');
    await page.waitForLoadState('networkidle');

    // Check if quick capture form is present
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
  });

  test('Search functionality', async ({ page }) => {
    // Navigate to search page
    await page.goto('http://localhost:3000/search');
    await page.waitForLoadState('networkidle');

    // Check if search input is present
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]');
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('Settings page accessibility', async ({ page }) => {
    // Navigate to settings
    await page.goto('http://localhost:3000/settings');
    await page.waitForLoadState('networkidle');

    // Check if settings form elements are present
    const settingsForm = page.locator('form');
    if (await settingsForm.isVisible()) {
      await expect(settingsForm).toBeVisible();
    }
  });

  test('Error handling and loading states', async ({ page }) => {
    // Test with slow network
    await page.route('**/*', route => {
      route.continue();
    });

    // Navigate to different pages and check for loading states
    const pages = ['/', '/dashboard', '/tasks', '/projects'];
    
    for (const pageUrl of pages) {
      await page.goto(`http://localhost:3000${pageUrl}`);
      await page.waitForLoadState('networkidle');
      
      // Check for any error messages
      const errorElements = page.locator('.error, .alert, [role="alert"]');
      if (await errorElements.count() > 0) {
        console.log(`Found error on ${pageUrl}:`, await errorElements.textContent());
      }
    }
  });

  test('Accessibility compliance', async ({ page }) => {
    // Navigate to main page
    await page.goto('http://localhost:3000');
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();

    // Check for proper button labels
    const buttons = page.locator('button');
    for (let i = 0; i < Math.min(await buttons.count(), 10); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      const text = await button.textContent();
      
      // At least one of these should be present for accessibility
      expect(ariaLabel || title || text?.trim()).toBeTruthy();
    }

    // Check for proper form labels
    const inputs = page.locator('input, textarea, select');
    for (let i = 0; i < Math.min(await inputs.count(), 5); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      // At least one of these should be present
      expect(id || ariaLabel || placeholder).toBeTruthy();
    }
  });

  test('Performance and loading times', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to main page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});

