#!/bin/bash

# Supabase Configuration Update Script
echo "🔧 Updating Supabase configuration..."

# Backup the current .env file
cp backend/.env backend/.env.backup
echo "📋 Created backup: backend/.env.backup"

# Update the Supabase configuration
cat > backend/.env << 'EOF'
# Environment Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/lifeos

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-change-this-in-production

# Supabase Configuration
SUPABASE_URL=https://awpqoykarscjyawcaeou.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHFveWthcnNjanlhd2NhZW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDYzNzcsImV4cCI6MjA3MjM4MjM3N30._vJ9mqEFzAZXj_LGOVMuiujcSyAyo2L__tKWxdiDzso
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHFveWthcnNjanlhd2NhZW91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNjM3NywiZXhwIjoyMDcyMzgyMzc3fQ.30bky1YidNJk8fpkYPqO9k5AswAMSxorMZdzbduWA9Y

# OpenAI Configuration (Add your API key here)
OPENAI_API_KEY=your-openai-api-key-here

# Stripe Configuration (Add your keys here)
STRIPE_SECRET_KEY=your-stripe-secret-key-here
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key-here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
ENABLE_FILE_UPLOAD=true
EOF

echo "✅ Supabase configuration updated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Add your OpenAI API key to OPENAI_API_KEY"
echo "2. Add your Stripe keys if you want payment processing"
echo "3. The backend should restart automatically"
echo ""
echo "🔍 Watch the backend terminal for: '✅ Supabase connected successfully'"
echo ""
echo "🚀 Ready to proceed to Step 2: OpenAI Setup!"
