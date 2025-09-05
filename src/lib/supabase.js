import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

// Create Supabase client with fallback for development
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} catch (error) {
  console.warn('Supabase not configured, using mock client');
  // Create a mock client for development
  supabase = {
    auth: {
      signUp: async () => ({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null }),
      signInWithPassword: async () => ({ data: { user: { id: 'mock-user-id', email: 'mock@example.com' } }, error: null }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) })
    })
  }
}

// Helper functions for common operations
export const auth = {
  // Sign up
  signUp: async (email, password, userData = {}) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { data: null, error: { message: 'Invalid email format' } };
    }

    // Validate password strength
    if (!password || password.length < 8) {
      return { data: null, error: { message: 'Password must be at least 8 characters long' } };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in
  signIn: async (email, password) => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { data: null, error: { message: 'Invalid email format' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const db = {
  // Projects
  getProjects: async (userId) => {
    if (!userId || typeof userId !== 'string') {
      return { data: null, error: { message: 'Invalid user ID' } };
    }
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Areas
  getAreas: async (userId) => {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Resources
  getResources: async (userId) => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Archives
  getArchives: async (userId) => {
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Tasks
  getTasks: async (userId) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Inbox items
  getInboxItems: async (userId) => {
    const { data, error } = await supabase
      .from('inbox_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}

export default supabase;

