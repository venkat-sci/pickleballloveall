#!/bin/bash

echo "🔍 Production Deployment Verification Script"
echo "============================================="
echo ""

echo "1. Testing production site response..."
RESPONSE=$(curl -s -w "HTTP_CODE:%{http_code}" "https://pickleballloveall.com")
HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Site is accessible (HTTP $HTTP_CODE)"
else
    echo "❌ Site not accessible (HTTP $HTTP_CODE)"
    exit 1
fi

echo ""
echo "2. Checking for environment variables in production build..."

# Try to find JavaScript bundle
BUNDLE_CHECK=$(curl -s "https://pickleballloveall.com" | grep -o 'assets/index-[^"]*\.js' | head -1)

if [ -n "$BUNDLE_CHECK" ]; then
    echo "📦 Found JS bundle: $BUNDLE_CHECK"
    
    echo ""
    echo "3. Checking API URL in production bundle..."
    BUNDLE_CONTENT=$(curl -s "https://pickleballloveall.com/$BUNDLE_CHECK")
    
    if echo "$BUNDLE_CONTENT" | grep -q "localhost:3001"; then
        echo "❌ PROBLEM: localhost:3001 still found in production bundle!"
        echo "   This means the deployment hasn't been updated with the fixed build."
    else
        echo "✅ No localhost:3001 found in production bundle"
    fi
    
    if echo "$BUNDLE_CONTENT" | grep -q "pickleballloveall.com"; then
        echo "✅ Production domain found in bundle"
    else
        echo "⚠️  Production domain not found in bundle"
    fi
else
    echo "❌ Could not find JavaScript bundle"
fi

echo ""
echo "4. Browser Cache Debug Instructions:"
echo "======================================"
echo ""
echo "If localhost:3001 was found above, you need to:"
echo "1. 🔄 Rebuild and redeploy with the fixes we made"
echo "2. 🧹 Clear browser cache completely"
echo "3. 🕵️  Test in incognito/private window"
echo ""
echo "If localhost:3001 was NOT found above but you still see it:"
echo "1. 🧹 Hard refresh: Ctrl+Shift+R (Chrome/Firefox) or Cmd+Shift+R (Safari)"
echo "2. 🧹 Clear all browser data for pickleballloveall.com"
echo "3. 🕵️  Test in incognito/private window"
echo ""

echo "5. Manual verification steps:"
echo "=============================="
echo "• Open https://pickleballloveall.com in incognito mode"
echo "• Open DevTools (F12) > Network tab"
echo "• Try to register/login"
echo "• Check if API calls go to localhost:3001 or production"
echo ""
