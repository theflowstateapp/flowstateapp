const { test, expect } = require('@playwright/test');

test('New Task Debug Test - Enhanced', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:3000/demo');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Look for "New task" button in the sidebar
  const newTaskButton = page.getByRole('button', { name: 'New task' });
  console.log('New task button found:', await newTaskButton.count());
  
  if (await newTaskButton.count() > 0) {
    console.log('Clicking New task button...');
    await newTaskButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    
    console.log('URL after click:', page.url());
    
    // Get the full page content
    const pageContent = await page.content();
    console.log('Page content length:', pageContent.length);
    console.log('Page content preview:', pageContent.substring(0, 500));
    
    // Check for React error boundaries or error messages
    const errorElements = page.locator('[class*="error"], [class*="Error"], .error, .Error, [data-testid*="error"]');
    const errorCount = await errorElements.count();
    console.log('Error elements found:', errorCount);
    
    if (errorCount > 0) {
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorElements.nth(i).textContent();
        console.log(`Error ${i + 1}:`, errorText);
      }
    }
    
    // Check for any text content on the page
    const bodyText = await page.locator('body').textContent();
    console.log('Body text preview:', bodyText?.substring(0, 200));
    
    // Check if the page is blank or has content
    const hasContent = await page.locator('body').textContent();
    console.log('Page has content:', hasContent && hasContent.trim().length > 0);
    
    // Check for specific elements that should be in NewTaskForm
    const createTaskHeading = page.getByRole('heading', { name: 'Create New Task' });
    const analyzeButton = page.getByRole('button', { name: 'Analyze Task' });
    const textarea = page.getByRole('textbox');
    
    console.log('Create Task heading found:', await createTaskHeading.count());
    console.log('Analyze button found:', await analyzeButton.count());
    console.log('Textarea found:', await textarea.count());
  } else {
    console.log('New task button not found');
  }
});
