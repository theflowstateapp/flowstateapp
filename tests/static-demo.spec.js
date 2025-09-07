import { test, expect } from '@playwright/test';

test.describe('Static Demo Page', () => {
  test('should return 200 OK', async ({ request }) => {
    const response = await request.get('/api/demo/static');
    expect(response.status()).toBe(200);
  });

  test('should have correct content type', async ({ request }) => {
    const response = await request.get('/api/demo/static');
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('should include key sections', async ({ page }) => {
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

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /AI-powered productivity platform/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'FlowState Demo - AI-Powered Productivity Platform');
  });

  test('should display dashboard stats', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for stats section
    await expect(page.locator('.stats')).toBeVisible();
    await expect(page.locator('.stat-number')).toHaveCount(4); // Total Tasks, Completed, Active Streaks, Active Projects
  });

  test('should display tasks', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for task sections
    await expect(page.locator('h3')).toContainText("Today's Tasks");
    await expect(page.locator('.task-item')).toHaveCount.greaterThan(0);
  });

  test('should display habits', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for habits section
    await expect(page.locator('h3')).toContainText('Habit Streaks');
    await expect(page.locator('.habit-streak')).toHaveCount.greaterThan(0);
  });

  test('should display journal entries', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for journal section
    await expect(page.locator('h3')).toContainText("Today's Journal");
    await expect(page.locator('.journal-entry')).toHaveCount.greaterThan(0);
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.container')).toBeVisible();
    
    // Check desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.grid')).toBeVisible();
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

  test('should handle errors gracefully', async ({ request }) => {
    // Test error handling by making request to non-existent endpoint
    const response = await request.get('/api/demo/static-nonexistent');
    expect(response.status()).toBe(404);
  });
});
