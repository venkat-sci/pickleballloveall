#!/bin/bash

echo "🔍 Coolify Deployment Verification for pickleballloveall.com"
echo "=========================================================="
echo ""

echo "📋 Expected Configuration:"
echo "Frontend URL: https://pickleballloveall.com"
echo "Backend URL:  http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"
echo ""

echo "1. Testing backend health..."
BACKEND_HEALTH=$(curl -s -w "HTTP_CODE:%{http_code}" "http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/health" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

if [ "$BACKEND_HEALTH" = "200" ]; then
    echo "✅ Backend is healthy (HTTP $BACKEND_HEALTH)"
else
    echo "❌ Backend health check failed (HTTP $BACKEND_HEALTH)"
fi

echo ""
echo "2. Testing frontend deployment..."
FRONTEND_STATUS=$(curl -s -w "HTTP_CODE:%{http_code}" "https://pickleballloveall.com" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend is accessible (HTTP $FRONTEND_STATUS)"
else
    echo "❌ Frontend not accessible (HTTP $FRONTEND_STATUS)"
fi

echo ""
echo "3. Checking if frontend uses correct API URL..."
FRONTEND_JS=$(curl -s "https://pickleballloveall.com" | grep -o 'assets/index-[^"]*\.js' | head -1)

if [ -n "$FRONTEND_JS" ]; then
    echo "📦 Found JS bundle: $FRONTEND_JS"
    
    BUNDLE_CONTENT=$(curl -s "https://pickleballloveall.com/$FRONTEND_JS")
    
    if echo "$BUNDLE_CONTENT" | grep -q "qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"; then
        echo "✅ Correct backend URL found in frontend bundle!"
        
        if echo "$BUNDLE_CONTENT" | grep -q "localhost:3001"; then
            echo "⚠️  Still contains localhost:3001 (old references)"
        else
            echo "✅ No localhost:3001 found - GOOD!"
        fi
    else
        echo "❌ Backend URL NOT found in frontend bundle"
        echo "   This means Coolify deployment needs to be rebuilt with environment variables"
    fi
else
    echo "❌ Could not find JavaScript bundle"
fi

echo ""
echo "🚀 Next Steps for Coolify:"
echo "=========================="

if echo "$BUNDLE_CONTENT" | grep -q "qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"; then
    echo "1. ✅ Your deployment is CORRECT! Clear browser cache:"
    echo "   • Hard refresh: Ctrl+Shift+R (Chrome/Firefox)"
    echo "   • Clear all site data for pickleballloveall.com"
    echo "   • Test in incognito/private window"
else
    echo "1. 🔄 In Coolify, REBUILD your frontend service:"
    echo "   • Go to your frontend service"
    echo "   • Click 'Deploy' or 'Rebuild'"
    echo "   • Make sure environment variables are set BEFORE building"
    echo "   • Wait for build to complete"
    echo ""
    echo "2. 🔍 Verify environment variables in Coolify:"
    echo "   Frontend service needs:"
    echo "   VITE_API_URL=http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api"
    echo "   VITE_ENVIRONMENT=production"
    echo "   VITE_WS_URL=wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"
fi

echo ""
