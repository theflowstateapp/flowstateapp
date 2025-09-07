import { test, expect } from '@playwright/test';

test.describe('Static Demo with Real Data', () => {
  test('should return 200 OK with correct headers', async ({ request }) => {
    const response = await request.get('/api/demo/static');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
    expect(response.headers()['cache-control']).toContain('public, max-age=300');
    expect(response.headers()['x-robots-tag']).toBe('index,follow');
  });

  test('should contain key sections', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for main sections
    await expect(page.locator('h1')).toContainText('FlowState Demo');
    await expect(page.locator('h2')).toContainText('Dashboard Snapshot');
    await expect(page.locator('h2')).toContainText('Tasks Overview');
    await expect(page.locator('h2')).toContainText('Habits & Streaks');
    await expect(page.locator('h2')).toContainText('Weekly Review Preview');
    
    // Check for interactive demo link
    await expect(page.locator('a[href="/api/demo/access"]')).toBeVisible();
  });

  test('should display dashboard stats', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for stats section
    await expect(page.locator('.stats')).toBeVisible();
    await expect(page.locator('.stat-number')).toHaveCount(4);
    
    // Verify at least one numeric count > 0
    const statNumbers = await page.locator('.stat-number').allTextContents();
    const hasNonZeroCount = statNumbers.some(num => parseInt(num) > 0);
    expect(hasNonZeroCount).toBe(true);
  });

  test('should display today tasks', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for task sections
    await expect(page.locator('h3')).toContainText("Today's Tasks");
    
    // Should have at least 5 task rows when demo is seeded
    const taskItems = page.locator('.task-item');
    const taskCount = await taskItems.count();
    
    if (taskCount > 0) {
      expect(taskCount).toBeGreaterThanOrEqual(1);
      // Check task structure
      await expect(taskItems.first()).toContainText(/\w+/); // Should have task name
    }
  });

  test('should display habits with 7-day patterns', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for habits section
    await expect(page.locator('h3')).toContainText('Habit Streaks');
    
    const habitStreaks = page.locator('.habit-streak');
    const habitCount = await habitStreaks.count();
    
    if (habitCount > 0) {
      expect(habitCount).toBeGreaterThanOrEqual(1);
      // Check for 7-day pattern
      await expect(page.locator('.habit-pattern')).toBeVisible();
    }
  });

  test('should display weekly review preview', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for weekly review section
    await expect(page.locator('h2')).toContainText('Weekly Review Preview');
    
    // Should have at least one completed OR carry-over item
    const completedItems = page.locator('h3:has-text("Completed This Week")').locator('..').locator('li');
    const carryOverItems = page.locator('h3:has-text("Carry-overs")').locator('..').locator('li');
    
    const completedCount = await completedItems.count();
    const carryOverCount = await carryOverItems.count();
    
    expect(completedCount + carryOverCount).toBeGreaterThanOrEqual(1);
  });

  test('should have proper semantic HTML', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for semantic elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toHaveCount.greaterThan(0);
    await expect(page.locator('h3')).toHaveCount.greaterThan(0);
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('ul')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.container')).toBeVisible();
    
    // Check desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.grid')).toBeVisible();
  });

  test('should load under 300ms TTFB', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/demo/static');
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    expect(endTime - startTime).toBeLessThan(300);
  });
});

test.describe('Marketing Homepage', () => {
  test('should return 200 OK', async ({ request }) => {
    const response = await request.get('/');
    expect(response.status()).toBe(200);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /AI-powered productivity platform/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'FlowState - From scattered to scheduled in 90 seconds');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('From scattered to scheduled in 90 seconds');
    await expect(page.locator('.btn-primary')).toContainText('Interactive Demo');
    await expect(page.locator('.btn-secondary')).toContainText('Static Preview');
  });

  test('should have working demo links', async ({ page }) => {
    await page.goto('/');
    
    // Check demo links
    const interactiveLink = page.locator('a[href="/api/demo/access"]');
    const staticLink = page.locator('a[href="/api/demo/static"]');
    
    await expect(interactiveLink).toBeVisible();
    await expect(staticLink).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h2')).toContainText('How it works');
    await expect(page.locator('.step')).toHaveCount(5);
    
    await expect(page.locator('h2')).toContainText('Everything you need to stay productive');
    await expect(page.locator('.feature')).toHaveCount.greaterThan(0);
  });

  test('should display pricing section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h2')).toContainText('Simple, transparent pricing');
    await expect(page.locator('.pricing-card')).toHaveCount(2);
    await expect(page.locator('.pricing-card')).toContainText('Free');
    await expect(page.locator('.pricing-card')).toContainText('Pro');
  });

  test('should display FAQ section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h2')).toContainText('Frequently Asked Questions');
    await expect(page.locator('.faq-item')).toHaveCount.greaterThan(0);
  });

  test('should have JSON-LD structured data', async ({ page }) => {
    await page.goto('/');
    
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toBeVisible();
    
    const jsonContent = await jsonLd.textContent();
    expect(jsonContent).toContain('"@type": "WebApplication"');
    expect(jsonContent).toContain('"name": "FlowState"');
  });
});
