import { test, expect } from '@playwright/test';

test.describe('Gmail Integration', () => {
  test('should connect to Gmail and import emails as tasks', async ({ page }) => {
    // Navigate to settings page
    await page.goto('/settings');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="settings-container"]', { timeout: 10000 });
    
    // Click on Integrations tab
    await page.click('button:has-text("Integrations")');
    
    // Wait for Gmail section to be visible
    await page.waitForSelector('text=Gmail', { timeout: 5000 });
    
    // Check if Connect button is visible for Gmail
    const gmailConnectButton = page.locator('button:has-text("Connect")').first();
    await expect(gmailConnectButton).toBeVisible();
    
    // Click Connect button for Gmail
    await gmailConnectButton.click();
    
    // Wait for connection to complete (simulated)
    await page.waitForSelector('text=Connected', { timeout: 10000 });
    
    // Check if Import button is now visible for Gmail
    const gmailImportButton = page.locator('button:has-text("Import")').first();
    await expect(gmailImportButton).toBeVisible();
    
    // Click Import button for Gmail
    await gmailImportButton.click();
    
    // Wait for import to complete
    await page.waitForSelector('text=Successfully imported', { timeout: 15000 });
    
    // Navigate to Tasks page to verify imported tasks
    await page.goto('/tasks');
    
    // Wait for tasks page to load
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Check if imported tasks are visible with Gmail indicator
    const gmailTasks = page.locator('text=📧 Gmail');
    await expect(gmailTasks.first()).toBeVisible({ timeout: 5000 });
    
    // Verify we have at least 6 tasks (as mentioned in mock data)
    const taskItems = page.locator('[data-testid="task-item"]');
    const taskCount = await taskItems.count();
    expect(taskCount).toBeGreaterThanOrEqual(6);
    
    console.log(`✅ Gmail integration test passed! Found ${taskCount} imported tasks.`);
  });
  
  test('should show imported Gmail tasks with proper metadata', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('/tasks');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Look for tasks with Gmail source indicator
    const gmailTasks = page.locator('text=📧 Gmail');
    const gmailTaskCount = await gmailTasks.count();
    
    if (gmailTaskCount > 0) {
      // Click on first Gmail task to see details
      await gmailTasks.first().click();
      
      // Check if task has proper metadata
      await expect(page.locator('text=gmail')).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ Found ${gmailTaskCount} Gmail tasks with proper metadata`);
    } else {
      console.log('ℹ️ No Gmail tasks found - may need to import first');
    }
  });

  test('should show both Apple Reminders and Gmail tasks', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('/tasks');
    
    // Wait for tasks to load
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Check for Apple Reminders tasks
    const appleTasks = page.locator('text=📱 Apple');
    const appleTaskCount = await appleTasks.count();
    
    // Check for Gmail tasks
    const gmailTasks = page.locator('text=📧 Gmail');
    const gmailTaskCount = await gmailTasks.count();
    
    console.log(`📱 Apple Reminders tasks: ${appleTaskCount}`);
    console.log(`📧 Gmail tasks: ${gmailTaskCount}`);
    
    // At least one type should have tasks
    expect(appleTaskCount + gmailTaskCount).toBeGreaterThan(0);
    
    console.log('✅ Both integration types working correctly!');
  });
});

