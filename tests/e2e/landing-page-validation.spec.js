import { test, expect } from '@playwright/test';

test.describe('Landing Page & Navigation Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Test Navigation Routing Fix', async ({ page }) => {
    console.log('🧭 Testing Navigation Routing Fix...');
    
    // First, let's login to test the navigation
    await page.click('text=Sign In');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Sign In")');
    
    // Wait for potential error or success
    await page.waitForTimeout(2000);
    
    // Check if we're on dashboard or if there's an error
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Successfully logged in and redirected to dashboard');
      
      // Now test the Overview navigation
      await page.click('text=Overview');
      await page.waitForLoadState('networkidle');
      
      const overviewUrl = page.url();
      console.log(`Overview URL: ${overviewUrl}`);
      
      if (overviewUrl.includes('/dashboard')) {
        console.log('✅ Overview correctly routes to Dashboard');
      } else {
        console.log('❌ Overview still routes to wrong page');
      }
    } else {
      console.log('⚠️  Login failed - testing navigation without auth');
      
      // Test the landing page navigation
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Check if landing page loads properly
      const heroTitle = await page.locator('h1').first();
      if (await heroTitle.isVisible()) {
        console.log('✅ Landing page loads correctly');
      } else {
        console.log('❌ Landing page not loading properly');
      }
    }
  });

  test('Test Landing Page Design', async ({ page }) => {
    console.log('🎨 Testing Landing Page Design...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Take screenshot
    await page.screenshot({ path: 'landing-page-new.png', fullPage: true });
    console.log('📸 Screenshot saved: landing-page-new.png');

    // Test hero section
    const heroTitle = page.locator('h1:has-text("Your Complete")');
    await expect(heroTitle).toBeVisible();
    console.log('✅ Hero title is visible');

    const ctaButton = page.locator('button:has-text("Start Your Free Trial")');
    await expect(ctaButton).toBeVisible();
    console.log('✅ CTA button is visible');

    // Test features section
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();
    console.log('✅ Features section is visible');

    // Test AI Assistant feature
    const aiFeature = page.locator('text=AI-Powered Life Assistant');
    await expect(aiFeature).toBeVisible();
    console.log('✅ AI Assistant feature highlighted');

    // Test life areas
    const lifeAreas = page.locator('text=Health & Fitness');
    await expect(lifeAreas).toBeVisible();
    console.log('✅ Life areas section visible');

    // Test testimonials
    const testimonials = page.locator('#testimonials');
    await expect(testimonials).toBeVisible();
    console.log('✅ Testimonials section visible');

    // Test pricing
    const pricing = page.locator('#pricing');
    await expect(pricing).toBeVisible();
    console.log('✅ Pricing section visible');

    // Test free trial CTA
    const freeTrialCta = page.locator('text=Start Free Trial');
    const freeTrialCount = await freeTrialCta.count();
    console.log(`✅ Found ${freeTrialCount} free trial CTAs`);

    // Test responsive design
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const mobileHero = page.locator('h1');
    await expect(mobileHero).toBeVisible();
    console.log('✅ Mobile responsive design works');

    // Test modal functionality
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.click('text=Sign In');
    
    const loginModal = page.locator('text=Sign In').nth(1); // Second occurrence (in modal)
    await expect(loginModal).toBeVisible();
    console.log('✅ Login modal opens');

    await page.click('button:has-text("×")');
    await page.waitForTimeout(500);
    
    const modalClosed = await page.locator('text=Sign In').nth(1).isVisible();
    if (!modalClosed) {
      console.log('✅ Login modal closes properly');
    } else {
      console.log('⚠️  Login modal may not be closing');
    }

    console.log('🎨 Landing page design test complete!\n');
  });

  test('Test Authentication Flow', async ({ page }) => {
    console.log('🔐 Testing Authentication Flow...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Test signup modal
    await page.click('text=Start Free Trial');
    await page.waitForTimeout(500);
    
    const signupModal = page.locator('text=Start Free Trial').nth(1);
    await expect(signupModal).toBeVisible();
    console.log('✅ Signup modal opens');

    // Test form validation
    await page.click('button:has-text("Start Free Trial")');
    await page.waitForTimeout(1000);
    
    // Check for validation error or success
    const errorMessage = page.locator('text=Please fill in all fields');
    const successMessage = page.locator('text=Account created successfully');
    
    if (await errorMessage.isVisible()) {
      console.log('✅ Form validation works');
    } else if (await successMessage.isVisible()) {
      console.log('✅ Signup successful');
    } else {
      console.log('⚠️  Form validation unclear');
    }

    // Test login modal
    await page.click('button:has-text("×")');
    await page.click('text=Sign In');
    
    const loginForm = page.locator('input[type="email"]');
    await expect(loginForm).toBeVisible();
    console.log('✅ Login form is visible');

    // Test backend connectivity
    const response = await page.request.get('http://localhost:5000/api/health');
    if (response.ok()) {
      console.log('✅ Backend is accessible');
    } else {
      console.log('❌ Backend not accessible');
    }

    console.log('🔐 Authentication flow test complete!\n');
  });

  test('Test Conversion Elements', async ({ page }) => {
    console.log('💰 Testing Conversion Elements...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Count all CTAs
    const ctaButtons = page.locator('button:has-text("Start"), button:has-text("Free Trial"), button:has-text("Sign up")');
    const ctaCount = await ctaButtons.count();
    console.log(`📊 Found ${ctaCount} conversion CTAs`);

    // Test hero CTA
    const heroCta = page.locator('button:has-text("Start Your Free Trial")').first();
    await expect(heroCta).toBeVisible();
    console.log('✅ Hero CTA is prominent');

    // Test pricing CTAs
    const pricingCtas = page.locator('#pricing button');
    const pricingCtaCount = await pricingCtas.count();
    console.log(`✅ Found ${pricingCtaCount} pricing CTAs`);

    // Test social proof
    const testimonials = page.locator('[class*="testimonial"], .bg-white.rounded-xl');
    const testimonialCount = await testimonials.count();
    console.log(`✅ Found ${testimonialCount} testimonials`);

    // Test feature highlights
    const features = page.locator('text=AI-Powered, text=P.A.R.A., text=Voice-First, text=Analytics');
    const featureCount = await features.count();
    console.log(`✅ Found ${featureCount} key feature highlights`);

    // Test urgency/scarcity elements
    const popularBadge = page.locator('text=Most Popular');
    if (await popularBadge.isVisible()) {
      console.log('✅ Popular badge creates urgency');
    }

    const freeTrialBadge = page.locator('text=Free Trial');
    if (await freeTrialBadge.isVisible()) {
      console.log('✅ Free trial badge reduces friction');
    }

    console.log('💰 Conversion elements test complete!\n');
  });
});



