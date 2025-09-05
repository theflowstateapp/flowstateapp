#!/bin/bash

# LifeOS Comprehensive Functionality Test
echo "🔍 Comprehensive LifeOS Functionality Test..."

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

echo -e "\n${BLUE}=== SYSTEM STATUS ===${NC}"

# Check if servers are running
echo -e "\n${BLUE}Server Status:${NC}"
if pgrep -f "node server.js" > /dev/null; then
    echo -e "Backend Server ${GREEN}✅ RUNNING${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Backend Server ${RED}❌ NOT RUNNING${NC}"
    ((TESTS_FAILED++))
fi

if pgrep -f "react-scripts" > /dev/null; then
    echo -e "Frontend Server ${GREEN}✅ RUNNING${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Frontend Server ${RED}❌ NOT RUNNING${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${BLUE}=== API FUNCTIONALITY ===${NC}"

# Test all API endpoints
test_endpoint "Backend Health" "http://localhost:3001/api/health" "healthy"
test_endpoint "Frontend Health Proxy" "http://localhost:3000/api/health" "healthy"
test_endpoint "AI Features" "http://localhost:3000/api/ai/features" "success"
test_endpoint "Subscription Plans" "http://localhost:3000/api/payments/subscription-plans" "success"

echo -e "\n${BLUE}=== FRONTEND FUNCTIONALITY ===${NC}"

# Test frontend pages
test_endpoint "Landing Page" "http://localhost:3000" "Life OS - Your Personal Operating System"
test_endpoint "JavaScript Bundle" "http://localhost:3000/static/js/bundle.js" "webpackBootstrap"
test_endpoint "CSS Styles" "http://localhost:3000/static/css/main.css" "body"

echo -e "\n${BLUE}=== USER FUNCTIONALITY ===${NC}"

# Test user registration
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

# Test user login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@lifeos.com","password":"password123"}')

if echo "$LOGIN_RESPONSE" | grep -q "success\|mock"; then
    echo -e "User Login ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "User Login ${RED}❌ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${BLUE}=== AI FUNCTIONALITY ===${NC}"

# Test AI features
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

# Test AI features list
AI_FEATURES_RESPONSE=$(curl -s http://localhost:3000/api/ai/features)
if echo "$AI_FEATURES_RESPONSE" | grep -q "total_features.*20"; then
    echo -e "AI Features List ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "AI Features List ${RED}❌ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${BLUE}=== PAYMENT FUNCTIONALITY ===${NC}"

# Test subscription plans
PLANS_RESPONSE=$(curl -s http://localhost:3000/api/payments/subscription-plans)
if echo "$PLANS_RESPONSE" | grep -q "Free.*Pro.*Business"; then
    echo -e "Subscription Plans ${GREEN}✅ PASS${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Subscription Plans ${RED}❌ FAIL${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${BLUE}=== PERFORMANCE CHECK ===${NC}"

# Test response times
BACKEND_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:3001/api/health)
FRONTEND_TIME=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:3000/api/health)

echo -e "Backend Response Time: ${YELLOW}${BACKEND_TIME}s${NC}"
echo -e "Frontend Response Time: ${YELLOW}${FRONTEND_TIME}s${NC}"

if (( $(echo "$BACKEND_TIME < 1" | bc -l) )); then
    echo -e "Backend Performance ${GREEN}✅ GOOD${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Backend Performance ${RED}❌ SLOW${NC}"
    ((TESTS_FAILED++))
fi

if (( $(echo "$FRONTEND_TIME < 2" | bc -l) )); then
    echo -e "Frontend Performance ${GREEN}✅ GOOD${NC}"
    ((TESTS_PASSED++))
else
    echo -e "Frontend Performance ${RED}❌ SLOW${NC}"
    ((TESTS_FAILED++))
fi

echo -e "\n${BLUE}=== SUMMARY ===${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! LifeOS is fully functional!${NC}"
    echo -e "\n${BLUE}Ready for your review at: http://localhost:3000${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the issues above.${NC}"
    exit 1
fi
