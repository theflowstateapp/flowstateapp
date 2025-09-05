const { test, expect } = require('@playwright/test');

test('Complex Task Scenarios - Comprehensive AI Analysis', async ({ page }) => {
  // Navigate to the new task page
  await page.goto('http://localhost:3000/new-task');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  
  // Complex test scenarios based on real-world usage patterns
  const complexScenarios = [
    {
      name: "Urgent Business Meeting",
      input: "Urgent meeting with Sarah tomorrow at 2pm about the quarterly budget review project",
      expectedFields: ["Type", "Priority", "Due Date", "Reminder Time", "Assignee", "Tags"],
      description: "High-priority business meeting with specific time and person"
    },
    {
      name: "Health & Fitness Task",
      input: "Workout at 9am today - 30 minutes cardio and strength training",
      expectedFields: ["Type", "Due Date", "Reminder Time", "Estimated Hours", "Context"],
      description: "Health-related task with specific time and duration"
    },
    {
      name: "Family Task",
      input: "Pick up kids from school at 3:30pm and take them to dentist appointment",
      expectedFields: ["Type", "Due Date", "Reminder Time", "Context"],
      description: "Family-related task with specific time and location"
    },
    {
      name: "Financial Task",
      input: "Pay electricity bill by Friday, amount $150, urgent",
      expectedFields: ["Type", "Priority", "Due Date", "Context"],
      description: "Financial task with deadline and urgency"
    },
    {
      name: "Learning Task",
      input: "Study React hooks and TypeScript basics, estimated 4 hours, deadline next week",
      expectedFields: ["Type", "Due Date", "Estimated Hours", "Context"],
      description: "Learning task with duration and deadline"
    },
    {
      name: "Work Project Task",
      input: "Bug fix for login page - critical issue blocking users, needs immediate attention, assign to John",
      expectedFields: ["Type", "Priority", "Assignee", "Context"],
      description: "Work-related bug fix with high priority and assignee"
    },
    {
      name: "Recurring Task",
      input: "Weekly team standup meeting every Monday at 9am, recurring task",
      expectedFields: ["Type", "Reminder Time", "Context"],
      description: "Recurring meeting with specific time"
    },
    {
      name: "Creative Task",
      input: "Design new logo for marketing campaign, low priority, can wait until next sprint",
      expectedFields: ["Type", "Priority", "Context"],
      description: "Creative task with low priority and flexible deadline"
    },
    {
      name: "Home Maintenance",
      input: "Fix leaky faucet in kitchen, needs to be done this weekend",
      expectedFields: ["Type", "Due Date", "Context"],
      description: "Home maintenance task with weekend deadline"
    },
    {
      name: "Social Task",
      input: "Call mom to wish her happy birthday, important personal call",
      expectedFields: ["Type", "Priority", "Context"],
      description: "Personal social task with emotional importance"
    }
  ];
  
  let totalAccuracy = 0;
  let totalScenarios = complexScenarios.length;
  
  for (let i = 0; i < complexScenarios.length; i++) {
    const scenario = complexScenarios[i];
    console.log(`\n--- Testing Scenario ${i + 1}: ${scenario.name} ---`);
    console.log(`Description: ${scenario.description}`);
    console.log(`Input: "${scenario.input}"`);
    console.log(`Expected Fields: ${scenario.expectedFields.join(', ')}`);
    
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
        const tagsInput = page.locator('input[placeholder*="Add custom tags"]');
        
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
        const tagsValue = await tagsInput.count() > 0 ? await tagsInput.inputValue() : '';
        
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
        if (tagsValue) filledFields.push('Tags');
        
        console.log('Fields filled by AI:', filledFields);
        console.log('AI Analysis Score:', `${filledFields.length}/10 fields filled`);
        
        // Check against expected fields
        const expectedFieldsFound = scenario.expectedFields.filter(field => filledFields.includes(field));
        const accuracy = expectedFieldsFound.length / scenario.expectedFields.length;
        totalAccuracy += accuracy;
        
        console.log('Expected fields found:', expectedFieldsFound);
        console.log('Expected fields accuracy:', `${expectedFieldsFound.length}/${scenario.expectedFields.length} (${Math.round(accuracy * 100)}%)`);
        
        // Log specific values for debugging
        if (typeValue && typeValue !== 'Task') console.log('Type detected:', typeValue);
        if (priorityValue && priorityValue !== 'Medium') console.log('Priority detected:', priorityValue);
        if (contextValue) console.log('Context detected:', contextValue);
        if (dueDateValue) console.log('Due date detected:', dueDateValue);
        if (reminderTimeValue) console.log('Reminder time detected:', reminderTimeValue);
        if (estimatedHoursValue) console.log('Estimated hours detected:', estimatedHoursValue);
        if (assigneeValue) console.log('Assignee detected:', assigneeValue);
        if (tagsValue) console.log('Tags detected:', tagsValue);
        
        console.log('---');
      }
    }
  }
  
  const overallAccuracy = totalAccuracy / totalScenarios;
  console.log(`\n🎉 Comprehensive scenario testing completed!`);
  console.log(`Overall AI Accuracy: ${Math.round(overallAccuracy * 100)}%`);
  console.log(`Total Scenarios Tested: ${totalScenarios}`);
  console.log(`Average Fields Detected: ${Math.round(overallAccuracy * 6)}/6 expected fields`);
  
  // Performance summary
  if (overallAccuracy >= 0.8) {
    console.log('✅ Excellent AI performance! Ready for production.');
  } else if (overallAccuracy >= 0.6) {
    console.log('✅ Good AI performance! Minor improvements needed.');
  } else {
    console.log('⚠️ AI performance needs improvement. Consider enhancing patterns.');
  }
});
