#!/bin/bash

# Quick Start Script for Pickleball Love All Backend
# This script handles the complete setup and deployment

set -e

echo "🎾 Pickleball Love All - Quick Start"
echo "===================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_warning "Please run this script from the backend directory"
    exit 1
fi

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Complete setup (install, build, setup DB, start server)"
echo "2) Just build and start server"
echo "3) Setup database only"
echo "4) Start server only"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_status "Starting complete setup..."
        
        print_status "Installing dependencies..."
        npm ci
        
        print_status "Building application..."
        npm run build
        
        print_status "Setting up database..."
        npm run db reset
        
        print_status "Starting server..."
        print_success "Setup complete! Server will start now..."
        npm run serve
        ;;
    2)
        print_status "Building and starting server..."
        npm run deploy
        ;;
    3)
        print_status "Setting up database..."
        npm run db reset
        print_success "Database setup complete!"
        ;;
    4)
        print_status "Starting server..."
        npm run serve
        ;;
    *)
        print_warning "Invalid choice. Please run the script again."
        exit 1
        ;;
esac
