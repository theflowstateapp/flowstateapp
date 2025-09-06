# LifeOS Testing & Deployment Guide

## 🧪 **Testing Strategy**

### **Phase 1: Local Development Testing**
```bash
# 1. Start Backend Server
cd backend && node server.js

# 2. Start Frontend (in new terminal)
npm start

# 3. Test Integration Endpoints
curl http://localhost:3001/api/integrations/list
curl http://localhost:3001/api/integrations/apple/reminders

# 4. Test Frontend UI
# Visit: http://localhost:3000/integrations
```

### **Phase 2: Production Testing**
```bash
# After local testing passes:
git add .
git commit -m "Test integration changes"
git push origin main

# Vercel will automatically deploy
# Test on production: https://your-domain.com/integrations
```

## 🚀 **Deployment Options**

### **Option A: Automatic Deployment (Recommended)**
**Current Setup**: Vercel with automatic GitHub integration

**Workflow**:
1. Make changes locally
2. Test locally (`npm start`)
3. Commit and push to GitHub
4. Vercel automatically deploys
5. Changes are live in ~2-3 minutes

**Commands**:
```bash
# Make changes
# Test locally
npm start

# Deploy to production
git add .
git commit -m "Your changes"
git push origin main
# ✅ Automatic deployment via Vercel
```

### **Option B: Manual Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy manually
vercel --prod
```

## 🔧 **Environment Configuration**

### **Local Development**
```bash
# Backend .env (backend/.env)
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **Production (Vercel Dashboard)**
```bash
# Set these in Vercel Dashboard > Settings > Environment Variables
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📊 **Testing Checklist**

### **Before Each Deployment**
- [ ] Backend server starts without errors
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Integration endpoints respond correctly
- [ ] Frontend UI loads and functions properly
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

### **Integration Testing**
- [ ] Apple Reminders integration works (mock data)
- [ ] Google Calendar shows setup required message
- [ ] Gmail shows setup required message
- [ ] Todoist shows setup required message
- [ ] Integration cards display correctly
- [ ] Connect/Disconnect buttons work
- [ ] Sync functionality works

## 🎯 **Recommended Testing Flow**

### **1. Development Testing**
```bash
# Terminal 1: Backend
cd backend && node server.js

# Terminal 2: Frontend  
npm start

# Terminal 3: Test APIs
curl http://localhost:3001/api/integrations/list
curl http://localhost:3001/api/integrations/apple/reminders
```

### **2. Production Testing**
```bash
# After local testing passes:
git add .
git commit -m "Integration improvements"
git push origin main

# Wait 2-3 minutes for Vercel deployment
# Test production: https://your-domain.com/integrations
```

## 🔄 **Deployment Frequency**

### **Development Phase** (Current)
- **Frequency**: Push to GitHub after each feature/test
- **Deployment**: Automatic via Vercel
- **Testing**: Local first, then production verification

### **Production Phase** (Future)
- **Frequency**: Daily/weekly releases
- **Process**: Staging → Testing → Production
- **Monitoring**: Automated health checks

## 🚨 **Troubleshooting**

### **Common Issues**
1. **Build Failures**: Check environment variables
2. **API Errors**: Verify backend is running
3. **Integration Issues**: Check API keys in Vercel dashboard
4. **UI Problems**: Clear browser cache

### **Debug Commands**
```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Test local build
npm run build

# Check environment variables
vercel env ls
```

## 📈 **Performance Monitoring**

### **Local Development**
- Browser DevTools Network tab
- Console error monitoring
- React DevTools profiling

### **Production**
- Vercel Analytics dashboard
- Google Analytics integration
- Error monitoring (Sentry)

---

## 🎉 **Quick Start Commands**

```bash
# Start development
npm start                    # Frontend
cd backend && node server.js # Backend

# Test integrations
curl http://localhost:3001/api/integrations/list

# Deploy to production
git add . && git commit -m "Changes" && git push origin main
```

**Your integrations are ready to test! Start with localhost:3000/integrations** 🚀
