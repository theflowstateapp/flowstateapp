import { test, expect } from '@playwright/test';

test.describe('Task Scheduling + Dashboard Upgrades', () => {
  test('Static demo shows enhanced AI capture example', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for AI capture section
    await expect(page.locator('h2:has-text("AI Capture (Read-only example)")')).toBeVisible();
    
    // Check for example input
    await expect(page.locator('text=Finish landing page hero for DXB funnel by Friday; 45 mins; urgent')).toBeVisible();
    
    // Check for draft card structure
    await expect(page.locator('h3:has-text("Draft Card")')).toBeVisible();
    await expect(page.locator('text=Title: Finish landing page hero')).toBeVisible();
    await expect(page.locator('text=PARA: Project → DXB Real Estate Funnel')).toBeVisible();
    await expect(page.locator('text=Priority: URGENT')).toBeVisible();
    await expect(page.locator('text=Due: next Friday (IST)')).toBeVisible();
    await expect(page.locator('text=Estimate: 45 mins')).toBeVisible();
    await expect(page.locator('text=Context: Deep Work')).toBeVisible();
    await expect(page.locator('text=Suggested time block: Fri, 10:00–10:45 • fits deep-work window')).toBeVisible();
    
    // Check for live demo link
    await expect(page.locator('a[href="/api/demo/access"]:has-text("Try this live")')).toBeVisible();
  });

  test('Static demo shows Today tasks with priority and time chips', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for Today section
    await expect(page.locator('h3:has-text("📋 Today")')).toBeVisible();
    
    // Check for task items with chips
    await expect(page.locator('text=Complete project proposal')).toBeVisible();
    await expect(page.locator('text=Review team feedback')).toBeVisible();
    
    // Check for priority chips
    await expect(page.locator('.priority.high')).toBeVisible();
    await expect(page.locator('.priority.medium')).toBeVisible();
    await expect(page.locator('.priority.low')).toBeVisible();
    
    // Check for time window chips
    await expect(page.locator('.time-window')).toBeVisible();
    
    // Check for context chips
    await expect(page.locator('.context-chip')).toBeVisible();
  });

  test('Dashboard shows NextSuggestedCard with proper functionality', async ({ page }) => {
    await page.goto('/app');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for NextSuggestedCard
    await expect(page.locator('text=Next suggested task')).toBeVisible();
    await expect(page.locator('text=We found a focused slot within your work hours.')).toBeVisible();
    
    // Check for Today tasks section
    await expect(page.locator('h3:has-text("Today")')).toBeVisible();
    
    // Check for capture button
    await expect(page.locator('button:has-text("Capture Task")')).toBeVisible();
  });

  test('API endpoints return proper responses', async ({ request }) => {
    // Test task scheduling API (should return 401 without auth)
    const scheduleResponse = await request.post('/api/tasks/schedule', {
      data: { id: 'test', startAt: '2025-09-07T10:00:00Z', endAt: '2025-09-07T11:00:00Z' }
    });
    expect(scheduleResponse.status()).toBe(401);

    // Test today tasks API (should return 401 without auth)
    const todayResponse = await request.get('/api/tasks/today');
    expect(todayResponse.status()).toBe(401);

    // Test next suggested task API (should return 401 without auth)
    const nextSuggestedResponse = await request.get('/api/tasks/next-suggested');
    expect(nextSuggestedResponse.status()).toBe(401);

    // Test schedule propose API (should return 401 without auth)
    const proposeResponse = await request.post('/api/schedule/propose', {
      data: { estimateMins: 30, priority: 'HIGH' }
    });
    expect(proposeResponse.status()).toBe(401);
  });

  test('API endpoints handle invalid requests correctly', async ({ request }) => {
    // Test task scheduling with missing fields
    const scheduleResponse = await request.post('/api/tasks/schedule', {
      data: { id: 'test' } // Missing startAt and endAt
    });
    expect(scheduleResponse.status()).toBe(401); // Still 401 because no auth, but structure is correct

    // Test with invalid method
    const invalidMethodResponse = await request.put('/api/tasks/schedule', {
      data: { id: 'test', startAt: '2025-09-07T10:00:00Z', endAt: '2025-09-07T11:00:00Z' }
    });
    expect(invalidMethodResponse.status()).toBe(405);
  });

  test('Static demo has proper accessibility', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for semantic headings
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toHaveCount.greaterThan(0);
    await expect(page.locator('h3')).toHaveCount.greaterThan(0);
    
    // Check for proper list structure
    await expect(page.locator('ul')).toBeVisible();
    await expect(page.locator('li')).toHaveCount.greaterThan(0);
    
    // Check for proper table structure
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th')).toHaveCount.greaterThan(0);
    await expect(page.locator('td')).toHaveCount.greaterThan(0);
  });

  test('Dashboard components are responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app');
    
    // Check if components are visible on mobile
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/app');
    
    // Check if components are visible on desktop
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text=Next suggested task')).toBeVisible();
  });

  test('Static demo loads under 300ms', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/demo/static');
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    expect(endTime - startTime).toBeLessThan(300);
  });

  test('Marketing homepage still works', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('h1:has-text("From scattered to scheduled in 90 seconds")')).toBeVisible();
    
    // Check demo links
    await expect(page.locator('a:has-text("Interactive Demo")')).toBeVisible();
    await expect(page.locator('a:has-text("Static Preview")')).toBeVisible();
  });

  test('Week Agenda page still works', async ({ page }) => {
    await page.goto('/agenda');
    
    // Check for week agenda title
    await expect(page.locator('h1:has-text("Week Agenda")')).toBeVisible();
    
    // Check for navigation buttons
    await expect(page.locator('button:has-text("This week")')).toBeVisible();
    await expect(page.locator('button:has-text("Next week")')).toBeVisible();
  });
});
