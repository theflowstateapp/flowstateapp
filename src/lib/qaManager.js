// CQO Agent Task: Automated Quality Assurance System
// Comprehensive QA automation for LifeOS

import { chromium, firefox, webkit } from 'playwright';
import { performance } from 'perf_hooks';

// QA Configuration
export const QA_CONFIG = {
  browsers: ['chromium', 'firefox', 'webkit'],
  viewports: [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 375, height: 667, name: 'mobile' }
  ],
  performanceThresholds: {
    firstContentfulPaint: 2000,
    largestContentfulPaint: 4000,
    firstInputDelay: 100,
    cumulativeLayoutShift: 0.1
  },
  accessibilityThresholds: {
    wcagAA: 90,
    wcagAAA: 80
  }
};

// Quality Assurance Manager
export class QualityAssuranceManager {
  constructor() {
    this.results = {
      performance: [],
      accessibility: [],
      functionality: [],
      security: [],
      usability: []
    };
    this.browserInstances = new Map();
  }

  // Initialize browsers
  async initializeBrowsers() {
    for (const browserType of QA_CONFIG.browsers) {
      const browser = await this.getBrowser(browserType);
      this.browserInstances.set(browserType, browser);
    }
  }

  // Get browser instance
  async getBrowser(browserType) {
    switch (browserType) {
      case 'chromium':
        return await chromium.launch({ headless: true });
      case 'firefox':
        return await firefox.launch({ headless: true });
      case 'webkit':
        return await webkit.launch({ headless: true });
      default:
        throw new Error(`Unsupported browser: ${browserType}`);
    }
  }

