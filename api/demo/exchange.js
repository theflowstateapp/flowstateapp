import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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

// Demo configuration
const DEMO_CONFIG = {
  EMAIL: process.env.DEMO_EMAIL || 'demo@theflowstateapp.com',
  PASSWORD: process.env.DEMO_PASSWORD || 'FlowStateDemo2024!',
  COOKIE_DOMAIN: process.env.DEMO_COOKIE_DOMAIN || '.theflowstateapp.com',
  SESSION_DURATION: parseInt(process.env.DEMO_SESSION_DURATION) || 86400,
  JWT_SECRET: process.env.DEMO_JWT_SECRET || 'FlowState_Demo_JWT_Secret_2024'
};

// Verify signed demo token
const verifyDemoToken = (token) => {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const { payload, token: signature } = decoded;
    
    const expectedToken = crypto
      .createHmac('sha256', DEMO_CONFIG.JWT_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    if (signature !== expectedToken) {
      return null;
    }
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token required'
      });
    }

    // Verify token (signature + exp)
    const payload = verifyDemoToken(token);

    if (!payload) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Sign in the demo user programmatically
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

    // Set session cookies (Domain=.theflowstateapp.com; SameSite=None; Secure)
    const sessionCookie = `sb-access-token=${authData.session.access_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; HttpOnly; Secure; SameSite=None`;
    const refreshCookie = `sb-refresh-token=${authData.session.refresh_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; HttpOnly; Secure; SameSite=None`;
    const demoCookie = `demo=1; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; Secure; SameSite=None`;

    res.setHeader('Set-Cookie', [sessionCookie, refreshCookie, demoCookie]);
    res.status(204).end();

  } catch (error) {
    console.error('Error in demo token exchange:', error);
    res.status(500).json({
      success: false,
      error: 'Token exchange failed'
    });
  }
}
