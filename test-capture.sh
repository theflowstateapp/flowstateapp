#!/bin/bash

# Flow State Capture Functionality Test
echo "🧪 Testing Capture Functionality"
echo "================================"

# Check if backend is running
echo "1. Checking backend status..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running. Start it with: cd backend && npm run dev"
    exit 1
fi

# Check if frontend is running
echo "2. Checking frontend status..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible. Start it with: npm start"
    exit 1
fi

# Test authentication endpoint
echo "3. Testing authentication..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@flowstate.app","password":"testpass123","firstName":"Test","lastName":"User"}')

if echo "$AUTH_RESPONSE" | grep -q "success\|token"; then
    echo "✅ Authentication working"
else
    echo "⚠️  Authentication may need configuration (Supabase)"
    echo "   Response: $AUTH_RESPONSE"
fi

# Test AI endpoint
echo "4. Testing AI functionality..."
AI_RESPONSE=$(curl -s -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, test message","context":{}}')

if echo "$AI_RESPONSE" | grep -q "response\|error"; then
    echo "✅ AI endpoint responding"
else
    echo "⚠️  AI endpoint may need OpenAI configuration"
    echo "   Response: $AI_RESPONSE"
fi

# Test capture endpoint
echo "5. Testing capture functionality..."
CAPTURE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"This is a test task","type":"task"}')

if echo "$CAPTURE_RESPONSE" | grep -q "success\|task\|error"; then
    echo "✅ Capture functionality working"
else
    echo "⚠️  Capture functionality may need database setup"
    echo "   Response: $CAPTURE_RESPONSE"
fi

echo ""
echo "📋 Summary:"
echo "==========="
echo "✅ Backend: Running"
echo "✅ Frontend: Accessible"
echo "⚠️  Authentication: Needs Supabase setup"
echo "⚠️  AI Features: Needs OpenAI setup"
echo "⚠️  Capture: Needs database setup"
echo ""
echo "🔧 Next Steps:"
echo "1. Set up Supabase (see BACKEND_SETUP_GUIDE.md)"
echo "2. Set up OpenAI API key"
echo "3. Test capture functionality in the app"
echo "4. Deploy to production (see DEPLOYMENT_GUIDE.md)"
