#!/bin/bash

# LifeOS Google APIs Setup Script
echo "🔧 Setting up Google APIs for LifeOS"
echo "===================================="
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "📋 Creating .env file from template..."
    cp backend/env-template-integrations.txt backend/.env
    echo "✅ Created backend/.env file"
else
    echo "✅ Backend .env file already exists"
fi

echo ""
echo "🔑 Now you need to add your Google API credentials to backend/.env"
echo ""
echo "Please provide the following information:"
echo ""

# Get Google Client ID
read -p "Enter your Google Client ID: " GOOGLE_CLIENT_ID
if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "❌ Google Client ID is required"
    exit 1
fi

# Get Google Client Secret
read -p "Enter your Google Client Secret: " GOOGLE_CLIENT_SECRET
if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ Google Client Secret is required"
    exit 1
fi

echo ""
echo "🔧 Updating backend/.env file..."

# Update the .env file with Google credentials
sed -i.bak "s/GOOGLE_CLIENT_ID=your-google-client-id-here/GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID/" backend/.env
sed -i.bak "s/GOOGLE_CLIENT_SECRET=your-google-client-secret-here/GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET/" backend/.env

# Remove backup file
rm -f backend/.env.bak

echo "✅ Updated Google credentials in backend/.env"
echo ""

# Test the configuration
echo "🧪 Testing Google API configuration..."
cd backend

# Check if the credentials are properly set
if grep -q "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" .env; then
    echo "✅ Google Client ID configured correctly"
else
    echo "❌ Google Client ID not found in .env"
fi

if grep -q "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" .env; then
    echo "✅ Google Client Secret configured correctly"
else
    echo "❌ Google Client Secret not found in .env"
fi

cd ..

echo ""
echo "🎉 Google API setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your backend server: cd backend && node server.js"
echo "2. Test the integration at: http://localhost:3000/integrations"
echo "3. Click 'Setup' on Google Calendar or Gmail"
echo ""
echo "🔗 Useful URLs:"
echo "   Google Cloud Console: https://console.cloud.google.com/"
echo "   OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent"
echo "   Credentials: https://console.cloud.google.com/apis/credentials"
echo ""
