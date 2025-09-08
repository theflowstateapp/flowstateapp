const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  try {
    // List files in the current directory
    const currentDir = process.cwd();
    const files = fs.readdirSync(currentDir);
    
    // Try to list api/lib directory
    let libFiles = [];
    try {
      libFiles = fs.readdirSync(path.join(currentDir, 'api', 'lib'));
    } catch (error) {
      libFiles = ['Error: ' + error.message];
    }
    
    // Try to list lib directory
    let rootLibFiles = [];
    try {
      rootLibFiles = fs.readdirSync(path.join(currentDir, 'lib'));
    } catch (error) {
      rootLibFiles = ['Error: ' + error.message];
    }
    
    const result = {
      timestamp: new Date().toISOString(),
      currentDir,
      files,
      libFiles,
      rootLibFiles,
      nodeVersion: process.version
    };
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ 
      ok: false, 
      error: error.message,
      stack: error.stack 
    });
  }
};
