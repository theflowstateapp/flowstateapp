#!/bin/bash

# OpenAI Configuration Update Script
echo "🤖 Updating OpenAI configuration..."

# Backup the current .env file
cp backend/.env backend/.env.backup.openai
echo "📋 Created backup: backend/.env.backup.openai"

# Update the OpenAI API key in the .env file
sed -i '' 's/OPENAI_API_KEY=your-openai-api-key-here/OPENAI_API_KEY=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/' backend/.env

echo "✅ OpenAI API key updated successfully!"
echo ""
echo "🔍 Watch the backend terminal for: '✅ OpenAI configured successfully'"
echo ""
echo "🚀 Ready to test AI features!"
echo ""
echo "📋 Next steps:"
echo "1. Test the AI chat functionality"
echo "2. Test voice capture and processing"
echo "3. Move to Step 3: Apple Reminders integration"
