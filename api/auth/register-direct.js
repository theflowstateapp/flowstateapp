import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email, password, and name are required' 
    });
  }

  try {
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

    // Create user directly with service role (bypasses email confirmation)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: name
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({ 
        success: false, 
        error: authError.message 
      });
    }

    if (!authData.user) {
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to create user' 
      });
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: name,
        email: email,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Don't fail the request if profile creation fails
    }

    // Generate a simple token for demo purposes
    const token = Buffer.from(`${authData.user.id}:${Date.now()}`).toString('base64');

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        avatar: null,
        createdAt: authData.user.created_at
      },
      token: token,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
