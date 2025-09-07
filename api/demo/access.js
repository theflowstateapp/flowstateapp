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
  DOMAIN: process.env.APP_DOMAIN || 'theflowstateapp.com',
  JWT_SECRET: process.env.DEMO_JWT_SECRET || 'FlowState_Demo_JWT_Secret_2024',
  SESSION_DURATION: parseInt(process.env.DEMO_SESSION_DURATION) || 86400,
  COOKIE_DOMAIN: process.env.DEMO_COOKIE_DOMAIN || '.theflowstateapp.com'
};

// Ensure demo user exists
const ensureDemoUser = async () => {
  try {
    // Check if demo user already exists
    const { data: existingUser, error: userError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (userError) {
      console.error('Error listing users:', userError);
      throw userError;
    }

    const demoUser = existingUser.users.find(u => u.email === DEMO_CONFIG.EMAIL);
    
    if (demoUser) {
      console.log('DEMO_USER_READY: Demo user exists:', demoUser.id);
      return demoUser;
    }

    // Create demo user
    console.log('DEMO_USER_READY: Creating demo user...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: DEMO_CONFIG.EMAIL,
      password: DEMO_CONFIG.PASSWORD,
      email_confirm: true,
      user_metadata: {
        name: 'FlowState Demo',
        isDemo: true
      }
    });

    if (createError) {
      console.error('Error creating demo user:', createError);
      throw createError;
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email: DEMO_CONFIG.EMAIL,
        full_name: 'FlowState Demo',
        avatar_url: null,
        timezone: 'UTC',
        preferences: {
          theme: 'light',
          notifications: true,
          demo_mode: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error creating demo profile:', profileError);
    }

    console.log('DEMO_USER_READY: Demo user created:', newUser.user.id);
    return newUser.user;

  } catch (error) {
    console.error('DEMO_USER_READY: Error ensuring demo user:', error);
    throw error;
  }
};

// Create signed demo token
const createDemoToken = (uid, wid) => {
  const payload = {
    uid,
    wid,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    type: 'demo'
  };
  
  const token = crypto
    .createHmac('sha256', DEMO_CONFIG.JWT_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  return Buffer.from(JSON.stringify({ payload, token })).toString('base64');
};

export default async function handler(req, res) {
  try {
    console.log('DEMO_ACCESSED: Demo access requested');
    
    // Ensure demo user exists
    const demoUser = await ensureDemoUser();
    
    // Sign in the demo user programmatically
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

    // Create signed demo token
    const demoToken = createDemoToken(demoUser.id, 'demo-workspace');

    // Set session cookies with proper domain and security (NextAuth-style)
    const sessionCookie = `sb-access-token=${authData.session.access_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; HttpOnly; Secure; SameSite=None`;
    const refreshCookie = `sb-refresh-token=${authData.session.refresh_token}; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; HttpOnly; Secure; SameSite=None`;
    const demoCookie = `demo=1; Path=/; Domain=${DEMO_CONFIG.COOKIE_DOMAIN}; Max-Age=${DEMO_CONFIG.SESSION_DURATION}; Secure; SameSite=None`;

    // Set headers for redirect (MUST return 302 for headless clients)
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
}