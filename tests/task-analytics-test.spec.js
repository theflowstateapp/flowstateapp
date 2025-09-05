const { test, expect } = require('@playwright/test');

test('Task Analytics System Test', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Create a few test tasks to generate analytics data
  const testTasks = [
    {
      title: "Urgent meeting with Sarah tomorrow at 2pm about the project",
      expectedType: "Meeting",
      expectedPriority: "Critical"
    },
    {
      title: "Workout at the gym - 30 minutes cardio and strength training",
      expectedType: "Task",
      expectedPriority: "High"
    },
    {
      title: "Pay electricity bill by Friday, amount $150",
      expectedType: "Task",
      expectedPriority: "High"
    }
  ];
  
  for (let i = 0; i < testTasks.length; i++) {
    const task = testTasks[i];
    console.log(`\n--- Creating Task ${i + 1}: ${task.title} ---`);
    
    // Find and fill the title input
    const titleInput = page.getByPlaceholder('What needs to be done?');
    if (await titleInput.count() > 0) {
      await titleInput.clear();
      await titleInput.fill(task.title);
      await page.waitForTimeout(1000);
      
      // Click AI analyze button
      const aiButton = page.locator('button').filter({ hasText: 'AI Analyze' });
      if (await aiButton.count() > 0) {
        await aiButton.click();
        await page.waitForTimeout(3000);
        
        // Fill required fields if needed
        const descriptionInput = page.locator('textarea').first();
        if (await descriptionInput.count() > 0) {
          await descriptionInput.fill(`Test task ${i + 1} for analytics`);
        }
        
        // Submit the form
        const submitButton = page.locator('button').filter({ hasText: 'Create Task' });
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(2000);
          
          // Navigate back to new task form
          await page.goto('http://localhost:3000/new-task');
          await page.waitForLoadState('networkidle');
        }
      }
    }
  }
  
  // Now navigate to the analytics dashboard
  console.log('\n--- Testing Analytics Dashboard ---');
  await page.goto('http://localhost:3000/task-analytics');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of the analytics dashboard
  await page.screenshot({ 
    path: 'tests/screenshots/task-analytics-dashboard.png',
    fullPage: true 
  });
  
  // Check if analytics elements are present
  const totalTasksElement = page.locator('div').filter({ hasText: 'Total Tasks' });
  const aiAccuracyElement = page.locator('div').filter({ hasText: 'AI Accuracy' });
  const aiAnalysesElement = page.locator('div').filter({ hasText: 'AI Analyses' });
  
  console.log('Total Tasks element found:', await totalTasksElement.count());
  console.log('AI Accuracy element found:', await aiAccuracyElement.count());
  console.log('AI Analyses element found:', await aiAnalysesElement.count());
  
  // Check if tabs are working
  const overviewTab = page.locator('button').filter({ hasText: 'Overview' });
  const productivityTab = page.locator('button').filter({ hasText: 'Productivity' });
  const aiInsightsTab = page.locator('button').filter({ hasText: 'AI Insights' });
  const recommendationsTab = page.locator('button').filter({ hasText: 'Recommendations' });
  
  console.log('Overview tab found:', await overviewTab.count());
  console.log('Productivity tab found:', await productivityTab.count());
  console.log('AI Insights tab found:', await aiInsightsTab.count());
  console.log('Recommendations tab found:', await recommendationsTab.count());
  
  // Test tab navigation
  if (await productivityTab.count() > 0) {
    await productivityTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/task-analytics-productivity.png',
      fullPage: true 
    });
  }
  
  if (await aiInsightsTab.count() > 0) {
    await aiInsightsTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/task-analytics-ai-insights.png',
      fullPage: true 
    });
  }
  
  if (await recommendationsTab.count() > 0) {
    await recommendationsTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/task-analytics-recommendations.png',
      fullPage: true 
    });
  }
  
  console.log('\n🎉 Task Analytics System Test Completed!');
});
