import { createClient } from '@supabase/supabase-js';

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

async function setupDemoPreferences() {
  try {
    console.log('Setting up demo workspace preferences...');
    
    // Get demo user
    const { data: users, error: userError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (userError) throw userError;

    const demoUser = users.users.find(u => u.email === 'demo@theflowstateapp.com');
    if (!demoUser) {
      console.log('No demo user found, creating one...');
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'demo@theflowstateapp.com',
        password: 'FlowStateDemo2024!',
        email_confirm: true,
        user_metadata: {
          name: 'FlowState Demo',
          isDemo: true
        }
      });

      if (createError) throw createError;
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          email: 'demo@theflowstateapp.com',
          full_name: 'FlowState Demo',
          avatar_url: null,
          timezone: 'Asia/Kolkata',
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

      console.log('Demo user created:', newUser.user.id);
    }

    console.log('Demo preferences setup complete!');
  } catch (error) {
    console.error('Error setting up demo preferences:', error);
  }
}

setupDemoPreferences();
