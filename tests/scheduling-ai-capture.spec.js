import { test, expect } from '@playwright/test';

test.describe('Scheduling Engine + AI Capture', () => {
  test('Static demo shows AI capture example', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for AI capture section
    await expect(page.locator('h2')).toContainText('AI Capture (Read-only Example)');
    
    // Check for example input
    await expect(page.locator('.ai-input-example')).toContainText('Finish landing page hero for DXB funnel by Friday');
    
    // Check for parsed fields
    await expect(page.locator('.ai-parsed-card')).toContainText('Title: Finish landing page hero');
    await expect(page.locator('.ai-parsed-card')).toContainText('Priority: URGENT');
    await expect(page.locator('.ai-parsed-card')).toContainText('Estimate: 45 mins');
    await expect(page.locator('.ai-parsed-card')).toContainText('Suggested Time Block');
    
    // Check for live demo link
    await expect(page.locator('a[href="/api/demo/access"]')).toBeVisible();
  });

  test('AI capture API parses natural language correctly', async ({ request }) => {
    const response = await request.post('/api/capture', {
      data: {
        text: 'Finish landing page hero for DXB funnel by Friday; 45 mins; urgent'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.draft.title).toContain('Finish landing page hero');
    expect(result.draft.priority).toBe('URGENT');
    expect(result.draft.estimateMins).toBe(45);
    expect(result.draft.dueAt).toBeDefined();
  });

  test('AI capture API handles different inputs', async ({ request }) => {
    const testCases = [
      {
        input: 'Call client about project status; 15 mins; high priority',
        expected: {
          priority: 'HIGH',
          estimateMins: 15,
          context: null
        }
      },
      {
        input: 'Deep work session on new feature; 2 hours',
        expected: {
          priority: 'MEDIUM',
          estimateMins: 30, // default
          context: 'Deep Work'
        }
      },
      {
        input: 'Admin tasks: emails and calendar; 30 mins',
        expected: {
          priority: 'MEDIUM',
          estimateMins: 30,
          context: 'Admin'
        }
      }
    ];

    for (const testCase of testCases) {
      const response = await request.post('/api/capture', {
        data: { text: testCase.input }
      });
      
      expect(response.status()).toBe(200);
      
      const result = await response.json();
      expect(result.success).toBe(true);
      expect(result.draft.priority).toBe(testCase.expected.priority);
      expect(result.draft.estimateMins).toBe(testCase.expected.estimateMins);
      if (testCase.expected.context) {
        expect(result.draft.context).toBe(testCase.expected.context);
      }
    }
  });

  test('Static demo has proper structure and counts', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check for main sections
    await expect(page.locator('h1')).toContainText('FlowState Demo');
    await expect(page.locator('h2')).toContainText('Dashboard Snapshot');
    await expect(page.locator('h2')).toContainText('Tasks Overview');
    await expect(page.locator('h2')).toContainText('Habits & Streaks');
    await expect(page.locator('h2')).toContainText('Weekly Review Preview');
    await expect(page.locator('h2')).toContainText('AI Capture (Read-only Example)');
    
    // Check for stats
    await expect(page.locator('.stat-number')).toHaveCount(4);
    
    // Verify at least one numeric count > 0
    const statNumbers = await page.locator('.stat-number').allTextContents();
    const hasNonZeroCount = statNumbers.some(num => parseInt(num) > 0);
    expect(hasNonZeroCount).toBe(true);
  });

  test('Static demo is responsive and accessible', async ({ page }) => {
    await page.goto('/api/demo/static');
    
    // Check mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.container')).toBeVisible();
    
    // Check desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.grid')).toBeVisible();
    
    // Check semantic HTML
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toHaveCount.greaterThan(0);
    await expect(page.locator('table')).toBeVisible();
  });

  test('Marketing homepage still works', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page.locator('h1')).toContainText('From scattered to scheduled in 90 seconds');
    await expect(page.locator('.btn-primary')).toContainText('Interactive Demo');
    await expect(page.locator('.btn-secondary')).toContainText('Static Preview');
    
    // Check demo links
    const interactiveLink = page.locator('a[href="/api/demo/access"]');
    const staticLink = page.locator('a[href="/api/demo/static"]');
    
    await expect(interactiveLink).toBeVisible();
    await expect(staticLink).toBeVisible();
  });

  test('API endpoints return proper error codes', async ({ request }) => {
    // Test capture API with invalid input
    const response1 = await request.post('/api/capture', {
      data: { text: '' }
    });
    expect(response1.status()).toBe(400);
    
    // Test schedule propose without auth
    const response2 = await request.post('/api/schedule/propose', {
      data: { estimateMins: 30 }
    });
    expect(response2.status()).toBe(401);
    
    // Test task create without auth
    const response3 = await request.post('/api/tasks/create', {
      data: { title: 'Test task' }
    });
    expect(response3.status()).toBe(401);
  });

  test('Static demo loads under 300ms', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/demo/static');
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    expect(endTime - startTime).toBeLessThan(300);
  });
});
