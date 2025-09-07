const { ensureDemoUserAndWorkspace, createDemoToken, DEMO_CONFIG } = require('../utils/demo.js');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Demo access endpoint
const demoAccess = async (req, res) => {
  try {
    console.log('DEMO_ACCESSED: Demo access requested');
    
    // Ensure demo user and workspace exist
    const { userId, workspaceId } = await ensureDemoUserAndWorkspace();
    
    // Sign in the demo user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: DEMO_CONFIG.EMAIL,
      password: DEMO_CONFIG.PASSWORD
    });

    if (authError) {
      console.error('DEMO_SIGNED_IN: Error signing in demo user:', authError);
      return res.status(500).json({
        success: false,
        error: 'Demo authentication failed'
      });
    }

    console.log('DEMO_SIGNED_IN: Demo user signed in successfully');

    // Generate demo token for fallback
    const demoToken = createDemoToken(workspaceId);

    // Set session cookies with proper domain and security
    const sessionCookie = `sb-access-token=${authData.session.access_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; SameSite=None; Secure; HttpOnly`;
    const refreshCookie = `sb-refresh-token=${authData.session.refresh_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; SameSite=None; Secure; HttpOnly`;
    const demoCookie = `demo=1; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; SameSite=None; Secure`;

    // Set headers for redirect
    res.setHeader('Set-Cookie', [sessionCookie, refreshCookie, demoCookie]);
    res.setHeader('Location', `https://${DEMO_CONFIG.DOMAIN}/app?demo=1&demoToken=${demoToken}`);
    res.status(302).end();

  } catch (error) {
    console.error('DEMO_ACCESSED: Error in demo access:', error);
    res.status(500).json({
      success: false,
      error: 'Demo access failed'
    });
  }
};

// Demo token exchange endpoint
const demoTokenExchange = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token required'
      });
    }

    const { verifyDemoToken } = await import('../utils/demo.js');
    const payload = verifyDemoToken(token);

    if (!payload) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Sign in the demo user
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: DEMO_CONFIG.EMAIL,
      password: DEMO_CONFIG.PASSWORD
    });

    if (authError) {
      console.error('Error signing in demo user:', authError);
      return res.status(500).json({
        success: false,
        error: 'Demo authentication failed'
      });
    }

    // Set session cookies
    const sessionCookie = `sb-access-token=${authData.session.access_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; SameSite=None; Secure; HttpOnly`;
    const refreshCookie = `sb-refresh-token=${authData.session.refresh_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; SameSite=None; Secure; HttpOnly`;
    const demoCookie = `demo=1; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; SameSite=None; Secure`;

    res.setHeader('Set-Cookie', [sessionCookie, refreshCookie, demoCookie]);
    res.status(204).end();

  } catch (error) {
    console.error('Error in demo token exchange:', error);
    res.status(500).json({
      success: false,
      error: 'Token exchange failed'
    });
  }
};

module.exports = {
  demoAccess,
  demoTokenExchange
};
