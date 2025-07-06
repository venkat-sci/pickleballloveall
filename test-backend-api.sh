#!/bin/bash

# Backend API Test Script for PickleballLoveAll
# Usage: ./test-backend-api.sh
# This script comprehensively tests all backend API endpoints

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BACKEND_URL="http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"
API_BASE="$BACKEND_URL/api"

echo -e "${BLUE}🧪 Testing PickleballLoveAll Backend API${NC}"
echo -e "${BLUE}========================================${NC}"
echo "Backend URL: $BACKEND_URL"
echo "API Base: $API_BASE"
echo ""

# Function to print test results
print_result() {
    local test_name="$1"
    local status="$2"
    local expected="$3"
    
    if [ "$status" = "$expected" ]; then
        echo -e "${GREEN}✅ $test_name: PASS (HTTP $status)${NC}"
    else
        echo -e "${RED}❌ $test_name: FAIL (HTTP $status, expected $expected)${NC}"
    fi
}

# Test 1: Health Check
echo -e "\n${YELLOW}1️⃣ Testing Health Endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" $BACKEND_URL/health)
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | sed '/HTTP_STATUS/d')

echo "Response: $HEALTH_BODY"
print_result "Health Check" "$HEALTH_STATUS" "200"

# Test 2: CORS Check
echo -e "\n${YELLOW}2️⃣ Testing CORS Headers...${NC}"
CORS_RESPONSE=$(curl -s -I -X OPTIONS $API_BASE/auth/login \
    -H "Origin: https://pickleballloveall.com" \
    -H "Access-Control-Request-Method: POST")

if echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin" > /dev/null; then
    echo -e "${GREEN}✅ CORS Headers: PASS${NC}"
else
    echo -e "${RED}❌ CORS Headers: FAIL - Check CORS_ORIGIN in backend${NC}"
fi

# Test 3: API Endpoints Structure
echo -e "\n${YELLOW}3️⃣ Testing API Endpoints...${NC}"

# Generate unique test data
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser$TIMESTAMP@example.com"
TEST_PASSWORD="SecurePassword123!"
TEST_NAME="Test User $TIMESTAMP"

