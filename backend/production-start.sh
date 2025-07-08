#!/bin/bash

# Production Deployment Script for Pickleball Love All
# Handles database migrations and service startup

set -e

echo "🎾 PickleballLoveAll Production Deployment"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running in production environment
if [ "$NODE_ENV" != "production" ]; then
    print_warning "NODE_ENV is not set to 'production'. Current: $NODE_ENV"
fi

# Wait for database to be ready
print_status "Waiting for database connection..."
timeout=30
counter=0

until node -e "
const { AppDataSource } = require('./dist/data-source');
AppDataSource.initialize()
  .then(() => { console.log('Database connected'); process.exit(0); })
  .catch(() => process.exit(1));
" || [ $counter -eq $timeout ]; do
    counter=$((counter + 1))
    print_status "Waiting for database... ($counter/$timeout)"
    sleep 2
done

if [ $counter -eq $timeout ]; then
    print_error "Database connection timeout. Please check your database configuration."
    exit 1
fi

print_success "Database connection established"

# Run database migrations
print_status "Running database migrations..."
if npm run migration:run; then
    print_success "Database migrations completed successfully"
else
    print_error "Database migration failed"
    exit 1
fi

# Verify email configuration (non-blocking)
print_status "Testing email configuration..."
if curl -f http://localhost:3000/test/test-email 2>/dev/null; then
    print_success "Email configuration is working"
else
    print_warning "Email configuration test failed - email features may not work"
    print_warning "Please verify SMTP settings: SMTP_HOST, SMTP_USER, SMTP_PASS"
fi

print_success "Production deployment completed successfully!"
print_status "Server is ready to handle requests"

# Start the application
print_status "Starting the application..."
exec node dist/start.js
