#!/bin/bash

# Test deployment setup for PickleballLoveAll
# This script validates Docker builds, package.json consistency, and deployment readiness

set -e

echo "🚀 Testing PickleballLoveAll Deployment Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Test 1: Check if required files exist
echo -e "\n${YELLOW}1. Checking required files...${NC}"

required_files=(
    "backend/package.json"
    "backend/Dockerfile"
    "frontend/package.json"
    "frontend/Dockerfile"
    "Dockerfile.backend"
    "Dockerfile.frontend"
    "docker-compose.backend.yml"
    "docker-compose.frontend.yml"
    "docker-compose.app.yml"
    "COOLIFY_DEPLOYMENT_GUIDE.md"
    "ENVIRONMENT_VARIABLES.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found $file"
    else
        print_error "Missing $file"
        exit 1
    fi
done

# Test 2: Validate package.json dependencies
echo -e "\n${YELLOW}2. Validating backend package.json...${NC}"

# Check if TypeScript and build dependencies are in devDependencies
if grep -q '"typescript"' backend/package.json && grep -A 20 '"devDependencies"' backend/package.json | grep -q '"typescript"'; then
    print_status "TypeScript is correctly in devDependencies"
else
    print_error "TypeScript should be in devDependencies"
    exit 1
fi

if grep -q '"@types/cors"' backend/package.json && grep -A 20 '"devDependencies"' backend/package.json | grep -q '"@types/cors"'; then
    print_status "@types/cors is correctly in devDependencies"
else
    print_error "@types/cors should be in devDependencies"
    exit 1
fi

# Check if cors runtime dependency is in dependencies
if grep -q '"cors"' backend/package.json && grep -A 20 '"dependencies"' backend/package.json | grep -q '"cors"'; then
    print_status "cors runtime dependency is correctly in dependencies"
else
    print_error "cors runtime dependency should be in dependencies"
    exit 1
fi

# Test 3: Validate Docker Compose files
echo -e "\n${YELLOW}3. Validating Docker Compose files...${NC}"

compose_files=(
    "docker-compose.backend.yml"
    "docker-compose.frontend.yml"
    "docker-compose.app.yml"
)

for compose_file in "${compose_files[@]}"; do
    if docker-compose -f "$compose_file" config > /dev/null 2>&1; then
        print_status "$compose_file is valid"
    else
        print_error "$compose_file has syntax errors"
        exit 1
    fi
done

# Test 4: Check environment variables documentation
echo -e "\n${YELLOW}4. Checking environment variable documentation...${NC}"

required_env_vars=(
    "DATABASE_URL"
    "JWT_SECRET"
    "NODE_ENV"
    "VITE_API_URL"
)

for env_var in "${required_env_vars[@]}"; do
    if grep -q "$env_var" ENVIRONMENT_VARIABLES.md; then
        print_status "$env_var is documented"
    else
        print_error "$env_var is not documented in ENVIRONMENT_VARIABLES.md"
        exit 1
    fi
done

# Test 5: Check if backend has health endpoint
echo -e "\n${YELLOW}5. Checking health endpoint...${NC}"

if [ -f "backend/src/routes/health.ts" ]; then
    print_status "Health endpoint file exists"
    
    if grep -q "router.get.*health" backend/src/routes/health.ts; then
        print_status "Health endpoint is defined"
    else
        print_error "Health endpoint route not found"
        exit 1
    fi
else
    print_error "Health endpoint file missing"
    exit 1
fi

# Test 6: Check migration setup
echo -e "\n${YELLOW}6. Checking database migration setup...${NC}"

if [ -f "backend/src/scripts/migrate.ts" ]; then
    print_status "Migration script exists"
else
    print_error "Migration script missing"
    exit 1
fi

if [ -d "backend/src/migrations" ]; then
    migration_count=$(ls backend/src/migrations/*.ts 2>/dev/null | wc -l)
    if [ "$migration_count" -gt 0 ]; then
        print_status "Found $migration_count migration files"
    else
        print_warning "No migration files found"
    fi
else
    print_error "Migrations directory missing"
    exit 1
fi

# Test 7: Check if JWT secret is generated
echo -e "\n${YELLOW}7. Checking JWT secret...${NC}"

if grep -q "JWT_SECRET=ef56e9078badfd78b60ea70b9a3d521762dfb5889175b5280dcb704f670a123bd6f782d3a0244eb0db9bf6e2395f610d1d1b3fe50e00ce3f1ae91e5d5bee0b9f" ENVIRONMENT_VARIABLES.md; then
    print_status "Strong JWT secret is documented"
else
    print_error "JWT secret not found or too weak"
    exit 1
fi

echo -e "\n${GREEN}🎉 All deployment setup checks passed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Push your code to your Git repository"
echo "2. Create services in Coolify using the provided Docker Compose files"
echo "3. Set the required environment variables in Coolify"
echo "4. Deploy and monitor the health endpoints"
echo ""
echo "Deployment Guide: COOLIFY_DEPLOYMENT_GUIDE.md"
echo "Environment Variables: ENVIRONMENT_VARIABLES.md"
