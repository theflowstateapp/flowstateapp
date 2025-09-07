// Vercel Serverless Function - User Registration with Supabase
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
    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Register user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    if (!data.user) {
      return res.status(400).json({
        success: false,
        error: 'User creation failed'
      });
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: name,
        email: email,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    const user = {
      id: data.user.id,
      email: data.user.email,
      name: name,
      avatar: null,
      createdAt: data.user.created_at
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
      token: data.session?.access_token || null,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
