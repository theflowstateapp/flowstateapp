# LifeOS AI Integration Setup Guide

## 🚀 **Quick Start: AI Integration Setup**

### **Step 1: Environment Configuration**

You need to set up your OpenAI API key to enable AI features. Follow these steps:

#### **1.1 Get OpenAI API Key**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (it starts with `sk-`)

#### **1.2 Configure Environment Variables**

Create a `.env` file in the backend directory:

```bash
# Navigate to backend directory
cd backend

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### **1.3 Configure Frontend Environment**

Create a `.env` file in the root directory:

```bash
# Navigate to root directory
cd ..

# Create .env file
touch .env
```

Add the following to your `.env` file:

```env
# Backend URL
REACT_APP_BACKEND_URL=http://localhost:3001

# Environment
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
```

### **Step 2: Start the Servers**

#### **2.1 Start Backend Server**
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

You should see:
```
🚀 LifeOS AI Server running on port 3001
📊 Health check: http://localhost:3001/api/health
🤖 AI endpoints: http://localhost:3001/api/ai/*
```

#### **2.2 Start Frontend Server**
```bash
# In a new terminal, navigate to root directory
cd /Users/abhishekjohn/Documents/Business/LifeOS

# Start the React app
npm start
```

You should see the React app running on `http://localhost:3000`

### **Step 3: Test AI Integration**

#### **3.1 Test Backend Health**
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T...",
  "environment": "development"
}
```

#### **3.2 Test AI Features**
```bash
# Test natural language task creation
curl -X POST http://localhost:3001/api/ai/task-creation \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Schedule a workout for tomorrow at 9 AM"}'
```

Expected response:
```json
{
  "success": true,
  "result": {
    "title": "Workout",
    "description": "Scheduled workout",
    "priority": "medium",
    "category": "health",
    "estimatedTime": 540,
    "dueDate": "2024-01-16",
    "tags": ["workout", "fitness", "health"]
  }
}
```

### **Step 4: Use AI Features in the App**

#### **4.1 Natural Language Task Creation**
1. Go to the Tasks page
2. Use the AI Assistant component
3. Type: "Schedule a workout for tomorrow at 9 AM"
4. The AI will create a structured task automatically

#### **4.2 AI Insights**
1. Go to any page (Goals, Habits, Projects, etc.)
2. Look for the AI Assistant component
3. Ask questions like:
   - "Analyze my current goals and suggest improvements"
   - "Help me create a new habit routine"
   - "What should I focus on this week?"

#### **4.3 AI Features Available**
- **Goal Analysis**: Analyze and optimize goals
- **Project Analysis**: Timeline optimization and risk assessment
- **Habit Analysis**: Consistency analysis and recommendations
- **Health Insights**: Workout and wellness recommendations
- **Financial Analysis**: Spending patterns and budget advice
- **Time Analysis**: Productivity optimization
- **Natural Language Task Creation**: Convert text to structured tasks

### **Step 5: Troubleshooting**

#### **5.1 Common Issues**

**Issue**: "Missing credentials. Please pass an `apiKey`"
**Solution**: Make sure your `.env` file has the correct OpenAI API key

**Issue**: "Failed to connect to localhost port 3001"
**Solution**: Make sure the backend server is running with `npm start` in the backend directory

**Issue**: "CORS error" in browser
**Solution**: Make sure both frontend and backend are running on the correct ports

**Issue**: "OpenAI quota exceeded"
**Solution**: Check your OpenAI billing dashboard and add credits if needed

#### **5.2 AI Service Status**

The AI service includes fallback mechanisms:
- **Primary**: OpenAI GPT-4 for advanced AI features
- **Fallback**: Enhanced pattern matching when OpenAI is unavailable
- **Error Handling**: Graceful degradation with user-friendly messages

### **Step 6: Advanced Configuration**

#### **6.1 AI Service Configuration**

You can customize AI behavior by modifying `src/lib/aiService.js`:

```javascript
const AI_CONFIG = {
  OPENAI_MODEL: 'gpt-4',           // Change to 'gpt-3.5-turbo' for cost savings
  OPENAI_MAX_TOKENS: 2000,         // Adjust response length
  OPENAI_TEMPERATURE: 0.3,        // Adjust creativity (0.0-1.0)
  MAX_REQUESTS_PER_MINUTE: 10,     // Rate limiting
  RETRY_ATTEMPTS: 3,              // Retry failed requests
  ENABLE_FALLBACK: true           // Enable fallback mode
};
```

#### **6.2 Usage Tracking**

The system automatically tracks:
- AI request count
- Token usage
- Feature usage
- Response times
- Error rates

#### **6.3 Cost Optimization**

To optimize costs:
1. Use `gpt-3.5-turbo` instead of `gpt-4` for non-critical features
2. Reduce `max_tokens` for shorter responses
3. Implement caching for repeated requests
4. Use fallback mode for simple tasks

### **Step 7: Production Deployment**

#### **7.1 Environment Variables for Production**
```env
# Production OpenAI Configuration
OPENAI_API_KEY=your_production_api_key
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

#### **7.2 Security Considerations**
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement proper rate limiting
- Monitor API usage and costs
- Regular security audits

---

## 🎉 **AI Integration Complete!**

Once you've completed these steps, LifeOS will have:

✅ **OpenAI GPT-4 Integration**: Advanced AI capabilities
✅ **Natural Language Processing**: Convert text to structured data
✅ **Intelligent Task Management**: Smart task creation and categorization
✅ **Personalized Recommendations**: AI-powered suggestions
✅ **Real-time AI Assistant**: Always-available AI help
✅ **Fallback Mechanisms**: Reliable service even when AI is unavailable
✅ **Usage Tracking**: Monitor AI usage and costs
✅ **Error Handling**: Graceful degradation and user-friendly messages

**Your LifeOS is now powered by cutting-edge AI! 🤖✨**

