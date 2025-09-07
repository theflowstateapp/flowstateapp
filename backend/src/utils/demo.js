const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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
  TIMEZONE: process.env.APP_TIMEZONE || 'Asia/Kolkata',
  JWT_SECRET: process.env.DEMO_JWT_SECRET || 'FlowState_Demo_JWT_Secret_2024',
  SESSION_DURATION: parseInt(process.env.DEMO_SESSION_DURATION) || 86400, // 24 hours
  COOKIE_DOMAIN: process.env.DEMO_COOKIE_DOMAIN || '.theflowstateapp.com'
};

// Generate today's key for workspace management
const getTodayKey = () => {
  const now = new Date();
  const timezone = DEMO_CONFIG.TIMEZONE;
  return now.toLocaleDateString('en-CA', { timeZone: timezone }); // YYYY-MM-DD format
};

// Ensure demo user exists
const ensureDemoUser = async () => {
  try {
    console.log('DEMO_USER_READY: Checking demo user...');
    
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
        timezone: DEMO_CONFIG.TIMEZONE,
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
      // Don't throw here, user was created successfully
    }

    console.log('DEMO_USER_READY: Demo user created:', newUser.user.id);
    return newUser.user;

  } catch (error) {
    console.error('DEMO_USER_READY: Error ensuring demo user:', error);
    throw error;
  }
};

