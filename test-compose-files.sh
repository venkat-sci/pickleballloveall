#!/bin/bash

echo "🧪 Testing Docker Compose Files"
echo "================================"

# Set test environment variables
export DATABASE_URL="postgresql://postgres:test123@localhost:5432/pickleballloveall"
export JWT_SECRET="ef56e9078badfd78b60ea70b9a3d521762dfb5889175b5280dcb704f670a123bd6f782d3a0244eb0db9bf6e2395f610d1d1b3fe50e00ce3f1ae91e5d5bee0b9f"
export CORS_ORIGIN="http://localhost:80"
export VITE_API_URL="http://localhost:3000"

echo "📋 Testing backend compose file..."
if docker-compose -f docker-compose.backend.yml config > /dev/null 2>&1; then
    echo "✅ docker-compose.backend.yml is valid"
else
    echo "❌ docker-compose.backend.yml has errors"
    docker-compose -f docker-compose.backend.yml config
    exit 1
fi

echo "📋 Testing frontend compose file..."
if docker-compose -f docker-compose.frontend.yml config > /dev/null 2>&1; then
    echo "✅ docker-compose.frontend.yml is valid"
else
    echo "❌ docker-compose.frontend.yml has errors"
    docker-compose -f docker-compose.frontend.yml config
    exit 1
fi

echo "📋 Testing combined app compose file..."
if docker-compose -f docker-compose.app.yml config > /dev/null 2>&1; then
    echo "✅ docker-compose.app.yml is valid"
else
    echo "❌ docker-compose.app.yml has errors"
    docker-compose -f docker-compose.app.yml config
    exit 1
fi

echo ""
echo "🎉 All Docker Compose files are valid!"
echo ""
echo "📋 Available compose files for Coolify:"
echo "  • docker-compose.backend.yml  (Backend only)"
echo "  • docker-compose.frontend.yml (Frontend only)" 
echo "  • docker-compose.app.yml      (Both services)"
