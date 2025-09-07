import { test, expect } from '@playwright/test';

test.describe('Interactive UI - AI Capture + Scheduling', () => {
  test('AI Capture flow works end-to-end', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/app');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if NextSuggestedCard is visible
    await expect(page.locator('text=Next Suggested Task')).toBeVisible();
    
    // Test capture box functionality
    const captureButton = page.locator('text=Capture Task');
    if (await captureButton.isVisible()) {
      await captureButton.click();
      
      // Check if capture box appears
      await expect(page.locator('textarea[placeholder*="Type any task"]')).toBeVisible();
      
      // Type a test task
      await page.fill('textarea[placeholder*="Type any task"]', 'Finish landing hero Fri, 45m; urgent');
      
      // Click capture button
      await page.click('button:has-text("Capture")');
      
      // Wait for confirmation sheet
      await expect(page.locator('text=Review & schedule')).toBeVisible();
      
      // Check if time block proposal appears
      await expect(page.locator('text=Proposed time block')).toBeVisible();
      
      // Check for Accept and Reshuffle buttons
      await expect(page.locator('button:has-text("Accept & Save")')).toBeVisible();
      await expect(page.locator('button:has-text("Reshuffle")')).toBeVisible();
    }
  });

  test('Week Agenda page loads correctly', async ({ page }) => {
    await page.goto('/agenda');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for week agenda title
    await expect(page.locator('h1:has-text("Week Agenda")')).toBeVisible();
    
    // Check for navigation buttons
    await expect(page.locator('button:has-text("This week")')).toBeVisible();
    await expect(page.locator('button:has-text("Next week")')).toBeVisible();
    
    // Check for priority legend
    await expect(page.locator('text=Priority:')).toBeVisible();
    await expect(page.locator('text=URGENT')).toBeVisible();
    await expect(page.locator('text=HIGH')).toBeVisible();
    await expect(page.locator('text=MEDIUM')).toBeVisible();
    await expect(page.locator('text=LOW')).toBeVisible();
  });

  test('Dashboard shows NextSuggestedCard', async ({ page }) => {
    await page.goto('/app');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for dashboard title
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    // Check for NextSuggestedCard
    await expect(page.locator('text=Next Suggested Task')).toBeVisible();
    
    // Check for quick stats section
    await expect(page.locator('text=Quick Stats')).toBeVisible();
    await expect(page.locator('text=Tasks Today')).toBeVisible();
    
    // Check for recent activity section
    await expect(page.locator('text=Recent Activity')).toBeVisible();
    
    // Check for habit streaks section
    await expect(page.locator('text=Habit Streaks')).toBeVisible();
  });

  test('API endpoints return proper responses', async ({ request }) => {
    // Test capture API
    const captureResponse = await request.post('/api/capture', {
      data: { text: 'Finish landing hero Fri, 45m; urgent' }
    });
    
    expect(captureResponse.status()).toBe(200);
    const captureResult = await captureResponse.json();
    expect(captureResult.success).toBe(true);
    expect(captureResult.draft.title).toContain('Finish landing hero');
    expect(captureResult.draft.priority).toBe('URGENT');

    // Test next suggested task API (will fail without auth, but should return 401)
    const nextSuggestedResponse = await request.get('/api/tasks/next-suggested');
    expect(nextSuggestedResponse.status()).toBe(401);

    // Test week agenda API (will fail without auth, but should return 401)
    const agendaResponse = await request.get('/api/agenda/week');
    expect(agendaResponse.status()).toBe(401);

    // Test schedule API (will fail without auth, but should return 401)
    const scheduleResponse = await request.post('/api/schedule/propose', {
      data: { estimateMins: 30, priority: 'HIGH' }
    });
    expect(scheduleResponse.status()).toBe(401);
  });

  test('Static demo still works with AI capture example', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for AI capture section
    await expect(page.locator('h2:has-text("AI Capture (Read-only Example)")')).toBeVisible();
    
    // Check for example input
    await expect(page.locator('text=Finish landing page hero for DXB funnel by Friday')).toBeVisible();
    
    // Check for parsed fields
    await expect(page.locator('text=Title: Finish landing page hero')).toBeVisible();
    await expect(page.locator('text=Priority: URGENT')).toBeVisible();
    await expect(page.locator('text=Estimate: 45 mins')).toBeVisible();
    await expect(page.locator('text=Suggested Time Block')).toBeVisible();
    
    // Check for live demo link
    await expect(page.locator('a[href="/api/demo/access"]')).toBeVisible();
  });

  test('Marketing homepage still works', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('h1:has-text("From scattered to scheduled in 90 seconds")')).toBeVisible();
    
    // Check demo links
    await expect(page.locator('a:has-text("Interactive Demo")')).toBeVisible();
    await expect(page.locator('a:has-text("Static Preview")')).toBeVisible();
    
    // Check features section
    await expect(page.locator('h2:has-text("Features")')).toBeVisible();
    
    // Check pricing section
    await expect(page.locator('h2:has-text("Pricing")')).toBeVisible();
  });

  test('Components are responsive', async ({ page }) => {
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
    await expect(page.locator('text=Next Suggested Task')).toBeVisible();
  });

  test('Error handling works correctly', async ({ page }) => {
    await page.goto('/app');
    
    // Test capture with empty input
    const captureButton = page.locator('text=Capture Task');
    if (await captureButton.isVisible()) {
      await captureButton.click();
      
      const captureInput = page.locator('textarea[placeholder*="Type any task"]');
      await captureInput.fill('');
      
      const captureSubmitButton = page.locator('button:has-text("Capture")');
      await expect(captureSubmitButton).toBeDisabled();
    }
  });
});
