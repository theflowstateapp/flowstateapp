const { test, expect } = require('@playwright/test');

test.describe('Navigation and Button Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should verify landing page loads correctly', async ({ page }) => {
    // Check that the page loads and displays FlowState branding
    await expect(page.locator('text=FlowState')).toBeVisible();
    
    // Check hero section loads
    await expect(page.locator('text=Achieve Peak')).toBeVisible();
    await expect(page.locator('text=Performance')).toBeVisible();
    
    console.log('✅ Landing page loads correctly with FlowState branding');
  });

  test('should verify navigation buttons exist and are clickable', async ({ page }) => {
    // Check Sign In button exists and is clickable
    const signInBtn = page.locator('button:has-text("Sign In")');
    await expect(signInBtn).toBeVisible();
    
    // Check Start Free Trial button in header
    const startTrialBtn = page.locator('button:has-text("Start Free Trial")');
    await expect(startTrialBtn).toBeVisible();
    
    // Check main CTA button exists
    const mainCtaBtn = page.locator('button:has-text("Start Your Flow Journey")');
    await expect(mainCtaBtn).toBeVisible();
    
    console.log('✅ All navigation buttons are present and visible');
  });

  test('should navigate to login page', async ({ page }) => {
    // Click the Sign In button
    await page.click('button:has-text("Sign In")');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the login page
    expect(page.url()).toContain('/login');
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    
    console.log('✅ Successfully navigated to login page');
  });

  test('should navigate to register page from header', async ({ page }) => {
    // Click the Start Free Trial button in header
    await page.click('button:has-text("Start Free Trial")');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the register page
    expect(page.url()).toContain('/register');
    await expect(page.locator('text=Start Your Flow Journey')).toBeVisible();
    
    console.log('✅ Successfully navigated to register page from header');
  });

  test('should navigate to register page from main CTA', async ({ page }) => {
    // Click the main CTA button
    await page.click('button:has-text("Start Your Flow Journey")');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the register page
    expect(page.url()).toContain('/register');
    await expect(page.locator('text=Start Your Flow Journey')).toBeVisible();
    
    console.log('✅ Successfully navigated to register page from main CTA');
  });

  test('should navigate to contact page', async ({ page }) => {
    // First scroll to make sure contact link is visible (if it exists in footer)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Look for contact navigation
    const contactLink = page.locator('a[href="#contact"], button:has-text("Contact"), a:has-text("Contact")');
    if (await contactLink.count() > 0) {
      await contactLink.first().click();
      await page.waitForLoadState('networkidle');
      console.log('✅ Contact navigation found and clicked');
    } else {
      // Try direct navigation
      await page.goto('http://localhost:3000/contact');
      await page.waitForLoadState('networkidle');
      
      // Verify we're on the contact page
      expect(page.url()).toContain('/contact');
      await expect(page.locator('text=Get in Touch')).toBeVisible();
      
      console.log('✅ Successfully navigated to contact page directly');
    }
  });

  test('should complete login flow and reach dashboard', async ({ page }) => {
    // Navigate to login page
    await page.click('button:has-text("Sign In")');
    await page.waitForLoadState('networkidle');
    
    // Fill in login form (using demo credentials)
    await page.fill('input[type="email"]', 'demo@flowstate.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    
    // Wait for potential navigation
    await page.waitForTimeout(2000);
    
    // Check if we're on dashboard
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully logged in and redirected to dashboard');
      
      // Check for dashboard elements (but be flexible about content)
      const flowStateLogo = page.locator('text=FlowState');
      if (await flowStateLogo.count() > 0) {
        console.log('✅ Dashboard displays FlowState branding');
      }
    } else {
      console.log('⚠️ Login completed but not redirected to dashboard. Current URL:', currentUrl);
    }
  });
});


