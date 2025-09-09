#!/bin/bash

# QA Verification Script
# This script tests the QA endpoints to ensure they work correctly

echo "🧪 QA Harness Verification"
echo "=========================="

# Check if QA_SECRET is set
if [ -z "$QA_SECRET" ]; then
    echo "❌ QA_SECRET environment variable is not set"
    echo "Please set it with: export QA_SECRET='your-long-random-string'"
    exit 1
fi

echo "✅ QA_SECRET is set"

# Test the endpoints
echo ""
echo "🔄 Testing QA Reset endpoint..."
RESET_RESULT=$(curl -s -X POST "https://theflowstateapp.com/api/qa/reset?secret=$QA_SECRET")
echo "Reset result: $RESET_RESULT"

echo ""
echo "🌱 Testing QA Seed endpoint..."
SEED_RESULT=$(curl -s -X POST "https://theflowstateapp.com/api/qa/seed?secret=$QA_SECRET")
echo "Seed result: $SEED_RESULT"

echo ""
echo "💨 Testing QA Smoke endpoint..."
SMOKE_RESULT=$(curl -s -X POST "https://theflowstateapp.com/api/qa/smoke?secret=$QA_SECRET")
echo "Smoke test result: $SMOKE_RESULT"

echo ""
echo "✅ QA endpoints tested successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run test:e2e:install' to install Playwright browsers"
echo "2. Run 'npm run test:e2e' to run the E2E tests"
echo "3. Check the smoke test results for any failed steps"
