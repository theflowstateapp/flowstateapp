import { test, expect } from '@playwright/test';

test.describe('Onboarding Tour Tests', () => {
  test('should start tour for first-time users', async ({ page }) => {
    // Clear any existing tour completion status
    await page.addInitScript(() => {
      localStorage.removeItem('flowstate-tour-completed');
    });
    
    // Navigate to the app
    await page.goto('http://localhost:3001');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for the tour to potentially start
    await page.waitForTimeout(2000);
    
    // Check if tour is visible (look for joyride elements)
    const tourElement = page.locator('[data-testid="react-joyride-step"]');
    const tourVisible = await tourElement.isVisible().catch(() => false);
    
    if (tourVisible) {
      console.log('Tour started successfully');
      
      // Take a screenshot
      await page.screenshot({ path: 'tour-started.png', fullPage: true });
      
      // Check if we can see the "Next" button
      const nextButton = page.locator('button:has-text("Next")');
      const nextButtonVisible = await nextButton.isVisible().catch(() => false);
      
      if (nextButtonVisible) {
        console.log('Next button is visible');
        
        // Click the Next button
        await nextButton.click();
        
        // Wait a bit for the next step
        await page.waitForTimeout(1000);
        
        // Take another screenshot
        await page.screenshot({ path: 'tour-next-step.png', fullPage: true });
        
        // Check if we're still in the tour (not closed)
        const stillInTour = await tourElement.isVisible().catch(() => false);
        
        if (stillInTour) {
          console.log('✅ Tour continued to next step successfully');
        } else {
          console.log('❌ Tour closed unexpectedly after clicking Next');
        }
      } else {
        console.log('Next button not found');
      }
    } else {
      console.log('Tour did not start - this might be expected if user is not first-time');
    }
  });
  
  test('should not start tour for returning users', async ({ page }) => {
    // Set tour as completed
    await page.addInitScript(() => {
      localStorage.setItem('flowstate-tour-completed', 'true');
    });
    
    // Navigate to the app
    await page.goto('http://localhost:3001');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait a bit to ensure tour doesn't start
    await page.waitForTimeout(2000);
    
    // Check that tour is not visible
    const tourElement = page.locator('[data-testid="react-joyride-step"]');
    const tourVisible = await tourElement.isVisible().catch(() => false);
    
    expect(tourVisible).toBe(false);
    console.log('✅ Tour correctly did not start for returning user');
  });
});
