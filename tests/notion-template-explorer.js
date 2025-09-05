const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Notion Template Explorer', () => {
  test('Explore Notion Life OS Template', async ({ page }) => {
    // Navigate to the Notion template
    await page.goto('https://abhishekjohn.notion.site/Notion-Life-OS-2612e64ca55f8056a6cecaa1858b0e97');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of the main page
    await page.screenshot({ 
      path: 'screenshots/notion-template/01-main-page.png',
      fullPage: true 
    });
    
    console.log('📸 Captured main page screenshot');
    
    // Look for navigation elements and sidebar
    const sidebar = page.locator('[data-block-id]').first();
    if (await sidebar.isVisible()) {
      console.log('✅ Found sidebar/navigation elements');
    }
    
    // Look for PARA method sections
    const paraSections = await page.locator('text=/Projects|Areas|Resources|Archives/i').all();
    console.log(`🔍 Found ${paraSections.length} potential PARA sections`);
    
    // Look for database views
    const databaseViews = await page.locator('[data-block-id*="database"]').all();
    console.log(`📊 Found ${databaseViews.length} database views`);
    
    // Look for linked pages
    const linkedPages = await page.locator('a[href*="/"]').all();
    console.log(`🔗 Found ${linkedPages.length} potential linked pages`);
    
    // Try to find and click on different sections
    const sections = [
      'Projects',
      'Areas', 
      'Resources',
      'Archives',
      'Dashboard',
      'Goals',
      'Habits',
      'Health',
      'Finance',
      'Learning',
      'Relationships',
      'Time Management',
      'Journal',
      'Settings'
    ];
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      try {
        // Look for the section link
        const sectionLink = page.locator(`text=${section}`, { exact: false }).first();
        
        if (await sectionLink.isVisible()) {
          console.log(`🔍 Found section: ${section}`);
          
          // Click on the section
          await sectionLink.click();
          await page.waitForLoadState('networkidle');
          
          // Take screenshot
          await page.screenshot({ 
            path: `screenshots/notion-template/02-${section.toLowerCase().replace(/\s+/g, '-')}.png`,
            fullPage: true 
          });
          
          console.log(`📸 Captured ${section} page screenshot`);
          
          // Look for sub-pages or linked content
          const subLinks = await page.locator('a[href*="/"]').all();
          console.log(`  📄 Found ${subLinks.length} potential sub-links in ${section}`);
          
          // Go back to main page for next iteration
          await page.goBack();
          await page.waitForLoadState('networkidle');
        }
      } catch (error) {
        console.log(`❌ Could not navigate to ${section}: ${error.message}`);
      }
    }
    
    // Look for tooltips and help text
    const tooltips = await page.locator('[title], [data-tooltip], [aria-label]').all();
    console.log(`💡 Found ${tooltips.length} potential tooltips/help elements`);
    
    // Look for database properties and fields
    const databaseRows = await page.locator('[data-block-id*="database"] [role="row"]').all();
    console.log(`📋 Found ${databaseRows.length} database rows`);
    
    // Look for filters and views
    const filters = await page.locator('text=/filter|view|sort/i').all();
    console.log(`🔧 Found ${filters.length} potential filter/view elements`);
    
    // Take a final comprehensive screenshot
    await page.screenshot({ 
      path: 'screenshots/notion-template/03-comprehensive-overview.png',
      fullPage: true 
    });
    
    console.log('✅ Notion template exploration complete!');
  });
  
  test('Extract Notion Structure', async ({ page }) => {
    await page.goto('https://abhishekjohn.notion.site/Notion-Life-OS-2612e64ca55f8056a6cecaa1858b0e97');
    await page.waitForLoadState('networkidle');
    
    // Extract page structure and content
    const pageStructure = await page.evaluate(() => {
      const structure = {
        title: document.title,
        headings: [],
        links: [],
        databases: [],
        blocks: []
      };
      
      // Get all headings
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        structure.headings.push({
          level: heading.tagName.toLowerCase(),
          text: heading.textContent.trim()
        });
      });
      
      // Get all links
      const links = document.querySelectorAll('a[href]');
      links.forEach(link => {
        structure.links.push({
          text: link.textContent.trim(),
          href: link.href
        });
      });
      
      // Get database blocks
      const databaseBlocks = document.querySelectorAll('[data-block-id*="database"]');
      databaseBlocks.forEach(block => {
        structure.databases.push({
          id: block.getAttribute('data-block-id'),
          title: block.querySelector('[data-block-id]')?.textContent?.trim() || 'Untitled Database'
        });
      });
      
      // Get all content blocks
      const contentBlocks = document.querySelectorAll('[data-block-id]');
      contentBlocks.forEach(block => {
        structure.blocks.push({
          id: block.getAttribute('data-block-id'),
          type: block.getAttribute('data-block-type') || 'unknown',
          text: block.textContent?.trim()?.substring(0, 100) || ''
        });
      });
      
      return structure;
    });
    
    // Save the structure to a file
    fs.writeFileSync(
      'screenshots/notion-template/page-structure.json', 
      JSON.stringify(pageStructure, null, 2)
    );
    
    console.log('📄 Saved page structure analysis');
    console.log(`📊 Found ${pageStructure.headings.length} headings`);
    console.log(`🔗 Found ${pageStructure.links.length} links`);
    console.log(`📋 Found ${pageStructure.databases.length} databases`);
    console.log(`🧱 Found ${pageStructure.blocks.length} content blocks`);
  });
});

