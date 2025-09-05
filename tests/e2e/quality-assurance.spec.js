import { test, expect } from '@playwright/test';

test.describe('LifeOS Quality Assurance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('AI Assistant should work properly', async ({ page }) => {
    const aiButton = page.locator('button:has-text("AI Assistant")');
    await expect(aiButton).toBeVisible();
    await aiButton.click();
    
    const aiWindow = page.locator('.bg-white.rounded-lg.shadow-xl');
    await expect(aiWindow).toBeVisible();
    
    const closeButton = page.locator('button[title="Close"]');
    await closeButton.click();
    await expect(aiWindow).not.toBeVisible();
  });

  test('Voice recording should work', async ({ page }) => {
    await page.locator('button:has-text("AI Assistant")').click();
    const voiceButton = page.locator('button:has([data-lucide="Mic"])');
    await expect(voiceButton).toBeVisible();
    await voiceButton.click();
    
    const recordingStatus = page.locator('text=Recording...');
    await expect(recordingStatus).toBeVisible();
  });

  test('Navigation should work', async ({ page }) => {
    const navItems = ['Dashboard', 'Tasks', 'Projects', 'Areas', 'Life Tracker'];
    
    for (const item of navItems) {
      const navItem = page.locator(`a:has-text("${item}")`);
      if (await navItem.isVisible()) {
        await navItem.click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('body')).not.toHaveText('Error');
      }
    }
  });

  test('Mobile responsiveness', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const aiButton = page.locator('button:has-text("AI Assistant")');
    await expect(aiButton).toBeVisible();
  });

  test('Performance test', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('Error handling', async ({ page }) => {
    await page.goto('http://localhost:3000/new-task');
    const submitButton = page.locator('button:has-text("Create Task")');
    await submitButton.click();
    await expect(page.locator('body')).not.toHaveText('Cannot read property');
  });

  test('Accessibility', async ({ page }) => {
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
    
    const buttons = page.locator('button');
    for (let i = 0; i < Math.min(await buttons.count(), 5); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      const text = await button.textContent();
      expect(ariaLabel || title || text?.trim()).toBeTruthy();
    }
  });
});
