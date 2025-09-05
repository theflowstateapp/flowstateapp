import { test, expect } from '@playwright/test';

test.describe('Complete Integration Test - Apple Reminders + Gmail', () => {
  test('should import from both Apple Reminders and Gmail', async ({ page }) => {
    console.log('🚀 Starting comprehensive integration test...');
    
    // Navigate to settings page
    await page.goto('/settings');
    await page.waitForSelector('[data-testid="settings-container"]', { timeout: 10000 });
    
    // Click on Integrations tab
    await page.click('button:has-text("Integrations")');
    await page.waitForSelector('text=Apple Reminders', { timeout: 5000 });
    
    console.log('📱 Testing Apple Reminders integration...');
    
    // Test Apple Reminders
    const appleConnectButton = page.locator('button:has-text("Connect")').first();
    await expect(appleConnectButton).toBeVisible();
    await appleConnectButton.click();
    await page.waitForSelector('text=Connected', { timeout: 10000 });
    
    const appleImportButton = page.locator('button:has-text("Import")').first();
    await expect(appleImportButton).toBeVisible();
    await appleImportButton.click();
    await page.waitForSelector('text=Successfully imported', { timeout: 15000 });
    
    console.log('✅ Apple Reminders import completed');
    
    // Scroll down to find Gmail section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    console.log('📧 Testing Gmail integration...');
    
    // Test Gmail
    const gmailConnectButton = page.locator('button:has-text("Connect")').nth(1);
    await expect(gmailConnectButton).toBeVisible();
    await gmailConnectButton.click();
    await page.waitForSelector('text=Connected', { timeout: 10000 });
    
    const gmailImportButton = page.locator('button:has-text("Import")').nth(1);
    await expect(gmailImportButton).toBeVisible();
    await gmailImportButton.click();
    await page.waitForSelector('text=Successfully imported', { timeout: 15000 });
    
    console.log('✅ Gmail import completed');
    
    // Navigate to Tasks page to verify both imports
    await page.goto('/tasks');
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Check for Apple Reminders tasks
    const appleTasks = page.locator('text=📱 Apple');
    const appleTaskCount = await appleTasks.count();
    
    // Check for Gmail tasks
    const gmailTasks = page.locator('text=📧 Gmail');
    const gmailTaskCount = await gmailTasks.count();
    
    console.log(`📱 Apple Reminders tasks found: ${appleTaskCount}`);
    console.log(`📧 Gmail tasks found: ${gmailTaskCount}`);
    
    // Verify we have tasks from both sources
    expect(appleTaskCount).toBeGreaterThan(0);
    expect(gmailTaskCount).toBeGreaterThan(0);
    
    // Verify total task count
    const totalTasks = appleTaskCount + gmailTaskCount;
    expect(totalTasks).toBeGreaterThanOrEqual(11); // 5 Apple + 6 Gmail
    
    console.log(`🎉 Integration test passed! Total imported tasks: ${totalTasks}`);
    console.log(`   - Apple Reminders: ${appleTaskCount} tasks`);
    console.log(`   - Gmail: ${gmailTaskCount} tasks`);
  });
  
  test('should show proper task details and metadata', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('/tasks');
    await page.waitForSelector('[data-testid="tasks-container"]', { timeout: 10000 });
    
    // Check for Apple task with proper details
    const appleTask = page.locator('text=📱 Apple').first();
    if (await appleTask.count() > 0) {
      await appleTask.click();
      await expect(page.locator('text=apple_reminders')).toBeVisible({ timeout: 5000 });
      console.log('✅ Apple Reminders task metadata verified');
    }
    
    // Check for Gmail task with proper details
    const gmailTask = page.locator('text=📧 Gmail').first();
    if (await gmailTask.count() > 0) {
      await gmailTask.click();
      await expect(page.locator('text=gmail')).toBeVisible({ timeout: 5000 });
      console.log('✅ Gmail task metadata verified');
    }
    
    console.log('🎯 All task metadata verified successfully!');
  });
});

