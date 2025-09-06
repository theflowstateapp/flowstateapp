#!/bin/bash

# LifeOS Frontend Fix Script
echo "🔧 Fixing LifeOS Frontend Server Issues"
echo "======================================="

# Kill all existing processes
echo "1. Cleaning up existing processes..."
pkill -f "react-scripts" 2>/dev/null
pkill -f "npm start" 2>/dev/null
sleep 2

# Clear caches
echo "2. Clearing caches..."
rm -rf node_modules/.cache
rm -rf .eslintcache
npm cache clean --force

# Reinstall dependencies
echo "3. Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Set environment variables
echo "4. Setting up environment..."
export BROWSER=none
export GENERATE_SOURCEMAP=false

# Start the server
echo "5. Starting development server..."
echo "✅ Frontend will be available at: http://localhost:3000"
echo "✅ Backend is running at: http://localhost:3001"
echo "✅ Integration API: http://localhost:3001/api/integrations/list"
echo ""

npm start
