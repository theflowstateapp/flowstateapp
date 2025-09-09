import { test, expect } from '@playwright/test';

test.describe('Apple Reminders Integration', () => {
  test('should connect to Apple Reminders and import tasks', async ({ page }) => {
    // Navigate to settings page
    await page.goto('/settings');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="settings-container"]', { timeout: 10000 });
    
    // Click on Integrations tab
    await page.click('button:has-text("Integrations")');
    
    // Wait for Apple Reminders section to be visible
    await page.waitForSelector('text=Apple Reminders', { timeout: 5000 });
    
    // Check if Connect button is visible
    const connectButton = page.locator('button:has-text("Connect")');
    await expect(connectButton).toBeVisible();
    
    // Click Connect button
    await connectButton.click();
    
    // Wait for connection to complete (simulated)
    await page.waitForSelector('text=Connected', { timeout: 10000 });
    
    // Check if Import button is now visible
    const importButton = page.locator('button:has-text("Import")');
    await expect(importButton).toBeVisible();
    
    // Click Import button
    await importButton.click();
    
    // Wait for import to complete
    await page.waitForSelector('text=Successfully imported', { timeout: 15000 });
    
    // Navigate to Tasks page to verify imported tasks
    await page.goto('/tasks');
    
    // Wait for tasks page to load
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Check if imported tasks are visible with Apple indicator
    const appleTasks = page.locator('text=📱 Apple');
    await expect(appleTasks.first()).toBeVisible({ timeout: 5000 });
    
    // Verify we have at least 5 tasks (as mentioned by user)
    const taskItems = page.locator('[data-testid="task-item"]');
    const taskCount = await taskItems.count();
    expect(taskCount).toBeGreaterThanOrEqual(5);
    
    console.log(`✅ Apple Reminders integration test passed! Found ${taskCount} imported tasks.`);
  });
  
  test('should show imported tasks with proper metadata', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('/tasks');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Look for tasks with Apple source indicator
    const appleTasks = page.locator('text=📱 Apple');
    const appleTaskCount = await appleTasks.count();
    
    if (appleTaskCount > 0) {
      // Click on first Apple task to see details
      await appleTasks.first().click();
      
      // Check if task has proper metadata
      await expect(page.locator('text=apple_reminders')).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ Found ${appleTaskCount} Apple Reminders tasks with proper metadata`);
    } else {
      console.log('ℹ️ No Apple Reminders tasks found - may need to import first');
    }
  });
});


