const { test, expect } = require('@playwright/test');

test('Advanced Dashboard Features Test', async ({ page }) => {
  // Navigate to the dashboard
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  
  // Test Daily Briefing
  await expect(page.locator('text=Good morning')).toBeVisible();
  await expect(page.locator('text=Completed Today')).toBeVisible();
  await expect(page.locator('text=Due Today')).toBeVisible();
  
  // Test Command Center
  await expect(page.locator('text=Command Center')).toBeVisible();
  await expect(page.locator('text=Quick Stats')).toBeVisible();
  await expect(page.locator('text=Today\'s Focus')).toBeVisible();
  
  // Test Insights Preview
  await expect(page.locator('text=Projects & Areas')).toBeVisible();
  await expect(page.locator('text=Calendar')).toBeVisible();
  await expect(page.locator('text=Health & Wellness')).toBeVisible();
  
  console.log('✅ Dashboard features verified successfully!');
});

test('Smart Notifications Test', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  
  // Click on notification bell
  await page.click('[data-testid="notification-bell"]');
  
  // Check if notification panel opens
  await expect(page.locator('text=Notifications')).toBeVisible();
  
  // Check for notification filters
  await expect(page.locator('select')).toBeVisible();
  
  console.log('✅ Notifications system verified!');
});

test('Advanced Calendar Test', async ({ page }) => {
  await page.goto('http://localhost:3000/calendar');
  await page.waitForLoadState('networkidle');
  
  // Check calendar header
  await expect(page.locator('text=Calendar')).toBeVisible();
  await expect(page.locator('text=Actionable Tasks')).toBeVisible();
  
  // Check for drag and drop functionality
  await expect(page.locator('[draggable="true"]')).toBeVisible();
  
  // Check for search and filter
  await expect(page.locator('input[placeholder="Search tasks..."]')).toBeVisible();
  await expect(page.locator('select')).toBeVisible();
  
  console.log('✅ Advanced Calendar verified!');
});

test('Customizable Dashboard Test', async ({ page }) => {
  await page.goto('http://localhost:3000/customizable-dashboard');
  await page.waitForLoadState('networkidle');
  
  // Check dashboard header
  await expect(page.locator('text=Customizable Dashboard')).toBeVisible();
  
  // Check theme selector
  await expect(page.locator('text=Light')).toBeVisible();
  await expect(page.locator('text=Dark')).toBeVisible();
  
  // Check customize button
  await expect(page.locator('text=Customize')).toBeVisible();
  
  // Click customize button
  await page.click('text=Customize');
  
  // Check if widget panel opens
  await expect(page.locator('text=Add Widgets')).toBeVisible();
  
  console.log('✅ Customizable Dashboard verified!');
});

test('Sidebar Cleanup Test', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  
  // Check that sidebar footer is removed
  await expect(page.locator('text=System Active')).not.toBeVisible();
  await expect(page.locator('text=Settings').last()).not.toBeVisible();
  
  // Check that Custom Dashboard is in sidebar
  await expect(page.locator('text=Custom Dashboard')).toBeVisible();
  
  console.log('✅ Sidebar cleanup verified!');
});

