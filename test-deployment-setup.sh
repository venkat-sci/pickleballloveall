#!/bin/bash

echo "🧪 Testing PickleballLoveAll Deployment Setup"
echo "=============================================="

# Test Docker builds
echo "📦 Testing Backend Docker build..."
cd backend
if docker build -t pickleballloveall-backend-test .; then
    echo "✅ Backend Docker build successful"
else
    echo "❌ Backend Docker build failed"
    exit 1
fi

echo "📦 Testing Frontend Docker build..."
cd ../frontend
if docker build -t pickleballloveall-frontend-test .; then
    echo "✅ Frontend Docker build successful"
else
    echo "❌ Frontend Docker build failed"
    exit 1
fi

cd ..

echo "📋 Testing docker-compose configuration..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ Docker-compose configuration valid"
else
    echo "❌ Docker-compose configuration invalid"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your deployment setup is ready."
echo ""
echo "Next steps:"
echo "1. Push your code to Git repository"
echo "2. Follow the COOLIFY_DEPLOYMENT_GUIDE.md"
echo "3. Deploy to Coolify"

# Cleanup test images
docker rmi pickleballloveall-backend-test pickleballloveall-frontend-test 2>/dev/null
