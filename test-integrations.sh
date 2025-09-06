#!/bin/bash

# LifeOS Integration Test Script
echo "🧪 Testing LifeOS Integration System"
echo "=================================="
echo ""

# Test Backend Health
echo "1. Testing Backend Health..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not responding"
    exit 1
fi

# Test Integration List
echo "2. Testing Integration List..."
response=$(curl -s http://localhost:3001/api/integrations/list)
if echo "$response" | grep -q "google-calendar"; then
    echo "✅ Integration list endpoint working"
else
    echo "❌ Integration list endpoint failed"
    exit 1
fi

# Test Apple Reminders
echo "3. Testing Apple Reminders..."
if curl -s http://localhost:3001/api/integrations/apple/reminders > /dev/null; then
    echo "✅ Apple Reminders endpoint working"
else
    echo "❌ Apple Reminders endpoint failed"
    exit 1
fi

# Test Frontend
echo "4. Testing Frontend..."
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo "✅ Frontend server is running"
else
    echo "❌ Frontend server is not responding"
    exit 1
fi

echo ""
echo "🎉 All tests passed!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Integrations: http://localhost:3000/integrations"
echo "   Backend API: http://localhost:3001/api/integrations/list"
echo ""
echo "📊 Integration Status:"
echo "   ✅ Apple Reminders: Available (mock data)"
echo "   ⚙️  Google Calendar: Setup required"
echo "   ⚙️  Gmail: Setup required"
echo "   ⚙️  Todoist: Setup required"
echo ""
echo "🚀 Ready to test!"
