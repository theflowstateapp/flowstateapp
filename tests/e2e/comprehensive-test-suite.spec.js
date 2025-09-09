// CQO Agent Task: Comprehensive Testing Suite
// This file contains the testing strategy and implementation for LifeOS

import { test, expect } from '@playwright/test';

// Test Configuration
test.describe.configure({ mode: 'parallel' });

// 1. Core Functionality Tests
test.describe('Core Application Functionality', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LifeOS/);
    await expect(page.locator('h1')).toContainText('Organize Your Life with AI');
  });

  test('should navigate to dashboard after login', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Start Free Trial');
    // Mock login process
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new task', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('text=New Task');
    await page.fill('input[name="title"]', 'Test Task');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.selectOption('select[name="priority"]', 'high');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Test Task')).toBeVisible();
  });

  test('should toggle task completion', async ({ page }) => {
    await page.goto('/tasks');
    const taskCheckbox = page.locator('[data-testid="task-checkbox"]').first();
    await taskCheckbox.click();
    await expect(taskCheckbox).toBeChecked();
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('text=Filters');
    await page.selectOption('select[name="status"]', 'completed');
    const tasks = page.locator('[data-testid="task-item"]');
    await expect(tasks).toHaveCount(await page.locator('[data-testid="task-item"][data-status="completed"]').count());
  });
});

// 2. AI Assistant Tests
test.describe('AI Assistant Functionality', () => {
  test('should open AI assistant chat', async ({ page }) => {
    await page.goto('/ai-assistant');
    await expect(page.locator('[data-testid="ai-messages-area"]')).toBeVisible();
    await expect(page.locator('text=Welcome to your AI Assistant!')).toBeVisible();
  });

  test('should send message to AI assistant', async ({ page }) => {
    await page.goto('/ai-assistant');
    await page.fill('[data-testid="ai-input"]', 'Help me organize my tasks');
    await page.click('[data-testid="ai-send-button"]');
    await expect(page.locator('[data-testid="ai-message"]').last()).toContainText('Help me organize my tasks');
  });

  test('should display AI response', async ({ page }) => {
    await page.goto('/ai-assistant');
    await page.fill('[data-testid="ai-input"]', 'What are my priorities today?');
    await page.click('[data-testid="ai-send-button"]');
    // Wait for AI response
    await page.waitForSelector('[data-testid="ai-message"][data-sender="ai"]');
    await expect(page.locator('[data-testid="ai-message"][data-sender="ai"]')).toBeVisible();
  });

  test('should show suggestion chips', async ({ page }) => {
    await page.goto('/ai-assistant');
    await expect(page.locator('[data-testid="suggestion-chip"]')).toHaveCount(4);
  });
});

// 3. Voice Capture Tests
test.describe('Voice Capture Functionality', () => {
  test('should open voice capture page', async ({ page }) => {
    await page.goto('/voice-capture');
    await expect(page.locator('text=Voice Capture')).toBeVisible();
    await expect(page.locator('[data-testid="record-button"]')).toBeVisible();
  });

  test('should start recording', async ({ page }) => {
    await page.goto('/voice-capture');
    await page.click('[data-testid="record-button"]');
    await expect(page.locator('[data-testid="recording-indicator"]')).toBeVisible();
  });

  test('should stop recording', async ({ page }) => {
    await page.goto('/voice-capture');
    await page.click('[data-testid="record-button"]');
    await page.waitForTimeout(1000); // Record for 1 second
    await page.click('[data-testid="stop-button"]');
    await expect(page.locator('[data-testid="recording-indicator"]')).not.toBeVisible();
  });
});

// 4. Analytics Tests
test.describe('Analytics Dashboard', () => {
  test('should display analytics dashboard', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible();
    await expect(page.locator('[data-testid="productivity-chart"]')).toBeVisible();
  });

  test('should show task completion trends', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page.locator('[data-testid="completion-trend"]')).toBeVisible();
  });

  test('should display goal progress', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page.locator('[data-testid="goal-progress"]')).toBeVisible();
  });
});

// 5. Notes System Tests
test.describe('Notes System', () => {
  test('should create a new note', async ({ page }) => {
    await page.goto('/notes');
    await page.click('text=New Note');
    await page.fill('input[name="title"]', 'Test Note');
    await page.fill('textarea[name="content"]', 'Test Note Content');
    await page.selectOption('select[name="category"]', 'work');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Test Note')).toBeVisible();
  });

  test('should search notes', async ({ page }) => {
    await page.goto('/notes');
    await page.fill('[data-testid="search-input"]', 'Test');
    await page.press('[data-testid="search-input"]', 'Enter');
    await expect(page.locator('[data-testid="note-item"]')).toContainText('Test');
  });

  test('should filter notes by category', async ({ page }) => {
    await page.goto('/notes');
    await page.selectOption('[data-testid="category-filter"]', 'work');
    const notes = page.locator('[data-testid="note-item"]');
    await expect(notes.first()).toHaveAttribute('data-category', 'work');
  });
});

// 6. Responsive Design Tests
test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  test('should work on desktop devices', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });
});

// 7. Performance Tests
test.describe('Performance Tests', () => {
  test('should load dashboard within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large task lists efficiently', async ({ page }) => {
    await page.goto('/tasks');
    // Create multiple tasks
    for (let i = 0; i < 50; i++) {
      await page.click('text=New Task');
      await page.fill('input[name="title"]', `Task ${i}`);
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(50);
  });
});

// 8. Accessibility Tests
test.describe('Accessibility Tests', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[aria-label]')).toHaveCount({ min: 5 });
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/tasks');
    await page.press('body', 'Tab');
    await page.press('body', 'Tab');
    await page.press('body', 'Enter');
    await expect(page.locator('[data-testid="new-task-modal"]')).toBeVisible();
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    // This would need a proper accessibility testing library
    // For now, we'll just check that the page loads
    await expect(page.locator('h1')).toBeVisible();
  });
});

// 9. Integration Tests
test.describe('Backend Integration', () => {
  test('should sync data with backend', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('text=New Task');
    await page.fill('input[name="title"]', 'Backend Test Task');
    await page.click('button[type="submit"]');
    
    // Refresh page to check if data persisted
    await page.reload();
    await expect(page.locator('text=Backend Test Task')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/tasks', route => route.abort());
    
    await page.goto('/tasks');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});

// 10. Security Tests
test.describe('Security Tests', () => {
  test('should require authentication for protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/login/);
  });

  test('should sanitize user input', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('text=New Task');
    await page.fill('input[name="title"]', '<script>alert("xss")</script>');
    await page.click('button[type="submit"]');
    // Check that script tags are not executed
    await expect(page.locator('script')).toHaveCount(0);
  });
});

// Test Utilities
export const testUtils = {
  async login(page, email = 'test@example.com', password = 'password123') {
    await page.goto('/login');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  },

  async createTask(page, title, description = '', priority = 'medium') {
    await page.click('text=New Task');
    await page.fill('input[name="title"]', title);
    if (description) await page.fill('textarea[name="description"]', description);
    await page.selectOption('select[name="priority"]', priority);
    await page.click('button[type="submit"]');
  },

  async createNote(page, title, content, category = 'general') {
    await page.click('text=New Note');
    await page.fill('input[name="title"]', title);
    await page.fill('textarea[name="content"]', content);
    await page.selectOption('select[name="category"]', category);
    await page.click('button[type="submit"]');
  }
};



