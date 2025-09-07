// Test environment variables
export default function handler(req, res) {
  res.status(200).json({
    success: true,
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'Set' : 'Not set',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI ? 'Set' : 'Not set'
    }
  });
}
