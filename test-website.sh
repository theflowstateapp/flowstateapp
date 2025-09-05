#!/bin/bash

# LifeOS Website Functionality Test
echo "🧪 Testing LifeOS Website Functionality..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected="$3"
    
    echo -n "Testing $name... "
    
    if curl -s "$url" | grep -q "$expected"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((TESTS_FAILED++))
    fi
}

# Test API endpoints
echo -e "\n${BLUE}Testing API Endpoints:${NC}"
test_endpoint "Backend Health" "http://localhost:3001/api/health" "healthy"
test_endpoint "Frontend Health Proxy" "http://localhost:3000/api/health" "healthy"
test_endpoint "AI Features" "http://localhost:3000/api/ai/features" "success"
test_endpoint "Subscription Plans" "http://localhost:3000/api/payments/subscription-plans" "success"

# Test frontend pages
echo -e "\n${BLUE}Testing Frontend Pages:${NC}"
test_endpoint "Landing Page" "http://localhost:3000" "Life OS - Your Personal Operating System"
test_endpoint "JavaScript Bundle" "http://localhost:3000/static/js/bundle.js" "webpackBootstrap"

# Test user registration
echo -e "\n${BLUE}Testing User Registration:${NC}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@lifeos.com","password":"password123","firstName":"Test","lastName":"User"}')

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
    echo -e "User Registration ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "User Registration ${RED}❌ FAIL${NC}"
    ((TESTS_FAILED++))
fi

# Test AI call
echo -e "\n${BLUE}Testing AI Features:${NC}"
AI_RESPONSE=$(curl -s -X POST http://localhost:3000/api/openai \
  -H "Content-Type: application/json" \
  -d '{"featureType":"goal_analysis","prompt":"Test goal","context":{}}')

if echo "$AI_RESPONSE" | grep -q "success\|mock"; then
    echo -e "AI Feature Call ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "AI Feature Call ${RED}❌ FAIL${NC}"
    ((TESTS_FAILED++))
fi

# Summary
echo -e "\n${BLUE}Test Summary:${NC}"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! LifeOS is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the issues above.${NC}"
    exit 1
fi