  // Run comprehensive QA tests
  async runComprehensiveQA(baseUrl = 'http://localhost:3000') {
    // eslint-disable-next-line no-console
    console.log('🚀 Starting comprehensive QA testing...');
    
    await this.initializeBrowsers();
    
    const testResults = {
      timestamp: new Date().toISOString(),
      baseUrl,
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      details: {}
    };

    // Run tests for each browser and viewport combination
    for (const browserType of QA_CONFIG.browsers) {
      const browser = this.browserInstances.get(browserType);
      
      for (const viewport of QA_CONFIG.viewports) {
        // eslint-disable-next-line no-console
        console.log(`Testing ${browserType} on ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        const context = await browser.newContext({
          viewport: viewport,
          userAgent: this.getUserAgent(browserType, viewport.name)
        });
        
        const page = await context.newPage();
        
        // Run all QA tests
        const browserResults = await this.runAllQATests(page, baseUrl, browserType, viewport);
        
        testResults.details[`${browserType}_${viewport.name}`] = browserResults;
        
        await context.close();
      }
    }

    // Generate summary
    testResults.summary = this.generateSummary(testResults.details);
    
    // Clean up
    await this.cleanup();
    
    return testResults;
  }

  // Run all QA tests for a page
  async runAllQATests(page, baseUrl, browserType, viewport) {
    const results = {
      performance: await this.testPerformance(page, baseUrl),
      accessibility: await this.testAccessibility(page, baseUrl),
      functionality: await this.testFunctionality(page, baseUrl),
      security: await this.testSecurity(page, baseUrl),
      usability: await this.testUsability(page, baseUrl)
    };

    return results;
  }

  // Performance Testing
  async testPerformance(page, baseUrl) {
    // eslint-disable-next-line no-console
    console.log('📊 Testing performance...');
    
    const results = {
      metrics: {},
      score: 0,
      issues: []
    };

    try {
      // Navigate to main page
      const startTime = performance.now();
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      const loadTime = performance.now() - startTime;

      // Get Core Web Vitals
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const metrics = {};
            
            entries.forEach((entry) => {
              if (entry.entryType === 'paint') {
                metrics[entry.name] = entry.startTime;
              } else if (entry.entryType === 'largest-contentful-paint') {
                metrics.lcp = entry.startTime;
              } else if (entry.entryType === 'first-input') {
                metrics.fid = entry.processingStart - entry.startTime;
              } else if (entry.entryType === 'layout-shift') {
                metrics.cls = (metrics.cls || 0) + entry.value;
              }
            });
            
            resolve(metrics);
          });
          
          observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
          
          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        });
      });

      results.metrics = {
        loadTime,
        ...metrics
      };

      // Check thresholds
      if (metrics.firstContentfulPaint > QA_CONFIG.performanceThresholds.firstContentfulPaint) {
        results.issues.push(`FCP too slow: ${metrics.firstContentfulPaint}ms`);
      }
      if (metrics.lcp > QA_CONFIG.performanceThresholds.largestContentfulPaint) {
        results.issues.push(`LCP too slow: ${metrics.lcp}ms`);
      }
      if (metrics.fid > QA_CONFIG.performanceThresholds.firstInputDelay) {
        results.issues.push(`FID too slow: ${metrics.fid}ms`);
      }
      if (metrics.cls > QA_CONFIG.performanceThresholds.cumulativeLayoutShift) {
        results.issues.push(`CLS too high: ${metrics.cls}`);
      }

      // Calculate score
      results.score = this.calculatePerformanceScore(results.metrics);

    } catch (error) {
      results.issues.push(`Performance test failed: ${error.message}`);
    }

    return results;
  }

  // Accessibility Testing
  async testAccessibility(page, baseUrl) {
    // eslint-disable-next-line no-console
    console.log('♿ Testing accessibility...');
    
    const results = {
      score: 0,
      issues: [],
      violations: []
    };

    try {
      // Navigate to page
      await page.goto(baseUrl, { waitUntil: 'networkidle' });

      // Run axe-core accessibility tests
      const accessibilityResults = await page.evaluate(() => {
        return new Promise((resolve) => {
          if (typeof axe !== 'undefined') {
            axe.run().then(results => {
              resolve({
                violations: results.violations,
                passes: results.passes,
                incomplete: results.incomplete
              });
            });
          } else {
            // Fallback basic accessibility checks
            const issues = [];
            
            // Check for alt text on images
            const images = document.querySelectorAll('img');
            images.forEach(img => {
              if (!img.alt && !img.getAttribute('aria-label')) {
                issues.push('Image missing alt text');
              }
            });
            
            // Check for heading hierarchy
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let lastLevel = 0;
            headings.forEach(heading => {
              const level = parseInt(heading.tagName.charAt(1));
              if (level > lastLevel + 1) {
                issues.push('Heading hierarchy skipped');
              }
              lastLevel = level;
            });
            
            resolve({ violations: [], passes: [], incomplete: [], basicIssues: issues });
          }
        });
      });

      results.violations = accessibilityResults.violations || [];
      results.issues = [...results.violations.map(v => v.description), ...(accessibilityResults.basicIssues || [])];
      
      // Calculate accessibility score
      const totalChecks = (accessibilityResults.passes?.length || 0) + (accessibilityResults.violations?.length || 0);
      const passedChecks = accessibilityResults.passes?.length || 0;
      results.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

    } catch (error) {
      results.issues.push(`Accessibility test failed: ${error.message}`);
    }

    return results;
  }

  // Functionality Testing
  async testFunctionality(page, baseUrl) {
    // eslint-disable-next-line no-console
    console.log('🔧 Testing functionality...');
    
    const results = {
      score: 0,
      issues: [],
      tests: []
    };

    try {
      // Test main navigation
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      
      // Test if main elements are present
      const mainElements = await page.evaluate(() => {
        const elements = {
          header: !!document.querySelector('header, [role="banner"]'),
          navigation: !!document.querySelector('nav, [role="navigation"]'),
          main: !!document.querySelector('main, [role="main"]'),
          footer: !!document.querySelector('footer, [role="contentinfo"]')
        };
        return elements;
      });

      Object.entries(mainElements).forEach(([element, present]) => {
        results.tests.push({
          test: `${element} element present`,
          passed: present,
          message: present ? 'Element found' : `Missing ${element} element`
        });
      });

      // Test responsive design
      const responsiveTest = await page.evaluate(() => {
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        
        const hasHorizontalScroll = document.documentElement.scrollWidth > viewport.width;
        const hasVerticalScroll = document.documentElement.scrollHeight > viewport.height;
        
        return {
          viewport,
          horizontalScroll: hasHorizontalScroll,
          verticalScroll: hasVerticalScroll,
          responsive: !hasHorizontalScroll
        };
      });

      results.tests.push({
        test: 'Responsive design',
        passed: responsiveTest.responsive,
        message: responsiveTest.responsive ? 'No horizontal scroll' : 'Horizontal scroll detected'
      });

      // Test form functionality (if forms exist)
      const forms = await page.$$('form');
      for (const form of forms) {
        const formTest = await form.evaluate(formEl => {
          const inputs = formEl.querySelectorAll('input, textarea, select');
          const hasRequiredFields = Array.from(inputs).some(input => input.hasAttribute('required'));
          const hasValidation = Array.from(inputs).some(input => input.hasAttribute('pattern') || input.type === 'email');
          
          return {
            inputCount: inputs.length,
            hasRequiredFields,
            hasValidation
          };
        });

        results.tests.push({
          test: 'Form validation',
          passed: formTest.hasValidation,
          message: formTest.hasValidation ? 'Form has validation' : 'Form missing validation'
        });
      }

      // Calculate functionality score
      const passedTests = results.tests.filter(test => test.passed).length;
      results.score = results.tests.length > 0 ? Math.round((passedTests / results.tests.length) * 100) : 100;

    } catch (error) {
      results.issues.push(`Functionality test failed: ${error.message}`);
    }

    return results;
  }

  // Security Testing
  async testSecurity(page, baseUrl) {
    // eslint-disable-next-line no-console
    console.log('🔒 Testing security...');
    
    const results = {
      score: 0,
      issues: [],
      checks: []
    };

    try {
      // Test HTTPS (if applicable)
      const isHttps = baseUrl.startsWith('https://');
      results.checks.push({
        check: 'HTTPS enabled',
        passed: isHttps,
        message: isHttps ? 'HTTPS is enabled' : 'HTTPS not enabled'
      });

      // Test security headers
      const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
      const headers = response.headers();
      
      const securityHeaders = {
        'X-Frame-Options': headers['x-frame-options'],
        'X-Content-Type-Options': headers['x-content-type-options'],
        'X-XSS-Protection': headers['x-xss-protection'],
        'Strict-Transport-Security': headers['strict-transport-security'],
        'Content-Security-Policy': headers['content-security-policy']
      };

      Object.entries(securityHeaders).forEach(([header, value]) => {
        results.checks.push({
          check: `${header} header`,
          passed: !!value,
          message: value ? `${header} is set` : `${header} is missing`
        });
      });

      // Test for mixed content
      const mixedContentTest = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[src]');
        const links = document.querySelectorAll('link[href]');
        const images = document.querySelectorAll('img[src]');
        
        const allElements = [...scripts, ...links, ...images];
        const httpElements = allElements.filter(el => {
          const src = el.src || el.href;
          return src && src.startsWith('http://');
        });
        
        return {
          totalElements: allElements.length,
          httpElements: httpElements.length,
          hasMixedContent: httpElements.length > 0
        };
      });

      results.checks.push({
        check: 'Mixed content',
        passed: !mixedContentTest.hasMixedContent,
        message: mixedContentTest.hasMixedContent ? 
          `Found ${mixedContentTest.httpElements} HTTP resources` : 
          'No mixed content detected'
      });

      // Calculate security score
      const passedChecks = results.checks.filter(check => check.passed).length;
      results.score = results.checks.length > 0 ? Math.round((passedChecks / results.checks.length) * 100) : 100;

    } catch (error) {
      results.issues.push(`Security test failed: ${error.message}`);
    }

    return results;
  }

  // Usability Testing
  async testUsability(page, baseUrl) {
    // eslint-disable-next-line no-console
    console.log('👥 Testing usability...');
    
    const results = {
      score: 0,
      issues: [],
      checks: []
    };

    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle' });

      // Test page load time
      const loadTime = await page.evaluate(() => {
        return performance.timing.loadEventEnd - performance.timing.navigationStart;
      });

      results.checks.push({
        check: 'Page load time',
        passed: loadTime < 3000,
        message: `Page loaded in ${loadTime}ms`
      });

      // Test mobile friendliness
      const mobileTest = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        const hasViewport = !!viewport;
        const hasZoomControl = viewport ? viewport.content.includes('user-scalable=no') : false;
        
        return {
          hasViewport,
          hasZoomControl,
          mobileFriendly: hasViewport && !hasZoomControl
        };
      });

      results.checks.push({
        check: 'Mobile friendly',
        passed: mobileTest.mobileFriendly,
        message: mobileTest.mobileFriendly ? 'Mobile friendly' : 'Not mobile friendly'
      });

      // Test color contrast (basic)
      const contrastTest = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let lowContrastElements = 0;
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Basic contrast check (simplified)
          if (color && backgroundColor && color !== backgroundColor) {
            // This is a simplified check - in real implementation, you'd use a proper contrast ratio calculation
            const colorBrightness = this.getBrightness(color);
            const bgBrightness = this.getBrightness(backgroundColor);
            const contrast = Math.abs(colorBrightness - bgBrightness);
            
            if (contrast < 125) { // Simplified threshold
              lowContrastElements++;
            }
          }
        });
        
        return {
          totalElements: elements.length,
          lowContrastElements,
          hasContrastIssues: lowContrastElements > 0
        };
      });

      results.checks.push({
        check: 'Color contrast',
        passed: !contrastTest.hasContrastIssues,
        message: contrastTest.hasContrastIssues ? 
          `Found ${contrastTest.lowContrastElements} low contrast elements` : 
          'Good color contrast'
      });

      // Calculate usability score
      const passedChecks = results.checks.filter(check => check.passed).length;
      results.score = results.checks.length > 0 ? Math.round((passedChecks / results.checks.length) * 100) : 100;

    } catch (error) {
      results.issues.push(`Usability test failed: ${error.message}`);
    }

    return results;
  }

  // Helper methods
  getUserAgent(browserType, deviceType) {
    const userAgents = {
      chromium: {
        desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        mobile: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        tablet: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      },
      firefox: {
        desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        mobile: 'Mozilla/5.0 (Mobile; rv:89.0) Gecko/89.0 Firefox/89.0',
        tablet: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/89.0 Mobile/15E148 Safari/605.1.15'
      },
      webkit: {
        desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        tablet: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      }
    };
    
    return userAgents[browserType]?.[deviceType] || userAgents.chromium.desktop;
  }

  calculatePerformanceScore(metrics) {
    let score = 100;
    
    if (metrics.firstContentfulPaint > QA_CONFIG.performanceThresholds.firstContentfulPaint) {
      score -= 20;
    }
    if (metrics.lcp > QA_CONFIG.performanceThresholds.largestContentfulPaint) {
      score -= 20;
    }
    if (metrics.fid > QA_CONFIG.performanceThresholds.firstInputDelay) {
      score -= 20;
    }
    if (metrics.cls > QA_CONFIG.performanceThresholds.cumulativeLayoutShift) {
      score -= 20;
    }
    
    return Math.max(0, score);
  }

  generateSummary(details) {
    const summary = {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    };

    Object.values(details).forEach(browserResult => {
      Object.values(browserResult).forEach(testResult => {
        summary.total++;
        if (testResult.score >= 80) {
          summary.passed++;
        } else if (testResult.score >= 60) {
          summary.warnings++;
        } else {
          summary.failed++;
        }
      });
    });

    return summary;
  }

  async cleanup() {
    for (const browser of this.browserInstances.values()) {
      await browser.close();
    }
    this.browserInstances.clear();
  }

  // Generate QA report
  generateReport(results) {
    const report = {
      timestamp: results.timestamp,
      baseUrl: results.baseUrl,
      summary: results.summary,
      recommendations: this.generateRecommendations(results.details),
      details: results.details
    };

    return report;
  }

  generateRecommendations(details) {
    const recommendations = [];

    Object.entries(details).forEach(([browserViewport, results]) => {
      Object.entries(results).forEach(([testType, result]) => {
        if (result.score < 80) {
          recommendations.push({
            browser: browserViewport,
            testType,
            issue: `Low ${testType} score: ${result.score}`,
            recommendation: this.getRecommendation(testType, result)
          });
        }
      });
    });

    return recommendations;
  }

  getRecommendation(testType, result) {
    const recommendations = {
      performance: 'Optimize images, enable compression, minimize JavaScript',
      accessibility: 'Add alt text, improve heading hierarchy, increase color contrast',
      functionality: 'Fix broken elements, improve form validation',
      security: 'Add security headers, enable HTTPS, fix mixed content',
      usability: 'Improve mobile experience, optimize load times'
    };

    return recommendations[testType] || 'Review and improve the identified issues';
  }
}

// Export QA Manager instance
export const qaManager = new QualityAssuranceManager();

export default qaManager;
