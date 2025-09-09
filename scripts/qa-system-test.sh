#!/bin/bash

# Comprehensive QA System Test Script
# This script tests all QA endpoints and validates the complete system

echo "🧪 QA System Comprehensive Test"
echo "================================"

# Check if QA_SECRET is set
if [ -z "$QA_SECRET" ]; then
    echo "❌ QA_SECRET environment variable is not set"
    echo "Please set it with: export QA_SECRET='your-long-random-string'"
    exit 1
fi

echo "✅ QA_SECRET is set"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local command="$2"
    local expected_field="$3"
    local expected_value="$4"
    
    echo ""
    echo "🔄 Testing: $test_name"
    
    if result=$(eval "$command" 2>/dev/null); then
        if [ -n "$expected_field" ] && [ -n "$expected_value" ]; then
            actual_value=$(echo "$result" | jq -r ".$expected_field // empty")
            if [ "$actual_value" = "$expected_value" ]; then
                echo "✅ PASS: $test_name"
                ((TESTS_PASSED++))
            else
                echo "❌ FAIL: $test_name (expected $expected_field=$expected_value, got $actual_value)"
                ((TESTS_FAILED++))
            fi
        else
            echo "✅ PASS: $test_name"
            ((TESTS_PASSED++))
        fi
    else
        echo "❌ FAIL: $test_name (command failed)"
        ((TESTS_FAILED++))
    fi
}

# Test 1: QA Reset
run_test "QA Reset" \
    "curl -s -X POST 'https://theflowstateapp.com/api/qa/reset?secret=$QA_SECRET'" \
    "ok" "true"

# Test 2: QA Seed
run_test "QA Seed" \
    "curl -s -X POST 'https://theflowstateapp.com/api/qa/seed?secret=$QA_SECRET'" \
    "ok" "true"

# Test 3: QA Smoke Test (original)
run_test "QA Smoke Test" \
    "curl -s -X POST 'https://theflowstateapp.com/api/qa/smoke?secret=$QA_SECRET'" \
    "ok" "true"

# Test 4: QA Run (with storage)
run_test "QA Run with Storage" \
    "curl -s -X POST 'https://theflowstateapp.com/api/qa/run?secret=$QA_SECRET'" \
    "ok" "true"

# Test 5: QA Latest
run_test "QA Latest" \
    "curl -s 'https://theflowstateapp.com/api/qa/latest'" \
    "ok" "true"

# Test 6: QA History
run_test "QA History" \
    "curl -s 'https://theflowstateapp.com/api/qa/history'" \
    "" ""

# Test 7: QA Admin Page (check if it returns HTML)
echo ""
echo "🔄 Testing: QA Admin Page"
if curl -s "https://theflowstateapp.com/api/admin/qa" | grep -q "QA Runs"; then
    echo "✅ PASS: QA Admin Page"
    ((TESTS_PASSED++))
else
    echo "❌ FAIL: QA Admin Page"
    ((TESTS_FAILED++))
fi

# Test 8: Verify data persistence
echo ""
echo "🔄 Testing: Data Persistence"
latest_result=$(curl -s "https://theflowstateapp.com/api/qa/latest")
if echo "$latest_result" | jq -e '.ts' > /dev/null; then
    echo "✅ PASS: Data Persistence (QA run stored)"
    ((TESTS_PASSED++))
else
    echo "❌ FAIL: Data Persistence (no QA run found)"
    ((TESTS_FAILED++))
fi

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "✅ Tests Passed: $TESTS_PASSED"
echo "❌ Tests Failed: $TESTS_FAILED"
echo "📈 Success Rate: $(( TESTS_PASSED * 100 / (TESTS_PASSED + TESTS_FAILED) ))%"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo "🎉 All QA system tests PASSED!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Add QA_SECRET to your GitHub repository secrets"
    echo "2. Push to main branch to trigger the GitHub Action"
    echo "3. Check the admin panel at: https://theflowstateapp.com/api/admin/qa"
    echo "4. Integrate QA banner into your app shell using the examples in api/lib/qa-integration-example.js"
    exit 0
else
    echo ""
    echo "⚠️  Some tests failed. Please check the endpoints and try again."
    exit 1
fi
