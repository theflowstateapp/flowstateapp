#!/bin/bash

# FlowState Deployment Script
# This script helps prepare your app for deployment

echo "🚀 FlowState Deployment Preparation"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project root directory confirmed"

# Check if backend is running
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend is running on localhost:3001"
else
    echo "⚠️  Backend is not running. Please start it with: cd backend && npm run dev"
fi

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on localhost:3000"
else
    echo "⚠️  Frontend is not running. Please start it with: npm start"
fi

echo ""
echo "📋 Pre-Deployment Checklist:"
echo "============================"

# Check environment variables
echo "🔍 Checking environment configuration..."

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file exists"
    
    # Check for required variables
    if grep -q "SUPABASE_URL" backend/.env; then
        echo "✅ Supabase URL configured"
    else
        echo "❌ Supabase URL missing"
    fi
    
    if grep -q "OPENAI_API_KEY" backend/.env; then
        echo "✅ OpenAI API key configured"
    else
        echo "❌ OpenAI API key missing"
    fi
else
    echo "❌ Backend .env file missing"
fi

# Check if build works
echo ""
echo "🔨 Testing production build..."

if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    echo "Run 'npm run build' to see errors"
fi

echo ""
echo "🌐 Deployment Options:"
echo "======================"
echo "1. Railway (Backend) + Vercel (Frontend) - Recommended"
echo "2. Heroku (Backend) + Netlify (Frontend)"
echo "3. DigitalOcean (Full-stack)"
echo "4. AWS (Advanced users)"

echo ""
echo "💰 Estimated Monthly Costs:"
echo "=========================="
echo "• Domain: $1-2/month"
echo "• Railway Backend: $5/month"
echo "• Vercel Frontend: $0-20/month"
echo "• Supabase: $0-25/month"
echo "• OpenAI: $5-20/month"
echo "• Total: $6-47/month"

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Choose a domain name (e.g., flowstate.app)"
echo "2. Purchase the domain"
echo "3. Set up Railway account"
echo "4. Deploy backend to Railway"
echo "5. Set up Vercel account"
echo "6. Deploy frontend to Vercel"
echo "7. Configure domain DNS"
echo "8. Test production deployment"

echo ""
echo "📚 Helpful Resources:"
echo "===================="
echo "• Railway: https://railway.app"
echo "• Vercel: https://vercel.com"
echo "• Namecheap: https://namecheap.com"
echo "• Deployment Guide: STEP4_DEPLOYMENT_GUIDE.md"

echo ""
echo "🎯 Ready to deploy? Let's start with domain selection!"
