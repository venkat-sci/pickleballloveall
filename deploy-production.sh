#!/bin/bash

echo "🚀 Deploying pickleballloveall.com with correct production URLs"
echo "=============================================================="
echo ""

echo "📋 Configuration Summary:"
echo "Frontend: https://pickleballloveall.com"
echo "Backend:  http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"
echo ""

echo "🔄 Building with production environment variables..."

# Set environment variables for the build
export VITE_API_URL="http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api"
export VITE_ENVIRONMENT="production"
export VITE_WS_URL="wss://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io"

echo "✅ Environment variables set:"
echo "   VITE_API_URL=$VITE_API_URL"
echo "   VITE_ENVIRONMENT=$VITE_ENVIRONMENT"
echo "   VITE_WS_URL=$VITE_WS_URL"
echo ""

echo "🔨 Building Docker containers with --no-cache..."
docker-compose -f docker-compose.app.yml build --no-cache

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting deployment..."
    docker-compose -f docker-compose.app.yml up -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo ""
        echo "🔍 Verification steps:"
        echo "1. Check if containers are running: docker-compose -f docker-compose.app.yml ps"
        echo "2. Check frontend logs: docker-compose -f docker-compose.app.yml logs frontend"
        echo "3. Check backend logs: docker-compose -f docker-compose.app.yml logs backend"
        echo "4. Test API endpoint: curl -I http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api/health"
        echo ""
        echo "🌐 Your site should now be working at: https://pickleballloveall.com"
        echo "   API calls should go to: http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api"
    else
        echo "❌ Deployment failed!"
        echo "Check logs: docker-compose -f docker-compose.app.yml logs"
    fi
else
    echo "❌ Build failed!"
    echo "Check build logs for errors."
fi
