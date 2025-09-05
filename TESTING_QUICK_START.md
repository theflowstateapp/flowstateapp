# 🧪 LifeOS Automated Testing - Quick Start Guide

## 🚀 **Run Tests in 3 Simple Steps**

### **Step 1: Install Dependencies**
```bash
# Install Playwright and testing dependencies
npm install -D @playwright/test playwright

# Install Playwright browsers
npx playwright install
```

### **Step 2: Set Up Environment**
```bash
# Create .env file with your API keys
cp .env.example .env

# Edit .env file with your actual keys:
# REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
# REACT_APP_SUPABASE_URL=your_supabase_url_here
# REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### **Step 3: Run Tests**
```bash
# Run all tests (recommended)
./run-tests.sh

# Or run specific test suites:
./run-tests.sh core        # Core functionality only
./run-tests.sh ai          # AI integration only
./run-tests.sh pricing     # Pricing & billing only
./run-tests.sh ui          # With Playwright UI
./run-tests.sh headed      # Show browser while testing
```

---

## 📋 **What the Tests Cover**

### **✅ Core Functionality**
- User registration and login
- Goal creation, editing, and deletion
- Project management with tasks
- Habit tracking and check-ins
- Data relationships and cross-page sync

### **🤖 AI Integration**
- AI assistant on all pages
- AI insights for goals, projects, habits
- Usage tracking and limits
- Upgrade prompts when limits reached

### **💰 Pricing & Billing**
- Pricing display on landing page
- Current plan in settings
- Usage limits and tracking
- Upgrade/downgrade flows

### **⚡ Performance**
- Page load times under 3 seconds
- AI response times under 10 seconds
- Real-time data updates
- Memory usage optimization

### **🔧 Error Handling**
- Network error handling
- User-friendly error messages
- Graceful degradation
- Error boundaries

---

## 🎯 **Test Results**

### **View Results**
```bash
# Generate and view test report
./run-tests.sh report

# Clean up test artifacts
./run-tests.sh cleanup
```

### **Test Output Locations**
- **HTML Report**: `test-results/index.html`
- **JSON Results**: `test-results/results.json`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Tests Fail to Start**
```bash
# Check if server is running
npm start

# Check if .env file exists
ls -la .env

# Check if Playwright is installed
npx playwright --version
```

#### **AI Tests Fail**
```bash
# Check OpenAI API key
echo $REACT_APP_OPENAI_API_KEY

# Test API connection
curl -H "Authorization: Bearer $REACT_APP_OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

#### **Database Tests Fail**
```bash
# Check Supabase connection
echo $REACT_APP_SUPABASE_URL

# Verify database schema is set up
# Run the SQL from database-schema-complete.sql in Supabase
```

#### **Browser Issues**
```bash
# Reinstall Playwright browsers
npx playwright install

# Clear browser cache
npx playwright install --force
```

---

## 📊 **Test Metrics**

### **Success Criteria**
- ✅ All core features work correctly
- ✅ AI integration functions properly
- ✅ Usage tracking is accurate
- ✅ Pricing display is correct
- ✅ Data relationships work
- ✅ Performance meets requirements

### **Performance Targets**
- Page load time: < 3 seconds
- AI response time: < 10 seconds
- Database queries: < 500ms
- Memory usage: < 100MB

---

## 🚀 **Advanced Testing**

### **Run Specific Browser Tests**
```bash
# Test on different browsers
./run-tests.sh all chromium
./run-tests.sh all firefox
./run-tests.sh all webkit
```

### **Debug Mode**
```bash
# Run tests with debugger
./run-tests.sh debug

# Run with UI for step-by-step debugging
./run-tests.sh ui
```

### **Continuous Integration**
```bash
# Run tests in CI mode
CI=true ./run-tests.sh all

# Generate JUnit report for CI
npx playwright test --reporter=junit
```

---

## 📈 **Test Coverage**

### **Files Tested**
- `src/pages/Goals.js` - Goal management
- `src/pages/Projects.js` - Project management
- `src/pages/Habits.js` - Habit tracking
- `src/pages/Settings.js` - Settings and billing
- `src/pages/Landing.js` - Landing page and pricing
- `src/components/AIAssistant.js` - AI integration
- `src/lib/aiAssistant.js` - AI functionality
- `src/lib/usagePricing.js` - Usage tracking

### **Features Tested**
- User authentication flow
- CRUD operations for all entities
- Data relationships and sync
- AI integration and insights
- Usage tracking and limits
- Pricing display and billing
- Performance and error handling

---

## 🎉 **Success Indicators**

### **All Tests Pass**
```bash
# You'll see:
[SUCCESS] All tests completed successfully!
[INFO] Test results saved in: test-results/
[INFO] To view detailed report: ./run-tests.sh report
```

### **Ready for Launch**
- ✅ All core functionality works
- ✅ AI features are integrated
- ✅ Usage tracking is accurate
- ✅ Pricing strategy is implemented
- ✅ Performance meets targets
- ✅ Error handling is robust

---

## 📞 **Support**

### **Get Help**
```bash
# Show help
./run-tests.sh help

# View test documentation
cat TESTING_IMPLEMENTATION.md
```

### **Report Issues**
- Check test output for specific errors
- Review test-results/ for detailed logs
- Check browser console for JavaScript errors
- Verify API keys and database connection

---

**🎯 Ready to test LifeOS? Run `./run-tests.sh` and see your AI-powered life management platform in action!**
