#!/bin/bash

echo "🚀 Deploying latest tournament fixes to production..."

# Build the latest code
echo "📦 Building latest code..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    
    # Display the timestamp of key files
    echo "📅 File timestamps after build:"
    ls -la dist/controllers/tournamentController.js
    ls -la dist/services/BracketService.js
    ls -la dist/db-manager.js
    
    echo ""
    echo "🔧 Next steps for production deployment:"
    echo "1. Copy the dist/ folder to your production server"
    echo "2. Restart the production Node.js process"
    echo "3. Check the server logs for any errors"
    echo ""
    echo "💡 Key changes included:"
    echo "- Organizer not auto-added as participant"
    echo "- Tournament can start with any number of participants"
    echo "- Join/leave returns updated tournament data"
    echo "- Bracket service handles 0-1 participants gracefully"
    
else
    echo "❌ Build failed - please fix compilation errors first"
    exit 1
fi
