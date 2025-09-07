import { test, expect } from '@playwright/test';

test.describe('Demo Microsite - SSR Pages', () => {
  test('Demo overview page loads correctly', async ({ page }) => {
    await page.goto('/demo');
    
    // Check page loads
    await expect(page.locator('h1:has-text("Demo Overview")')).toBeVisible();
    
    // Check navigation
    await expect(page.locator('a[href="/demo/tasks"]')).toBeVisible();
    await expect(page.locator('a[href="/demo/habits"]')).toBeVisible();
    await expect(page.locator('a[href="/demo/journal"]')).toBeVisible();
    await expect(page.locator('a[href="/demo/review"]')).toBeVisible();
    await expect(page.locator('a[href="/demo/agenda"]')).toBeVisible();
    await expect(page.locator('a[href="/demo/settings"]')).toBeVisible();
    
    // Check dashboard snapshot
    await expect(page.locator('text=Dashboard Snapshot')).toBeVisible();
    await expect(page.locator('.stat-number')).toHaveCount(4);
    
    // Check sections
    await expect(page.locator('text=Today')).toBeVisible();
    await expect(page.locator('text=Next Suggested Task')).toBeVisible();
    await expect(page.locator('text=Habit Streaks')).toBeVisible();
    await expect(page.locator('text=Today\'s Journal')).toBeVisible();
    
    // Check CTAs
    await expect(page.locator('a[href="/api/demo/access"]:has-text("Open Interactive Demo")')).toBeVisible();
    await expect(page.locator('a[href="/api/demo/static"]:has-text("See Static Preview")')).toBeVisible();
  });

  test('Tasks demo page shows task management features', async ({ page }) => {
    await page.goto('/demo/tasks');
    
    // Check page loads
    await expect(page.locator('h1:has-text("Tasks (Read-only Demo)")')).toBeVisible();
    
    // Check Alive Today section
    await expect(page.locator('text=Alive Today')).toBeVisible();
    await expect(page.locator('.priority.high')).toBeVisible();
    await expect(page.locator('.time-chip')).toBeVisible();
    await expect(page.locator('.context-chip')).toBeVisible();
    
    // Check Board Snapshot
    await expect(page.locator('text=Board Snapshot')).toBeVisible();
    await expect(page.locator('text=Inbox')).toBeVisible();
    await expect(page.locator('text=Next')).toBeVisible();
    await expect(page.locator('text=In Progress')).toBeVisible();
    await expect(page.locator('text=Done')).toBeVisible();
    
    // Check All Tasks table
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Title")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Priority")')).toBeVisible();
    
    // Check note about interactive features
    await expect(page.locator('text=Drag-drop and edits available in interactive app')).toBeVisible();
  });

  test('Habits demo page shows habit tracking', async ({ page }) => {
    await page.goto('/demo/habits');
    
    // Check page loads
    await expect(page.locator('h1:has-text("Habits (Read-only Demo)")')).toBeVisible();
    
    // Check habit streaks
    await expect(page.locator('text=Habit Streaks')).toBeVisible();
    await expect(page.locator('.habit-streak')).toHaveCount(3);
    await expect(page.locator('.streak-number')).toHaveCount(3);
    await expect(page.locator('.habit-pattern')).toBeVisible();
    
    // Check heatmap
    await expect(page.locator('text=90-Day Heatmap')).toBeVisible();
    await expect(page.locator('text=Completed')).toBeVisible();
    await expect(page.locator('text=Not completed')).toBeVisible();
    
    // Check note about interactive features
    await expect(page.locator('text=1-tap check-ins and heatmap interactions available')).toBeVisible();
  });

  test('Journal demo page shows journal features', async ({ page }) => {
    await page.goto('/demo/journal');
    
    // Check page loads
    await expect(page.locator('h1:has-text("Journal (Read-only Demo)")')).toBeVisible();
    
    // Check today's entry
    await expect(page.locator('text=Today\'s Entry')).toBeVisible();
    await expect(page.locator('.priority.positive')).toBeVisible();
    
    // Check recent entries
    await expect(page.locator('text=Recent Entries')).toBeVisible();
    
    // Check related tasks
    await expect(page.locator('text=Related Tasks & Projects')).toBeVisible();
    
    // Check note about interactive features
    await expect(page.locator('text=Full editor, tagging, and search available')).toBeVisible();
  });

  test('Review demo page shows weekly review', async ({ page }) => {
    await page.goto('/demo/review');
    
    // Check page loads
    await expect(page.locator('h1:has-text("Weekly Review (Read-only Demo)")')).toBeVisible();
    
    // Check period info
    await expect(page.locator('text=Period:')).toBeVisible();
    await expect(page.locator('text=Asia/Kolkata timezone')).toBeVisible();
    
    // Check sections
    await expect(page.locator('text=Completed This Week')).toBeVisible();
    await expect(page.locator('text=Carry-overs')).toBeVisible();
    await expect(page.locator('text=Highlights')).toBeVisible();
    await expect(page.locator('text=Auto-summary')).toBeVisible();
    await expect(page.locator('text=Plan Next Week')).toBeVisible();
    
    // Check note about interactive features
    await expect(page.locator('text=Full review templates, goal setting, and automated scheduling')).toBeVisible();
  });

  test('Agenda demo page shows week schedule', async ({ page }) => {
    await page.goto('/demo/agenda');
    
    // Check page loads
    await expect(page.locator('h1:has-text("Week Agenda (Read-only Demo)")')).toBeVisible();
    
    // Check week info
    await expect(page.locator('text=Week:')).toBeVisible();
    await expect(page.locator('text=Asia/Kolkata timezone')).toBeVisible();
    
    // Check navigation
    await expect(page.locator('a:has-text("Previous Week")')).toBeVisible();
    await expect(page.locator('a:has-text("This Week")')).toBeVisible();
    await expect(page.locator('a:has-text("Next Week")')).toBeVisible();
    
    // Check weekly schedule
    await expect(page.locator('text=Weekly Schedule')).toBeVisible();
    await expect(page.locator('text=Monday')).toBeVisible();
    
    // Check week summary
    await expect(page.locator('text=Week Summary')).toBeVisible();
    await expect(page.locator('.stat-number')).toHaveCount(4);
    
    // Check note about interactive features
    await expect(page.locator('text=Drag on calendar and time-boxing available')).toBeVisible();
  });

  test('Settings demo page shows workspace settings', async ({ page }) => {
    await page.goto('/demo/settings');
    
    // Check page loads
    await expect(page.locator('h1:has-text("Settings (Read-only Demo)")')).toBeVisible();
    
    // Check workspace preferences
    await expect(page.locator('text=Workspace Preferences')).toBeVisible();
    await expect(page.locator('text=Timezone')).toBeVisible();
    await expect(page.locator('text=Asia/Kolkata')).toBeVisible();
    
    // Check subscription summary
    await expect(page.locator('text=Subscription Summary')).toBeVisible();
    await expect(page.locator('text=Current Plan')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    
    // Check privacy & data
    await expect(page.locator('text=Privacy & Data')).toBeVisible();
    await expect(page.locator('text=CSV Export')).toBeVisible();
    await expect(page.locator('text=Account Deletion')).toBeVisible();
    
    // Check appearance & accessibility
    await expect(page.locator('text=Appearance & Accessibility')).toBeVisible();
    await expect(page.locator('text=Dark Mode')).toBeVisible();
    await expect(page.locator('text=Keyboard Navigation')).toBeVisible();
    
    // Check advanced settings
    await expect(page.locator('text=Advanced Settings')).toBeVisible();
    await expect(page.locator('text=Notifications')).toBeVisible();
    await expect(page.locator('text=Integrations')).toBeVisible();
  });

  test('All demo pages have proper SEO meta tags', async ({ page }) => {
    const pages = [
      { url: '/demo', title: 'Demo Overview - FlowState Demo' },
      { url: '/demo/tasks', title: 'Tasks Demo - FlowState Demo' },
      { url: '/demo/habits', title: 'Habits Demo - FlowState Demo' },
      { url: '/demo/journal', title: 'Journal Demo - FlowState Demo' },
      { url: '/demo/review', title: 'Review Demo - FlowState Demo' },
      { url: '/demo/agenda', title: 'Week Agenda Demo - FlowState Demo' },
      { url: '/demo/settings', title: 'Settings Demo - FlowState Demo' }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      
      // Check title
      await expect(page.locator('title')).toContainText(pageInfo.title);
      
      // Check meta description
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content');
      
      // Check robots meta
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
      
      // Check Open Graph tags
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://theflowstateapp.com/og-image.svg');
      
      // Check Twitter Card tags
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content');
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content');
    }
  });

  test('All demo pages have proper caching headers', async ({ request }) => {
    const pages = ['/demo', '/demo/tasks', '/demo/habits', '/demo/journal', '/demo/review', '/demo/agenda', '/demo/settings'];

    for (const pageUrl of pages) {
      const response = await request.get(pageUrl);
      
      // Check status
      expect(response.status()).toBe(200);
      
      // Check content type
      expect(response.headers()['content-type']).toContain('text/html');
      
      // Check caching headers
      expect(response.headers()['cache-control']).toContain('public, max-age=300');
      expect(response.headers()['x-robots-tag']).toBe('index,follow');
      expect(response.headers()['access-control-allow-origin']).toBe('*');
    }
  });

  test('Demo pages are accessible', async ({ page }) => {
    await page.goto('/demo');
    
    // Check semantic HTML structure
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check heading hierarchy
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h2')).toHaveCount.greaterThan(0);
    await expect(page.locator('h3')).toHaveCount.greaterThan(0);
    
    // Check navigation
    await expect(page.locator('nav, header')).toBeVisible();
    
    // Check links have proper href attributes
    const links = await page.locator('a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('Demo pages load fast', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/demo');
    const endTime = Date.now();
    
    // Should load within 3 seconds
    expect(endTime - startTime).toBeLessThan(3000);
    
    // Check page is interactive
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Navigation between demo pages works', async ({ page }) => {
    await page.goto('/demo');
    
    // Navigate to tasks
    await page.click('a[href="/demo/tasks"]');
    await expect(page.locator('h1:has-text("Tasks (Read-only Demo)")')).toBeVisible();
    
    // Navigate to habits
    await page.click('a[href="/demo/habits"]');
    await expect(page.locator('h1:has-text("Habits (Read-only Demo)")')).toBeVisible();
    
    // Navigate back to overview
    await page.click('a[href="/demo"]');
    await expect(page.locator('h1:has-text("Demo Overview")')).toBeVisible();
  });

  test('Interactive demo links work', async ({ page }) => {
    await page.goto('/demo');
    
    // Check interactive demo link
    const interactiveLink = page.locator('a[href="/api/demo/access"]');
    await expect(interactiveLink).toBeVisible();
    
    // Check static preview link
    const staticLink = page.locator('a[href="/api/demo/static"]');
    await expect(staticLink).toBeVisible();
    
    // Verify links have proper UTM parameters
    const interactiveHref = await interactiveLink.getAttribute('href');
    expect(interactiveHref).toContain('utm_source=demo-overview');
  });
});
