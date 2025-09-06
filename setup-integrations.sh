#!/bin/bash

# LifeOS Integration Setup Script
# This script helps set up integrations step by step

echo "🚀 LifeOS Integration Setup"
echo "=========================="
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/env-template-integrations.txt backend/.env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please edit backend/.env with your actual API keys"
    echo ""
fi

# Function to test an integration
test_integration() {
    local integration_name=$1
    local endpoint=$2
    
    echo "🧪 Testing $integration_name integration..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001$endpoint")
    
    if [ "$response" = "200" ]; then
        echo "✅ $integration_name integration is working"
    else
        echo "❌ $integration_name integration failed (HTTP $response)"
    fi
    echo ""
}

# Function to check if backend is running
check_backend() {
    echo "🔍 Checking if backend server is running..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/api/health")
    
    if [ "$response" = "200" ]; then
        echo "✅ Backend server is running"
        return 0
    else
        echo "❌ Backend server is not running"
        echo "Please start the backend server with: cd backend && node server.js"
        return 1
    fi
}

# Main setup process
echo "🔧 Integration Setup Options:"
echo "1. Test existing integrations"
echo "2. Set up Google Calendar integration"
echo "3. Set up Apple Reminders integration"
echo "4. Set up Gmail integration"
echo "5. Set up Todoist integration"
echo "6. View integration status"
echo ""

read -p "Choose an option (1-6): " choice

case $choice in
    1)
        echo "🧪 Testing existing integrations..."
        echo ""
        
        if check_backend; then
            test_integration "Apple Reminders" "/api/integrations/apple-reminders/status"
            test_integration "Health Check" "/api/health"
        fi
        ;;
    2)
        echo "📅 Setting up Google Calendar integration..."
        echo ""
        echo "To set up Google Calendar integration:"
        echo "1. Go to Google Cloud Console (https://console.cloud.google.com/)"
        echo "2. Create a new project or select existing one"
        echo "3. Enable Google Calendar API"
        echo "4. Create OAuth 2.0 credentials"
        echo "5. Add the following to your backend/.env:"
        echo "   GOOGLE_CLIENT_ID=your-client-id"
        echo "   GOOGLE_CLIENT_SECRET=your-client-secret"
        echo "   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/google/callback"
        echo ""
        echo "6. Restart the backend server"
        ;;
    3)
        echo "🍎 Setting up Apple Reminders integration..."
        echo ""
        echo "Apple Reminders integration is already implemented!"
        echo "It works by detecting Apple devices and providing mock functionality."
        echo ""
        echo "To test:"
        echo "1. Make sure backend is running"
        echo "2. Run: curl http://localhost:3001/api/integrations/apple-reminders/status"
        ;;
    4)
        echo "📧 Setting up Gmail integration..."
        echo ""
        echo "To set up Gmail integration:"
        echo "1. Go to Google Cloud Console"
        echo "2. Enable Gmail API"
        echo "3. Create OAuth 2.0 credentials with Gmail scope"
        echo "4. Add credentials to backend/.env"
        echo "5. Restart backend server"
        ;;
    5)
        echo "✅ Setting up Todoist integration..."
        echo ""
        echo "To set up Todoist integration:"
        echo "1. Go to Todoist Developer Console"
        echo "2. Create a new app"
        echo "3. Get your client ID and secret"
        echo "4. Add to backend/.env:"
        echo "   TODOIST_CLIENT_ID=your-client-id"
        echo "   TODOIST_CLIENT_SECRET=your-client-secret"
        echo "5. Restart backend server"
        ;;
    6)
        echo "📊 Integration Status:"
        echo ""
        
        if check_backend; then
            echo "Available integrations:"
            echo "✅ Apple Reminders - Mock implementation"
            echo "⚠️  Google Calendar - Requires OAuth setup"
            echo "⚠️  Gmail - Requires OAuth setup"
            echo "⚠️  Todoist - Requires API setup"
            echo ""
            echo "To see detailed status, run:"
            echo "curl http://localhost:3001/api/integrations/apple-reminders/status"
        fi
        ;;
    *)
        echo "Invalid option. Please run the script again."
        ;;
esac

echo ""
echo "🎉 Integration setup complete!"
echo "For more help, check the documentation in the docs/ folder."
