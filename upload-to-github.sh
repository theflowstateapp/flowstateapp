#!/bin/bash

# FlowState GitHub Upload Script
# This script will upload your FlowState code to GitHub

echo "🚀 FlowState GitHub Upload Script"
echo "=================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the FlowState project root directory"
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add remote origin
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/theflowstateapp/flowstateapp.git

# Add all files
echo "📦 Adding all files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: FlowState AI-powered life management app

- Complete React frontend with Tailwind CSS
- Node.js/Express backend with all integrations
- Supabase database integration
- OpenAI AI integration
- Apple Reminders integration
- Voice capture and processing
- GTD methodology implementation
- Responsive design for all devices
- Professional UI/UX with animations"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully uploaded FlowState code to GitHub!"
echo "🌐 Repository: https://github.com/theflowstateapp/flowstateapp"
echo ""
echo "Next steps:"
echo "1. Set up Railway backend hosting"
echo "2. Set up Vercel frontend hosting"
echo "3. Configure production environment"
echo "4. Test production deployment"
