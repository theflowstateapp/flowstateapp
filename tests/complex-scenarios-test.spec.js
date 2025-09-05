const { test, expect } = require('@playwright/test');

test('Complex Task Scenarios - Enhanced AI Analysis', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Complex test scenarios based on real-world usage
  const complexScenarios = [
    {
      name: "Urgent Business Meeting",
      input: "Urgent meeting with Sarah tomorrow at 2pm about the quarterly budget review project",
      expectedFields: ["Type", "Priority", "Due Date", "Reminder Time", "Assignee"]
    },
    {
      name: "Health & Fitness Task",
      input: "Workout at 9am today - 30 minutes cardio and strength training",
      expectedFields: ["Type", "Due Date", "Reminder Time", "Estimated Hours"]
    },
    {
      name: "Family Task",
      input: "Pick up kids from school at 3:30pm and take them to dentist appointment",
      expectedFields: ["Type", "Due Date", "Reminder Time", "Context"]
    },
    {
      name: "Financial Task",
      input: "Pay electricity bill by Friday, amount $150, urgent",
      expectedFields: ["Type", "Priority", "Due Date", "Context"]
    },
    {
      name: "Learning Task",
      input: "Study React hooks and TypeScript basics, estimated 4 hours, deadline next week",
      expectedFields: ["Type", "Due Date", "Estimated Hours", "Context"]
    },
    {
      name: "Work Project Task",
      input: "Bug fix for login page - critical issue blocking users, needs immediate attention, assign to John",
      expectedFields: ["Type", "Priority", "Assignee", "Context"]
    },
    {
      name: "Recurring Task",
      input: "Weekly team standup meeting every Monday at 9am, recurring task",
      expectedFields: ["Type", "Reminder Time", "Context"]
    },
    {
      name: "Creative Task",
      input: "Design new logo for marketing campaign, low priority, can wait until next sprint",
      expectedFields: ["Type", "Priority", "Context"]
    }
  ];
  
  for (let i = 0; i < complexScenarios.length; i++) {
    const scenario = complexScenarios[i];
    console.log(`\n--- Testing Scenario ${i + 1}: ${scenario.name} ---`);
    console.log(`Input: "${scenario.input}"`);
    
    // Find and fill the title input
    const titleInput = page.getByPlaceholder('What needs to be done?');
    if (await titleInput.count() > 0) {
      await titleInput.clear();
      await titleInput.fill(scenario.input);
      await page.waitForTimeout(1000);
      
      // Click AI analyze button
      const aiButton = page.locator('button').filter({ hasText: 'AI Analyze' });
      if (await aiButton.count() > 0) {
        await aiButton.click();
        await page.waitForTimeout(3000);
        
        // Check what fields were filled
        const typeSelect = page.locator('select').filter({ hasText: 'Type' });
        const prioritySelect = page.locator('select').filter({ hasText: 'Priority' });
        const projectSelect = page.locator('select').filter({ hasText: 'Project' });
        const contextSelect = page.locator('select').filter({ hasText: 'Context' });
        const startDateInput = page.locator('input[type="date"]').first();
        const dueDateInput = page.locator('input[type="date"]').nth(1);
        const estimatedHoursInput = page.locator('input[type="number"]').first();
        const reminderTimeInput = page.locator('input[type="time"]').first();
        const assigneeInput = page.locator('input[placeholder*="Who should do this task"]');
        
        // Get the values
        const typeValue = await typeSelect.count() > 0 ? await typeSelect.first().inputValue() : '';
        const priorityValue = await prioritySelect.count() > 0 ? await prioritySelect.first().inputValue() : '';
        const projectValue = await projectSelect.count() > 0 ? await projectSelect.first().inputValue() : '';
        const contextValue = await contextSelect.count() > 0 ? await contextSelect.first().inputValue() : '';
        const startDateValue = await startDateInput.count() > 0 ? await startDateInput.inputValue() : '';
        const dueDateValue = await dueDateInput.count() > 0 ? await dueDateInput.inputValue() : '';
        const estimatedHoursValue = await estimatedHoursInput.count() > 0 ? await estimatedHoursInput.inputValue() : '';
        const reminderTimeValue = await reminderTimeInput.count() > 0 ? await reminderTimeInput.inputValue() : '';
        const assigneeValue = await assigneeInput.count() > 0 ? await assigneeInput.inputValue() : '';
        
        // Check which fields were filled (not empty and not default values)
        const filledFields = [];
        if (typeValue && typeValue !== 'Task') filledFields.push('Type');
        if (priorityValue && priorityValue !== 'Medium') filledFields.push('Priority');
        if (projectValue) filledFields.push('Project');
        if (contextValue) filledFields.push('Context');
        if (startDateValue) filledFields.push('Start Date');
        if (dueDateValue) filledFields.push('Due Date');
        if (estimatedHoursValue) filledFields.push('Estimated Hours');
        if (reminderTimeValue) filledFields.push('Reminder Time');
        if (assigneeValue) filledFields.push('Assignee');
        
        console.log('Fields filled by AI:', filledFields);
        console.log('AI Analysis Score:', `${filledFields.length}/9 fields filled`);
        
        // Check against expected fields
        const expectedFieldsFound = scenario.expectedFields.filter(field => filledFields.includes(field));
        console.log('Expected fields found:', expectedFieldsFound);
        console.log('Expected fields accuracy:', `${expectedFieldsFound.length}/${scenario.expectedFields.length} (${Math.round(expectedFieldsFound.length / scenario.expectedFields.length * 100)}%)`);
        
        // Log specific values for debugging
        if (typeValue && typeValue !== 'Task') console.log('Type detected:', typeValue);
        if (priorityValue && priorityValue !== 'Medium') console.log('Priority detected:', priorityValue);
        if (contextValue) console.log('Context detected:', contextValue);
        if (dueDateValue) console.log('Due date detected:', dueDateValue);
        if (reminderTimeValue) console.log('Reminder time detected:', reminderTimeValue);
        if (estimatedHoursValue) console.log('Estimated hours detected:', estimatedHoursValue);
        if (assigneeValue) console.log('Assignee detected:', assigneeValue);
        
        console.log('---');
      }
    }
  }
  
  console.log('\n🎉 Complex scenario testing completed!');
});
