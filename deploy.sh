#!/bin/bash

# LifeOS Quick Deploy Script
# This script helps you test and deploy changes quickly

echo "🚀 LifeOS Deployment Helper"
echo "=========================="
echo ""

# Function to test local setup
test_local() {
    echo "🧪 Testing local setup..."
    
    # Check if backend is running
    if curl -s http://localhost:3001/api/health > /dev/null; then
        echo "✅ Backend server is running"
    else
        echo "❌ Backend server not running. Starting..."
        cd backend && node server.js &
        sleep 3
        echo "✅ Backend server started"
    fi
    
    # Test integration endpoints
    echo "🔍 Testing integration endpoints..."
    
    if curl -s http://localhost:3001/api/integrations/list > /dev/null; then
        echo "✅ Integration list endpoint working"
    else
        echo "❌ Integration list endpoint failed"
        return 1
    fi
    
    if curl -s http://localhost:3001/api/integrations/apple/reminders > /dev/null; then
        echo "✅ Apple Reminders endpoint working"
    else
        echo "❌ Apple Reminders endpoint failed"
        return 1
    fi
    
    echo ""
    echo "🎉 Local testing complete!"
    echo "Visit: http://localhost:3000/integrations"
    echo ""
}

# Function to deploy to production
deploy_production() {
    echo "🚀 Deploying to production..."
    
    # Check if we're in a git repository
    if [ ! -d ".git" ]; then
        echo "❌ Not in a git repository"
        return 1
    fi
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "📝 Committing changes..."
        git add .
        git commit -m "Update integrations and features"
    fi
    
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "🎉 Deployment initiated!"
    echo "Vercel will automatically deploy your changes in 2-3 minutes"
    echo "Check your Vercel dashboard for deployment status"
    echo ""
}

# Function to check deployment status
check_status() {
    echo "📊 Checking deployment status..."
    
    if command -v vercel &> /dev/null; then
        vercel ls
    else
        echo "Vercel CLI not installed. Install with: npm install -g vercel"
        echo "Or check your Vercel dashboard manually"
    fi
}

# Main menu
echo "Choose an option:"
echo "1. Test local setup"
echo "2. Deploy to production"
echo "3. Check deployment status"
echo "4. Quick test + deploy"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        test_local
        ;;
    2)
        deploy_production
        ;;
    3)
        check_status
        ;;
    4)
        echo "🧪 Testing locally first..."
        if test_local; then
            echo ""
            read -p "Local tests passed! Deploy to production? (y/n): " deploy
            if [ "$deploy" = "y" ] || [ "$deploy" = "Y" ]; then
                deploy_production
            else
                echo "Deployment cancelled"
            fi
        else
            echo "❌ Local tests failed. Fix issues before deploying."
        fi
        ;;
    *)
        echo "Invalid option. Please run the script again."
        ;;
esac

echo ""
echo "🎯 Next Steps:"
echo "- Test locally: http://localhost:3000/integrations"
echo "- Deploy: git push origin main"
echo "- Monitor: Vercel dashboard"
echo ""