// Ensure demo workspace exists for today
const ensureDemoWorkspace = async (userId) => {
  try {
    console.log('DEMO_WS_READY: Checking demo workspace...');
    
    const todayKey = getTodayKey();
    
    // Check if workspace exists for today
    const { data: existingWorkspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .eq('isDemo', true)
      .eq('date_key', todayKey)
      .single();

    if (workspaceError && workspaceError.code !== 'PGRST116') {
      console.error('Error checking workspace:', workspaceError);
      throw workspaceError;
    }

    if (existingWorkspace) {
      console.log('DEMO_WS_READY: Demo workspace exists:', existingWorkspace.id);
      return existingWorkspace;
    }

    // Create new demo workspace for today
    console.log('DEMO_WS_READY: Creating demo workspace...');
    const { data: newWorkspace, error: createError } = await supabase
      .from('workspaces')
      .insert({
        user_id: userId,
        name: `Demo Workspace - ${todayKey}`,
        description: 'FlowState Demo Workspace',
        isDemo: true,
        date_key: todayKey,
        seededAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating demo workspace:', createError);
      throw createError;
    }

    console.log('DEMO_WS_READY: Demo workspace created:', newWorkspace.id);
    return newWorkspace;

  } catch (error) {
    console.error('DEMO_WS_READY: Error ensuring demo workspace:', error);
    throw error;
  }
};

// Seed demo workspace with realistic data
const seedDemoWorkspace = async (workspaceId, userId) => {
  try {
    console.log('DEMO_SEEDED: Starting workspace seeding...');
    
    const today = new Date();
    const timezone = DEMO_CONFIG.TIMEZONE;
    
    // Sample tasks with realistic data
    const sampleTasks = [
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Finish landing page hero',
        description: 'Complete the hero section design and copy for the DXB funnel project',
        status: 'In Progress',
        priority_matrix: 'Priority 1. Important & Urgent',
        do_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
        deadline_date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_important: true,
        is_urgent: true,
        dependency_report: 'Actionable',
        estimated_hours: 0.75, // 45 minutes
        tags: ['project', 'dxb-funnel', 'design'],
        notes: 'Need to finalize copy and get stakeholder approval'
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Book eye checkup with Dr. Shah (Bandra)',
        description: 'Schedule annual eye examination at Dr. Shah\'s clinic in Bandra',
        status: 'Next',
        priority_matrix: 'Priority 2. Important & Not Urgent',
        do_date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
        is_important: true,
        is_urgent: false,
        dependency_report: 'Actionable',
        estimated_hours: 0.5, // 30 minutes
        tags: ['health', 'appointment', 'personal'],
        notes: 'Call during business hours 9 AM - 6 PM'
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Weekly finance review',
        description: 'Review weekly expenses, budget tracking, and investment portfolio',
        status: 'Next',
        priority_matrix: 'Priority 2. Important & Not Urgent',
        do_date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        is_important: true,
        is_urgent: false,
        dependency_report: 'Actionable',
        estimated_hours: 0.42, // 25 minutes
        tags: ['finance', 'weekly', 'review'],
        notes: 'Recurring weekly task - every Friday'
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Call vendor about laptop repair',
        description: 'Follow up with vendor about laptop repair status and timeline',
        status: 'Next',
        priority_matrix: 'Priority 3. Not Important & Urgent',
        do_date: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        is_important: false,
        is_urgent: true,
        dependency_report: 'Actionable',
        estimated_hours: 0.17, // 10 minutes
        tags: ['errand', 'repair', 'vendor'],
        notes: 'Context: Call - Need phone access'
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Deep work: write Weekly Review doc',
        description: 'Complete weekly review document with accomplishments and next week planning',
        status: 'Next',
        priority_matrix: 'Priority 2. Important & Not Urgent',
        do_date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days from now
        is_important: true,
        is_urgent: false,
        dependency_report: 'Actionable',
        estimated_hours: 1.0, // 60 minutes
        tags: ['deep-work', 'review', 'planning'],
        notes: 'Context: Deep Work - Need focused time'
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Grocery run (Errand)',
        description: 'Weekly grocery shopping for household essentials',
        status: 'Inbox',
        priority_matrix: 'Priority 4. Low',
        do_date: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days from now
        is_important: false,
        is_urgent: false,
        dependency_report: 'Actionable',
        estimated_hours: 0.5, // 30 minutes
        tags: ['errand', 'shopping', 'weekly'],
        notes: 'Weekend task - can be flexible'
      }
    ];

    // Sample habits
    const sampleHabits = [
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Walk 30 mins',
        description: 'Daily 30-minute walk for physical health',
        frequency: 'daily',
        target_count: 1,
        current_streak: 7,
        longest_streak: 15,
        is_active: true
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Strength workout',
        description: 'Strength training workout 3 times per week',
        frequency: 'weekly',
        target_count: 3,
        current_streak: 2,
        longest_streak: 8,
        is_active: true
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Read 20 mins',
        description: 'Daily reading for personal development',
        frequency: 'daily',
        target_count: 1,
        current_streak: 5,
        longest_streak: 20,
        is_active: true
      }
    ];

    // Sample journal entries
    const sampleJournalEntries = [
      {
        user_id: userId,
        workspace_id: workspaceId,
        title: 'Great progress on DXB project',
        content: 'Made significant progress on the DXB funnel landing page. The hero section is coming together nicely. Team collaboration is excellent and we\'re on track for the deadline.',
        mood: 'happy',
        tags: ['work', 'progress', 'team'],
        is_private: false
      },
      {
        user_id: userId,
        workspace_id: workspaceId,
        title: 'Weekly reflection',
        content: 'What went well: Completed all high-priority tasks, maintained exercise routine, had productive team meetings.\n\nTo improve: Better time management for deep work sessions, reduce context switching.',
        mood: 'thoughtful',
        tags: ['reflection', 'weekly', 'improvement'],
        is_private: false
      }
    ];

    // Insert tasks
    const { error: tasksError } = await supabase
      .from('tasks')
      .insert(sampleTasks);

    if (tasksError) {
      console.error('Error inserting tasks:', tasksError);
    } else {
      console.log('DEMO_SEEDED: Tasks inserted successfully');
    }

    // Insert habits
    const { error: habitsError } = await supabase
      .from('habits')
      .insert(sampleHabits);

    if (habitsError) {
      console.error('Error inserting habits:', habitsError);
    } else {
      console.log('DEMO_SEEDED: Habits inserted successfully');
    }

    // Insert journal entries
    const { error: journalError } = await supabase
      .from('journal_entries')
      .insert(sampleJournalEntries);

    if (journalError) {
      console.error('Error inserting journal entries:', journalError);
    } else {
      console.log('DEMO_SEEDED: Journal entries inserted successfully');
    }

    // Create habit logs for the last 30 days (realistic pattern)
    const habitLogs = [];
    const habits = await supabase.from('habits').select('id').eq('workspace_id', workspaceId);
    
    if (habits.data) {
      for (const habit of habits.data) {
        for (let i = 0; i < 30; i++) {
          const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
          
          // Create realistic completion patterns
          let completed = false;
          if (habit.id === habits.data[0].id) { // Walk - daily
            completed = Math.random() > 0.2; // 80% completion rate
          } else if (habit.id === habits.data[1].id) { // Strength - 3x/week
            const dayOfWeek = date.getDay();
            completed = [1, 3, 5].includes(dayOfWeek) && Math.random() > 0.3; // Mon, Wed, Fri
          } else if (habit.id === habits.data[2].id) { // Read - daily
            completed = Math.random() > 0.15; // 85% completion rate
          }

          if (completed) {
            habitLogs.push({
              habit_id: habit.id,
              user_id: userId,
              completed_at: date.toISOString(),
              notes: 'Demo completion',
              created_at: date.toISOString()
            });
          }
        }
      }

      if (habitLogs.length > 0) {
        const { error: logsError } = await supabase
          .from('habit_logs')
          .insert(habitLogs);

        if (logsError) {
          console.error('Error inserting habit logs:', logsError);
        } else {
          console.log('DEMO_SEEDED: Habit logs inserted successfully');
        }
      }
    }

    console.log('DEMO_SEEDED: Workspace seeding completed');

  } catch (error) {
    console.error('DEMO_SEEDED: Error seeding workspace:', error);
    throw error;
  }
};

// Create demo token for fallback
const createDemoToken = (workspaceId) => {
  const payload = {
    workspaceId,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    type: 'demo'
  };
  
  const token = crypto
    .createHmac('sha256', DEMO_CONFIG.JWT_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  return Buffer.from(JSON.stringify({ payload, token })).toString('base64');
};

// Verify demo token
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

// Main function to ensure demo user and workspace
const ensureDemoUserAndWorkspace = async () => {
  try {
    const user = await ensureDemoUser();
    const workspace = await ensureDemoWorkspace(user.id);
    
    // Check if workspace needs seeding
    if (!workspace.seededAt) {
      await seedDemoWorkspace(workspace.id, user.id);
      
      // Update workspace as seeded
      await supabase
        .from('workspaces')
        .update({ seededAt: new Date().toISOString() })
        .eq('id', workspace.id);
    }
    
    return { userId: user.id, workspaceId: workspace.id };
  } catch (error) {
    console.error('Error ensuring demo user and workspace:', error);
    throw error;
  }
};

module.exports = {
  ensureDemoUser,
  ensureDemoWorkspace,
  seedDemoWorkspace,
  createDemoToken,
  verifyDemoToken,
  ensureDemoUserAndWorkspace,
  DEMO_CONFIG
};
