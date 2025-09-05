#!/bin/bash

# Flow State Backend Setup Script
echo "🚀 Flow State Backend Setup"
echo "=========================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run: cp env-template.txt .env"
    exit 1
fi

echo "✅ .env file found"

# Check if JWT secrets are set
if grep -q "your_super_secret_jwt_key_change_in_production" .env; then
    echo "⚠️  JWT secrets need to be configured"
    echo "   Run: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
else
    echo "✅ JWT secrets configured"
fi

# Check Supabase configuration
if grep -q "your_supabase_url_here" .env; then
    echo "⚠️  Supabase needs to be configured"
    echo "   1. Go to https://supabase.com"
    echo "   2. Create a new project"
    echo "   3. Get your API keys from Project Settings → API"
    echo "   4. Update SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY in .env"
else
    echo "✅ Supabase configured"
fi

# Check OpenAI configuration
if ! grep -q "OPENAI_API_KEY" .env; then
    echo "⚠️  OpenAI API key not found"
    echo "   1. Go to https://platform.openai.com"
    echo "   2. Create an API key"
    echo "   3. Add OPENAI_API_KEY=sk-your-key-here to .env"
else
    echo "✅ OpenAI API key configured"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Configure Supabase (required for database)"
echo "2. Configure OpenAI (required for AI features)"
echo "3. Run: npm run dev"
echo "4. Test: curl http://localhost:3001/api/health"
echo ""
echo "📖 See BACKEND_SETUP_GUIDE.md for detailed instructions"
