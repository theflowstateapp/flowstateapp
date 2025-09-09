module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const envCheck = {
      ok: true,
      qaSecret: {
        exists: !!process.env.QA_SECRET,
        length: process.env.QA_SECRET ? process.env.QA_SECRET.length : 0,
        firstChars: process.env.QA_SECRET ? process.env.QA_SECRET.substring(0, 10) : 'undefined'
      },
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('QA') || key.includes('SUPABASE'))
    };

    res.status(200).json(envCheck);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};
