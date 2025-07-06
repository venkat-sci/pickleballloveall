#!/bin/bash

# Test deployment configuration

echo "🔍 Testing Deployment Configuration..."

# Test if API URL is accessible
API_URL="http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api"
FRONTEND_URL="https://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"

echo "Testing API health endpoint..."
curl -f "$API_URL/health" || echo "❌ API health check failed"

echo -e "\nTesting CORS configuration..."
curl -H "Origin: $FRONTEND_URL" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     "$API_URL/auth/register" -v

echo -e "\n🔍 Checking frontend build..."
if [ -d "frontend/dist" ]; then
    echo "✅ Frontend build directory exists"
    
    # Check if config file contains localhost
    if grep -r "localhost:3001" frontend/dist/ 2>/dev/null; then
        echo "❌ Frontend still contains localhost:3001 references"
        echo "🔧 Run: docker-compose -f docker-compose.app.yml build --no-cache frontend"
    else
        echo "✅ No localhost:3001 references found in frontend build"
    fi
else
    echo "❌ Frontend build directory not found"
fi

echo -e "\n🔍 Environment Variable Check:"
echo "VITE_API_URL should be: $API_URL"
echo "VITE_WS_URL should be: wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"
echo "CORS_ORIGIN should be: $FRONTEND_URL"

echo -e "\n✅ Deployment test completed!"
