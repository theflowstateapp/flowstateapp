const fs = require('fs');
module.exports = async (req, res) => {
  try {
    const buildPath = require('path').join(process.cwd(), 'build', 'index.html');
    const exists = fs.existsSync(buildPath);
    res.json({ buildExists: exists, buildPath });
  } catch (e) {
    res.json({ error: e.message });
  }
};
