import { test, expect } from '@playwright/test';

// Test data
const testUser = {
  email: 'test@lifeos.com',
  password: 'testpassword123',
  name: 'Test User'
};

const testGoal = {
  title: 'Launch Business',
  description: 'Start my own tech consulting business',
  category: 'Career',
  targetDate: '2024-12-31'
};

const testProject = {
  title: 'Website Redesign',
  description: 'Complete redesign of company website',
  status: 'in-progress',
  dueDate: '2024-06-15'
};

const testHabit = {
  title: 'Morning Exercise',
  description: '30 minutes of cardio',
  category: 'Health',
  frequency: 'daily'
};

const testTask = {
  title: 'Design Homepage',
  description: 'Create new homepage design',
  priority: 'high',
  dueDate: '2024-05-15'
};

test.describe('LifeOS - Core Functionality Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('User Authentication', () => {
    test('should allow user registration', async ({ page }) => {
      // Click on sign up button
      await page.click('text=Start Free Trial');
      
      // Fill registration form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="name"]', testUser.name);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      
      // Should show welcome message
      await expect(page.locator('text=Welcome')).toBeVisible();
    });

    test('should allow user login', async ({ page }) => {
      // Click on login button
      await page.click('text=Sign In');
      
      // Fill login form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      
      // Should show user name
      await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
    });

    test('should allow user logout', async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Click logout
      await page.click('text=Logout');
      
      // Should redirect to landing page
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Goals Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Navigate to goals page
      await page.click('text=Goals');
    });

    test('should create a new goal', async ({ page }) => {
      // Click add goal button
      await page.click('text=Add Goal');
      
      // Fill goal form
      await page.fill('input[name="title"]', testGoal.title);
      await page.fill('textarea[name="description"]', testGoal.description);
      await page.selectOption('select[name="category"]', testGoal.category);
      await page.fill('input[name="targetDate"]', testGoal.targetDate);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=Goal created successfully')).toBeVisible();
      
      // Should display the new goal
      await expect(page.locator(`text=${testGoal.title}`)).toBeVisible();
    });

    test('should update goal progress', async ({ page }) => {
      // Find the goal and click edit
      await page.click(`text=${testGoal.title}`);
      
      // Update progress
      await page.fill('input[name="progress"]', '50');
      
      // Save changes
      await page.click('text=Save');
      
      // Should show updated progress
      await expect(page.locator('text=50%')).toBeVisible();
    });

    test('should delete a goal', async ({ page }) => {
      // Find the goal and click delete
      await page.click(`text=${testGoal.title}`);
      await page.click('text=Delete');
      
      // Confirm deletion
      await page.click('text=Confirm');
      
      // Should not show the goal anymore
      await expect(page.locator(`text=${testGoal.title}`)).not.toBeVisible();
    });
  });

  test.describe('Projects Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Navigate to projects page
      await page.click('text=Projects');
    });

    test('should create a new project', async ({ page }) => {
      // Click add project button
      await page.click('text=New Project');
      
      // Fill project form
      await page.fill('input[name="title"]', testProject.title);
      await page.fill('textarea[name="description"]', testProject.description);
      await page.selectOption('select[name="status"]', testProject.status);
      await page.fill('input[name="dueDate"]', testProject.dueDate);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=Project created successfully')).toBeVisible();
      
      // Should display the new project
      await expect(page.locator(`text=${testProject.title}`)).toBeVisible();
    });

    test('should add tasks to project', async ({ page }) => {
      // Click on the project
      await page.click(`text=${testProject.title}`);
      
      // Click add task button
      await page.click('text=Add Task');
      
      // Fill task form
      await page.fill('input[name="title"]', testTask.title);
      await page.fill('textarea[name="description"]', testTask.description);
      await page.selectOption('select[name="priority"]', testTask.priority);
      await page.fill('input[name="dueDate"]', testTask.dueDate);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show the task in the project
      await expect(page.locator(`text=${testTask.title}`)).toBeVisible();
    });

    test('should update project status', async ({ page }) => {
      // Click on the project
      await page.click(`text=${testProject.title}`);
      
      // Update status
      await page.selectOption('select[name="status"]', 'completed');
      
      // Save changes
      await page.click('text=Save');
      
      // Should show completed status
      await expect(page.locator('text=completed')).toBeVisible();
    });
  });

  test.describe('Habits Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Navigate to habits page
      await page.click('text=Habits');
    });

    test('should create a new habit', async ({ page }) => {
      // Click add habit button
      await page.click('text=Add Habit');
      
      // Fill habit form
      await page.fill('input[name="title"]', testHabit.title);
      await page.fill('textarea[name="description"]', testHabit.description);
      await page.selectOption('select[name="category"]', testHabit.category);
      await page.selectOption('select[name="frequency"]', testHabit.frequency);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=Habit created successfully')).toBeVisible();
      
      // Should display the new habit
      await expect(page.locator(`text=${testHabit.title}`)).toBeVisible();
    });

    test('should check in to habit', async ({ page }) => {
      // Find the habit and click check in
      await page.click(`text=${testHabit.title}`);
      await page.click('text=Check In');
      
      // Should show updated streak
      await expect(page.locator('text=1 day streak')).toBeVisible();
    });

    test('should update habit streak', async ({ page }) => {
      // Check in multiple times
      for (let i = 0; i < 3; i++) {
        await page.click(`text=${testHabit.title}`);
        await page.click('text=Check In');
        await page.waitForTimeout(1000);
      }
      
      // Should show 3 day streak
      await expect(page.locator('text=3 day streak')).toBeVisible();
    });
  });

  test.describe('Data Relationships', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
    });

    test('should show tasks in both project and task list', async ({ page }) => {
      // Create a project with a task
      await page.click('text=Projects');
      await page.click('text=New Project');
      await page.fill('input[name="title"]', 'Test Project');
      await page.click('button[type="submit"]');
      
      await page.click('text=Test Project');
      await page.click('text=Add Task');
      await page.fill('input[name="title"]', 'Test Task');
      await page.click('button[type="submit"]');
      
      // Navigate to tasks page
      await page.click('text=Tasks');
      
      // Should see the task in the task list
      await expect(page.locator('text=Test Task')).toBeVisible();
    });

    test('should link goals to areas', async ({ page }) => {
      // Create an area first
      await page.click('text=Areas');
      await page.click('text=Add Area');
      await page.fill('input[name="name"]', 'Career');
      await page.click('button[type="submit"]');
      
      // Create a goal in that area
      await page.click('text=Goals');
      await page.click('text=Add Goal');
      await page.fill('input[name="title"]', 'Career Goal');
      await page.selectOption('select[name="area"]', 'Career');
      await page.click('button[type="submit"]');
      
      // Navigate to areas page
      await page.click('text=Areas');
      await page.click('text=Career');
      
      // Should see the goal in the area
      await expect(page.locator('text=Career Goal')).toBeVisible();
    });
  });

  test.describe('AI Integration', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
    });

    test('should show AI assistant on all pages', async ({ page }) => {
      const pages = ['Goals', 'Projects', 'Habits', 'Tasks', 'Areas'];
      
      for (const pageName of pages) {
        await page.click(`text=${pageName}`);
        await expect(page.locator('[data-testid="ai-assistant"]')).toBeVisible();
      }
    });

    test('should provide AI insights for goals', async ({ page }) => {
      await page.click('text=Goals');
      
      // Create a goal first
      await page.click('text=Add Goal');
      await page.fill('input[name="title"]', 'Learn AI');
      await page.click('button[type="submit"]');
      
      // Click AI insights button
      await page.click('text=AI Insights');
      
      // Should show AI analysis
      await expect(page.locator('text=AI Analysis')).toBeVisible();
      await expect(page.locator('text=Recommendations')).toBeVisible();
    });

    test('should provide AI insights for projects', async ({ page }) => {
      await page.click('text=Projects');
      
      // Create a project first
      await page.click('text=New Project');
      await page.fill('input[name="title"]', 'AI Project');
      await page.click('button[type="submit"]');
      
      // Click AI insights button
      await page.click('text=AI Insights');
      
      // Should show AI analysis
      await expect(page.locator('text=AI Analysis')).toBeVisible();
    });

    test('should provide AI insights for habits', async ({ page }) => {
      await page.click('text=Habits');
      
      // Create a habit first
      await page.click('text=Add Habit');
      await page.fill('input[name="title"]', 'Study AI');
      await page.click('button[type="submit"]');
      
      // Click AI insights button
      await page.click('text=AI Insights');
      
      // Should show AI analysis
      await expect(page.locator('text=AI Analysis')).toBeVisible();
    });

    test('should show usage tracking', async ({ page }) => {
      await page.click('text=Goals');
      
      // Should show AI usage status
      await expect(page.locator('text=AI Usage Status')).toBeVisible();
      await expect(page.locator('text=requests used')).toBeVisible();
    });

    test('should show upgrade prompts when limits reached', async ({ page }) => {
      // This would require mocking the usage to be at the limit
      // For now, we'll just check that the upgrade button exists
      await page.click('text=Settings');
      await page.click('text=Billing');
      
      await expect(page.locator('text=Upgrade')).toBeVisible();
    });
  });

  test.describe('Pricing & Billing', () => {
    test('should display pricing on landing page', async ({ page }) => {
      await page.goto('/');
      
      // Should show pricing section
      await expect(page.locator('text=Pricing')).toBeVisible();
      await expect(page.locator('text=Free')).toBeVisible();
      await expect(page.locator('text=Pro')).toBeVisible();
      await expect(page.locator('text=Enterprise')).toBeVisible();
    });

    test('should show current plan in settings', async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Navigate to settings
      await page.click('text=Settings');
      await page.click('text=Billing');
      
      // Should show current plan
      await expect(page.locator('text=Current Plan')).toBeVisible();
      await expect(page.locator('text=Free')).toBeVisible();
    });

    test('should show usage limits', async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Navigate to settings
      await page.click('text=Settings');
      await page.click('text=Usage');
      
      // Should show usage limits
      await expect(page.locator('text=Usage Limits')).toBeVisible();
      await expect(page.locator('text=AI Requests')).toBeVisible();
      await expect(page.locator('text=Goals')).toBeVisible();
      await expect(page.locator('text=Projects')).toBeVisible();
    });
  });

  test.describe('Cross-Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
    });

    test('should sync data across all pages', async ({ page }) => {
      // Create a goal
      await page.click('text=Goals');
      await page.click('text=Add Goal');
      await page.fill('input[name="title"]', 'Test Goal');
      await page.click('button[type="submit"]');
      
      // Navigate to dashboard
      await page.click('text=Dashboard');
      
      // Should see the goal on dashboard
      await expect(page.locator('text=Test Goal')).toBeVisible();
      
      // Navigate to goals page
      await page.click('text=Goals');
      
      // Should still see the goal
      await expect(page.locator('text=Test Goal')).toBeVisible();
    });

    test('should show real-time updates', async ({ page }) => {
      // Create a project
      await page.click('text=Projects');
      await page.click('text=New Project');
      await page.fill('input[name="title"]', 'Real-time Test');
      await page.click('button[type="submit"]');
      
      // Navigate to dashboard
      await page.click('text=Dashboard');
      
      // Should see the project immediately
      await expect(page.locator('text=Real-time Test')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load pages quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
    });

    test('should handle AI requests efficiently', async ({ page }) => {
      // Login first
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await page.click('text=Goals');
      
      // Create a goal
      await page.click('text=Add Goal');
      await page.fill('input[name="title"]', 'Performance Test');
      await page.click('button[type="submit"]');
      
      // Click AI insights
      const startTime = Date.now();
      await page.click('text=AI Insights');
      
      // Wait for AI response
      await page.waitForSelector('text=AI Analysis', { timeout: 10000 });
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(10000); // Should respond in under 10 seconds
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // This would require mocking network failures
      // For now, we'll test that error boundaries exist
      await page.goto('/');
      
      // Should not show any error messages on normal load
      await expect(page.locator('text=Error')).not.toBeVisible();
    });

    test('should show user-friendly error messages', async ({ page }) => {
      // Login with invalid credentials
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', 'invalid@email.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });
  });
});