# Test 4: Registration with invalid password
echo -e "\n${YELLOW}4️⃣ Testing Registration (invalid password)...${NC}"
INVALID_REG_RESPONSE=$(curl -s -X POST $API_BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test1@example.com","password":"weak"}' \
  -w "\nHTTP_STATUS:%{http_code}")

INVALID_STATUS=$(echo "$INVALID_REG_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
INVALID_BODY=$(echo "$INVALID_REG_RESPONSE" | sed '/HTTP_STATUS/d')

echo "Response: $INVALID_BODY"
print_result "Invalid Registration" "$INVALID_STATUS" "400"

# Test 5: Registration with valid password
echo -e "\n${YELLOW}5️⃣ Testing Registration (valid password)...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $API_BASE/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$TEST_NAME\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$REGISTER_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$REGISTER_RESPONSE" | sed '/HTTP_STATUS/d')

echo "Response: $RESPONSE_BODY"
print_result "Valid Registration" "$HTTP_STATUS" "201"

if [ "$HTTP_STATUS" = "201" ]; then
    echo -e "${GREEN}✅ Registration successful!${NC}"
    if command -v jq > /dev/null; then
        TOKEN=$(echo "$RESPONSE_BODY" | jq -r '.token // empty')
        USER_ID=$(echo "$RESPONSE_BODY" | jq -r '.user.id // empty')
    else
        # Fallback if jq is not available
        TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        USER_ID=$(echo "$RESPONSE_BODY" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    fi
    
    if [ -n "$TOKEN" ]; then
        echo "Token: ${TOKEN:0:50}..."
        echo "User ID: $USER_ID"
        
        # Test 6: Login
        echo -e "\n${YELLOW}6️⃣ Testing Login...${NC}"
        LOGIN_RESPONSE=$(curl -s -X POST $API_BASE/auth/login \
          -H "Content-Type: application/json" \
          -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
          -w "\nHTTP_STATUS:%{http_code}")
        
        LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
        LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '/HTTP_STATUS/d')
        
        echo "Response: $LOGIN_BODY"
        print_result "Login" "$LOGIN_STATUS" "200"
        
        if [ "$LOGIN_STATUS" = "200" ]; then
            echo -e "${GREEN}✅ Login successful!${NC}"
            
            # Test 7: Authenticated requests
            echo -e "\n${YELLOW}7️⃣ Testing Authenticated Requests...${NC}"
            
            # Test tournaments endpoint
            echo "Testing GET /api/tournaments..."
            TOURNAMENTS_RESPONSE=$(curl -s -X GET $API_BASE/tournaments \
              -H "Authorization: Bearer $TOKEN" \
              -w "\nHTTP_STATUS:%{http_code}")
            
            TOURNAMENTS_STATUS=$(echo "$TOURNAMENTS_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
            print_result "Get Tournaments" "$TOURNAMENTS_STATUS" "200"
            
            # Test players endpoint
            echo "Testing GET /api/players..."
            PLAYERS_RESPONSE=$(curl -s -X GET $API_BASE/players \
              -H "Authorization: Bearer $TOKEN" \
              -w "\nHTTP_STATUS:%{http_code}")
            
            PLAYERS_STATUS=$(echo "$PLAYERS_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
            print_result "Get Players" "$PLAYERS_STATUS" "200"
            
            # Test courts endpoint
            echo "Testing GET /api/courts..."
            COURTS_RESPONSE=$(curl -s -X GET $API_BASE/courts \
              -H "Authorization: Bearer $TOKEN" \
              -w "\nHTTP_STATUS:%{http_code}")
            
            COURTS_STATUS=$(echo "$COURTS_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
            print_result "Get Courts" "$COURTS_STATUS" "200"
            
            # Test matches endpoint
            echo "Testing GET /api/matches..."
            MATCHES_RESPONSE=$(curl -s -X GET $API_BASE/matches \
              -H "Authorization: Bearer $TOKEN" \
              -w "\nHTTP_STATUS:%{http_code}")
            
            MATCHES_STATUS=$(echo "$MATCHES_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
            print_result "Get Matches" "$MATCHES_STATUS" "200"
            
        else
            echo -e "${RED}❌ Login failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ Could not extract token from registration response${NC}"
    fi
    
elif [ "$HTTP_STATUS" = "400" ]; then
    echo -e "${YELLOW}⚠️ Registration failed (validation or user exists)${NC}"
else
    echo -e "${RED}❌ Registration failed${NC}"
fi

# Test 8: Test invalid endpoints
echo -e "\n${YELLOW}8️⃣ Testing Invalid Endpoints...${NC}"
INVALID_ENDPOINT_RESPONSE=$(curl -s -X GET $API_BASE/nonexistent \
  -w "\nHTTP_STATUS:%{http_code}")

INVALID_ENDPOINT_STATUS=$(echo "$INVALID_ENDPOINT_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
print_result "Invalid Endpoint" "$INVALID_ENDPOINT_STATUS" "404"

echo -e "\n${BLUE}🏁 Test Complete!${NC}"
echo -e "\n${BLUE}� Summary:${NC}"
echo "- Backend URL: $BACKEND_URL"
echo "- API Base: $API_BASE"
echo "- Health Status: $(curl -s $BACKEND_URL/health 2>/dev/null | grep -o '"status":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo 'Unknown')"
echo "- Test completed at: $(date)"

echo -e "\n${YELLOW}💡 Frontend Configuration:${NC}"
echo "Set these environment variables in Coolify frontend service:"
echo "VITE_API_URL=$API_BASE"
echo "VITE_WS_URL=wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"
echo "VITE_ENVIRONMENT=production"

echo -e "\n${YELLOW}💡 Backend Configuration:${NC}"
echo "Set this environment variable in Coolify backend service:"
echo "CORS_ORIGIN=https://pickleballloveall.com,http://pickleballloveall.com,https://www.pickleballloveall.com"

echo -e "\n${YELLOW}🔧 Troubleshooting:${NC}"
echo "- If CORS tests fail, add your frontend domain to CORS_ORIGIN"
echo "- If API tests fail, check backend logs in Coolify"
echo "- If health check fails, verify backend service is running"
echo "- For frontend issues, rebuild after setting environment variables"

echo -e "\n${GREEN}🎯 Backend API testing complete!${NC}"
