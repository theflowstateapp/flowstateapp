module.exports = async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'text/plain');
    
    // Test if we can load the demo modules
    let result = "Testing demo module loading...\n";
    
    try {
      const demoRenderers = require('./lib/demo-pages.js');
      result += "✓ demo-pages.js loaded successfully\n";
      
      const { resolveDemoPageMeta } = demoRenderers;
      const meta = resolveDemoPageMeta("overview");
      result += `✓ resolveDemoPageMeta works: ${meta.page}\n`;
      
      result += "✓ All demo modules loaded successfully\n";
    } catch (e) {
      result += `✗ Error loading demo modules: ${e.message}\n`;
      result += `Stack: ${e.stack}\n`;
    }
    
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(`Handler error: ${error.message}`);
  }
};
