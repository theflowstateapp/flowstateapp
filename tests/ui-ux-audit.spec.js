const { test, expect } = require('@playwright/test');

test.describe('UI/UX Comprehensive Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and wait for it to load
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Landing page and navigation', async ({ page }) => {
    // Check landing page elements
    await expect(page.getByRole('heading', { name: 'Life OS Platform' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Free Trial' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    
    // Test Try Demo navigation
    await page.getByRole('link', { name: 'Try Demo' }).click();
    await page.waitForURL('**/demo/**');
    
    // Check if we're properly authenticated/redirected
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('Sidebar functionality and layout', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3000/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check sidebar visibility
    const sidebar = page.locator('nav').first();
    await expect(sidebar).toBeVisible();
    
    // Check sidebar content doesn't get cut off
    const sidebarHeight = await sidebar.boundingBox();
    const viewportHeight = page.viewportSize().height;
    expect(sidebarHeight.height).toBeLessThan(viewportHeight);
    
    // Check all navigation items are visible
    const navItems = ['Dashboard', 'Quick Drop | Inbox', 'Tasks & Action View', 'Projects', 'Life Areas', 'Weekly Review', 'Habit Tracker', 'Workout Tracker', 'Meal Planner', 'Journal', 'Knowledge Base', 'Budgets & Subscriptions', 'My Calendars', 'Goal Setting & Yearly Planner', 'P.A.R.A Method', 'Perspectives', 'Portfolio Website', 'System'];
    
    for (const item of navItems) {
      const navLink = page.getByRole('link', { name: item });
      await expect(navLink).toBeVisible();
    }
  });

  test('Dashboard layout and functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check main content area
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
    
    // Check quick capture functionality
    const quickCaptureBtn = page.getByRole('button', { name: 'Quick Capture' });
    await expect(quickCaptureBtn).toBeVisible();
    
    // Test quick capture modal
    await quickCaptureBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
  });

  test('Modal positioning and z-index issues', async ({ page }) => {
    await page.goto('http://localhost:3000/app/projects');
    await page.waitForLoadState('networkidle');
    
    // Test add project modal
    await page.getByRole('button', { name: 'New Project' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Check modal positioning
    const modalBox = await modal.boundingBox();
    const viewportSize = page.viewportSize();
    
    // Modal should be visible and properly sized
    expect(modalBox.width).toBeGreaterThan(200);
    expect(modalBox.height).toBeGreaterThan(100);
    
    // Close modal
    await page.keyboard.press('Escape');
  });

  test('Form interactions and validation', async ({ page }) => {
    await page.goto('http://localhost:3000/app/habits');
    await page.waitForLoadState('networkidle');
    
    // Test add habit form
    await page.getByRole('button', { name: 'Add Habit' }).click();
    
    // Fill form with invalid data to test validation
    await page.getByLabel('Habit Title').fill('');
    await page.getByRole('button', { name: 'Add Habit' }).nth(1).click();
    
    // Should show validation error - modal should still be open
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Fill with valid data
    await page.getByLabel('Habit Title').fill('Test Habit');
    await page.getByLabel('Description').fill('Test Description');
    await page.getByRole('button', { name: 'Add Habit' }).nth(1).click();
    
    // Modal should close and show success message
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check mobile menu button
    const mobileMenuBtn = page.getByRole('button', { name: 'Toggle sidebar' });
    await expect(mobileMenuBtn).toBeVisible();
    
    // Open mobile menu
    await mobileMenuBtn.click();
    
    // Check mobile menu overlay
    const mobileMenu = page.locator('.mobile-menu, .sidebar-mobile');
    await expect(mobileMenu).toBeVisible();
    
    // Close mobile menu
    await page.keyboard.press('Escape');
  });

  test('Data visualization and charts', async ({ page }) => {
    await page.goto('http://localhost:3000/app/finance');
    await page.waitForLoadState('networkidle');
    
    // Check for progress bars and charts
    const progressBars = page.locator('[class*="progress"], [class*="chart"]');
    await expect(progressBars.first()).toBeVisible();
    
    // Check metric cards
    const metricCards = page.locator('[class*="metric"], [class*="card"]');
    await expect(metricCards.first()).toBeVisible();
  });

  test('Page-specific functionality - Projects', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');
    
    // Test project CRUD operations
    await page.getByRole('button', { name: 'New Project' }).click();
    
    // Fill project form
    await page.getByLabel('Project Title').fill('Test Project');
    await page.getByLabel('Description').fill('Test Description');
    await page.getByRole('button', { name: 'Add Project' }).click();
    
    // Check if project was added
    await expect(page.getByText('Test Project')).toBeVisible();
    
    // Test edit functionality
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Test delete functionality
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Delete' }).first().click();
    
    // Should show confirmation dialog
    await expect(page.getByText('Are you sure')).toBeVisible();
  });

  test('Page-specific functionality - Meals', async ({ page }) => {
    await page.goto('http://localhost:3000/meals');
    await page.waitForLoadState('networkidle');
    
    // Test meal form
    await page.getByRole('button', { name: 'Add Meal' }).click();
    
    // Check form fields
    await expect(page.getByLabel('Meal Name')).toBeVisible();
    await expect(page.getByLabel('Calories')).toBeVisible();
    
    // Fill form
    await page.getByLabel('Meal Name').fill('Test Meal');
    await page.getByLabel('Calories').fill('500');
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Check if meal was added
    await expect(page.getByText('Test Meal')).toBeVisible();
  });

  test('AI capture functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/app/inbox');
    await page.waitForLoadState('networkidle');
    
    // Test AI capture button
    const aiCaptureBtn = page.getByRole('button', { name: /AI Capture|Voice|Natural Language/ });
    if (await aiCaptureBtn.isVisible()) {
      await aiCaptureBtn.click();
      
      // Check AI capture interface
      await expect(page.getByText(/speak|voice|natural language/i)).toBeVisible();
    }
  });

  test('Quick capture from anywhere', async ({ page }) => {
    await page.goto('http://localhost:3000/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test global quick capture (keyboard shortcut)
    await page.keyboard.press('Control+n');
    
    // Should open quick capture modal
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
  });

  test('Error handling and loading states', async ({ page }) => {
    await page.goto('http://localhost:3000/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for loading indicators
    const loadingIndicators = page.locator('[class*="loading"], [class*="spinner"]');
    
    // Should not have loading indicators after page load
    await expect(loadingIndicators.first()).not.toBeVisible();
    
    // Test error handling by triggering an error
    await page.evaluate(() => {
      // Simulate an error
      throw new Error('Test error');
    });
    
    // Should show error message
    await expect(page.getByText(/error|something went wrong/i)).toBeVisible();
  });

  test('Accessibility and keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/app/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test escape key closes modals
    await page.getByRole('button', { name: /Quick Capture|Add Item/ }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Performance and responsiveness', async ({ page }) => {
    await page.goto('http://localhost:3000/app/dashboard');
    
    // Measure page load time
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Test smooth scrolling
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Should scroll smoothly without errors
    await page.waitForTimeout(1000);
  });
});
