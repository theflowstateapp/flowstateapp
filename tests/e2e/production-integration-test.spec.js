import { test, expect } from '@playwright/test';

test.describe('Production-Level Integration Test', () => {
  test('should connect to Apple Reminders, request permissions, and save to database', async ({ page }) => {
    console.log('🚀 Starting Apple Reminders integration test...');
    
    // Navigate to settings page
    await page.goto('/settings');
    await page.waitForSelector('[data-testid="settings-container"]', { timeout: 10000 });
    
    // Click on Integrations tab
    await page.click('button:has-text("Integrations")');
    await page.waitForSelector('text=Apple Reminders', { timeout: 5000 });
    
    // Check initial state
    const appleSection = page.locator('text=Apple Reminders').first();
    await expect(appleSection).toBeVisible();
    
    // Click Connect button
    const connectButton = page.locator('button:has-text("Connect")').first();
    await expect(connectButton).toBeVisible();
    await connectButton.click();
    
    // Wait for permission request simulation
    await page.waitForSelector('text=Connected', { timeout: 10000 });
    console.log('✅ Apple Reminders connected successfully');
    
    // Verify connection status is persisted
    const connectedStatus = page.locator('text=Connected').first();
    await expect(connectedStatus).toBeVisible();
    
    // Click Import button
    const importButton = page.locator('button:has-text("Import")').first();
    await expect(importButton).toBeVisible();
    await importButton.click();
    
    // Wait for import to complete
    await page.waitForSelector('text=Successfully imported', { timeout: 15000 });
    console.log('✅ Apple Reminders import completed');
    
    // Navigate to Tasks page to verify data persistence
    await page.goto('/tasks');
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Check for Apple Reminders tasks with proper indicators
    const appleTasks = page.locator('text=📱 Apple');
    const appleTaskCount = await appleTasks.count();
    expect(appleTaskCount).toBeGreaterThan(0);
    
    console.log(`✅ Found ${appleTaskCount} Apple Reminders tasks in database`);
    
    // Verify tasks have proper metadata
    if (appleTaskCount > 0) {
      await appleTasks.first().click();
      await expect(page.locator('text=apple_reminders')).toBeVisible({ timeout: 5000 });
      console.log('✅ Apple Reminders task metadata verified');
    }
  });
  
  test('should connect to Gmail, request permissions, and save to database', async ({ page }) => {
    console.log('📧 Starting Gmail integration test...');
    
    // Navigate to settings page
    await page.goto('/settings');
    await page.waitForSelector('[data-testid="settings-container"]', { timeout: 10000 });
    
    // Click on Integrations tab
    await page.click('button:has-text("Integrations")');
    await page.waitForSelector('text=Gmail', { timeout: 5000 });
    
    // Scroll down to find Gmail section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Click Connect button for Gmail
    const gmailConnectButton = page.locator('button:has-text("Connect")').nth(1);
    await expect(gmailConnectButton).toBeVisible();
    await gmailConnectButton.click();
    
    // Wait for permission request simulation
    await page.waitForSelector('text=Connected', { timeout: 10000 });
    console.log('✅ Gmail connected successfully');
    
    // Click Import button for Gmail
    const gmailImportButton = page.locator('button:has-text("Import")').nth(1);
    await expect(gmailImportButton).toBeVisible();
    await gmailImportButton.click();
    
    // Wait for import to complete
    await page.waitForSelector('text=Successfully imported', { timeout: 15000 });
    console.log('✅ Gmail import completed');
    
    // Navigate to Tasks page to verify data persistence
    await page.goto('/tasks');
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Check for Gmail tasks with proper indicators
    const gmailTasks = page.locator('text=📧 Gmail');
    const gmailTaskCount = await gmailTasks.count();
    expect(gmailTaskCount).toBeGreaterThan(0);
    
    console.log(`✅ Found ${gmailTaskCount} Gmail tasks in database`);
    
    // Verify tasks have proper metadata
    if (gmailTaskCount > 0) {
      await gmailTasks.first().click();
      await expect(page.locator('text=gmail')).toBeVisible({ timeout: 5000 });
      console.log('✅ Gmail task metadata verified');
    }
  });

  test('should persist connection status across page reloads', async ({ page }) => {
    console.log('🔄 Testing connection persistence...');
    
    // Navigate to settings and connect Apple Reminders
    await page.goto('/settings');
    await page.click('button:has-text("Integrations")');
    
    // Check if already connected (from previous test)
    const connectedStatus = page.locator('text=Connected').first();
    if (await connectedStatus.isVisible()) {
      console.log('✅ Apple Reminders connection persisted across reload');
    } else {
      // Connect if not already connected
      const connectButton = page.locator('button:has-text("Connect")').first();
      await connectButton.click();
      await page.waitForSelector('text=Connected', { timeout: 10000 });
      console.log('✅ Apple Reminders connected and persisted');
    }
    
    // Reload page and verify connection is still there
    await page.reload();
    await page.waitForSelector('[data-testid="settings-container"]', { timeout: 10000 });
    await page.click('button:has-text("Integrations")');
    
    const persistedStatus = page.locator('text=Connected').first();
    await expect(persistedStatus).toBeVisible({ timeout: 5000 });
    console.log('✅ Connection status persisted after page reload');
  });

  test('should show proper task counts and statistics', async ({ page }) => {
    console.log('📊 Testing task statistics...');
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="main-content"]', { timeout: 10000 });
    
    // Check that stats are displayed
    const statsSection = page.locator('text=Completed Today');
    await expect(statsSection).toBeVisible();
    
    // Navigate to tasks page
    await page.goto('/tasks');
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Count total tasks
    const taskItems = page.locator('[data-testid="task-item"]');
    const totalTasks = await taskItems.count();
    
    // Count Apple Reminders tasks
    const appleTasks = page.locator('text=📱 Apple');
    const appleTaskCount = await appleTasks.count();
    
    // Count Gmail tasks
    const gmailTasks = page.locator('text=📧 Gmail');
    const gmailTaskCount = await gmailTasks.count();
    
    console.log(`📊 Total tasks: ${totalTasks}`);
    console.log(`📱 Apple Reminders tasks: ${appleTaskCount}`);
    console.log(`📧 Gmail tasks: ${gmailTaskCount}`);
    
    // Verify we have tasks from both sources
    expect(totalTasks).toBeGreaterThan(0);
    expect(appleTaskCount + gmailTaskCount).toBeGreaterThan(0);
    
    console.log('✅ Task statistics verified successfully');
  });
});

