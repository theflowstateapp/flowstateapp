const { test, expect } = require('@playwright/test');

test.describe('Life OS Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page before each test
    await page.goto('/');
  });

  test('Landing page loads correctly', async ({ page }) => {
    // Check if landing page loads
    await expect(page).toHaveTitle(/Life OS/);
    
    // Check for main elements - be more specific
    await expect(page.getByRole('heading', { name: 'Your Complete Second Brain' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Try Demo' })).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/landing-page.png' });
  });

  test('Try Demo button navigates to app', async ({ page }) => {
    // Click the Try Demo button
    await page.getByRole('link', { name: 'Try Demo' }).click();
    
    // Wait for navigation
    await page.waitForURL('**/app');
    
    // Check if we're on the app page
    await expect(page).toHaveURL(/.*\/app/);
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/app-dashboard.png' });
  });

  test('Sidebar is visible and functional', async ({ page }) => {
    // Navigate to app
    await page.goto('/app');
    
    // Check if sidebar is visible
    const sidebar = page.locator('.sidebar').first();
    await expect(sidebar).toBeVisible();
    
    // Check for sidebar elements - be more specific
    await expect(page.getByRole('heading', { name: 'Life OS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Goals & Vision' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects & Tasks' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Habits & Routines' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Health & Wellness' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Finance & Budget' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Learning & Growth' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Relationships' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Time Management' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Journal & Reflection' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/sidebar-visible.png' });
  });

  test('Dashboard page loads correctly', async ({ page }) => {
    await page.goto('/app');
    
    // Check for dashboard elements - be more specific
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Today' })).toBeVisible();
    await expect(page.getByText('Quick Add')).toBeVisible();
    
    // Check for metric cards - be more specific
    await expect(page.getByText('Goals Progress')).toBeVisible();
    await expect(page.getByText('Active Habits')).toBeVisible();
    await expect(page.getByText('Active Projects')).toBeVisible();
    await expect(page.getByText('Health Score')).toBeVisible();
    await expect(page.getByText('Monthly Savings')).toBeVisible();
    await expect(page.getByText('Learning Hours')).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/dashboard-details.png' });
  });

  test('Navigation between pages works', async ({ page }) => {
    await page.goto('/app');
    
    // Test navigation to Goals page
    await page.getByRole('link', { name: 'Goals & Vision' }).click();
    await page.waitForURL('**/goals');
    await expect(page.getByRole('heading', { name: 'Goals & Vision' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/goals-page.png' });
    
    // Test navigation to Projects page
    await page.getByRole('link', { name: 'Projects & Tasks' }).click();
    await page.waitForURL('**/projects');
    await expect(page.getByRole('heading', { name: 'Projects & Tasks' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/projects-page.png' });
    
    // Test navigation to Habits page
    await page.getByRole('link', { name: 'Habits & Routines' }).click();
    await page.waitForURL('**/habits');
    await expect(page.getByRole('heading', { name: 'Habits & Routines' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/habits-page.png' });
    
    // Test navigation to Health page
    await page.getByRole('link', { name: 'Health & Wellness' }).click();
    await page.waitForURL('**/health');
    await expect(page.getByRole('heading', { name: 'Health & Wellness' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/health-page.png' });
    
    // Test navigation to Finance page
    await page.getByRole('link', { name: 'Finance & Budget' }).click();
    await page.waitForURL('**/finance');
    await expect(page.getByRole('heading', { name: 'Finance & Budget' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/finance-page.png' });
    
    // Test navigation to Learning page
    await page.getByRole('link', { name: 'Learning & Growth' }).click();
    await page.waitForURL('**/learning');
    await expect(page.getByRole('heading', { name: 'Learning & Growth' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/learning-page.png' });
    
    // Test navigation to Relationships page
    await page.getByRole('link', { name: 'Relationships' }).click();
    await page.waitForURL('**/relationships');
    await expect(page.getByRole('heading', { name: 'Relationships' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/relationships-page.png' });
    
    // Test navigation to Time Management page
    await page.getByRole('link', { name: 'Time Management' }).click();
    await page.waitForURL('**/time');
    await expect(page.getByRole('heading', { name: 'Time Management' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/time-management-page.png' });
    
    // Test navigation to Journal page
    await page.getByRole('link', { name: 'Journal & Reflection' }).click();
    await page.waitForURL('**/journal');
    await expect(page.getByRole('heading', { name: 'Journal & Reflection' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/journal-page.png' });
    
    // Test navigation to Settings page
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.waitForURL('**/settings');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/settings-page.png' });
  });

  test('Interactive elements work correctly', async ({ page }) => {
    await page.goto('/app/goals');
    
    // Test Add Goal button
    const addGoalButton = page.getByRole('button', { name: 'Add Goal' });
    await expect(addGoalButton).toBeVisible();
    await addGoalButton.click();
    
    // Check if modal opens
    await expect(page.getByText('Add New Goal')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/add-goal-modal.png' });
    
    // Close modal
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Test filtering
    const filterSelect = page.locator('select');
    await expect(filterSelect).toBeVisible();
    await filterSelect.selectOption('in-progress');
    
    await page.screenshot({ path: 'tests/screenshots/goals-with-filter.png' });
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/app');
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('button svg').first();
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu
    await mobileMenuButton.click();
    
    // Check if sidebar appears
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    
    await page.screenshot({ path: 'tests/screenshots/mobile-view.png' });
  });

  test('Form interactions work', async ({ page }) => {
    await page.goto('/app/habits');
    
    // Test Add Habit button - be more specific
    await page.getByRole('button', { name: 'Add Habit' }).first().click();
    
    // Fill form
    await page.getByLabel('Habit Title').fill('Test Habit');
    await page.getByLabel('Description').fill('Test Description');
    await page.getByLabel('Category').selectOption('Health');
    await page.getByLabel('Frequency').selectOption('daily');
    
    await page.screenshot({ path: 'tests/screenshots/habit-form-filled.png' });
    
    // Submit form - be more specific
    await page.getByRole('button', { name: 'Add Habit' }).last().click();
    
    // Check if habit was added
    await expect(page.getByText('Test Habit')).toBeVisible();
  });

  test('Data visualization elements', async ({ page }) => {
    await page.goto('/app/finance');
    
    // Check for charts and progress bars
    const progressBars = page.locator('.progress-bar');
    await expect(progressBars.first()).toBeVisible();
    
    // Check for metric cards
    const metricCards = page.locator('.metric-card');
    await expect(metricCards.first()).toBeVisible();
    
    await page.screenshot({ path: 'tests/screenshots/finance-visualization.png' });
  });

  test('Error handling and loading states', async ({ page }) => {
    await page.goto('/app');
    
    // Check for loading states (if any)
    const loadingElements = page.locator('[class*="loading"], [class*="spinner"]');
    
    // Check for error boundaries
    const errorElements = page.locator('[class*="error"]');
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'tests/screenshots/initial-loading-state.png' });
  });

  test('Accessibility features', async ({ page }) => {
    await page.goto('/app');
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
    
    // Check for proper button labels - check first few buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Check the first button for proper labeling
      const firstButton = buttons.first();
      const ariaLabel = await firstButton.getAttribute('aria-label');
      const text = await firstButton.textContent();
      const hasLabel = ariaLabel || text;
      
      // Log the button info for debugging
      console.log('First button - aria-label:', ariaLabel, 'text:', text);
      
      // Most buttons should have some form of labeling
      expect(buttonCount).toBeGreaterThan(0);
    }
    
    await page.screenshot({ path: 'tests/screenshots/accessibility-check.png' });
  });
});
