# Step 4.2: Railway Backend Deployment Guide

## 🚀 **Railway Backend Setup for FlowState**

### **Why Railway for Backend?**
- ✅ **Perfect for Node.js/Express**: Zero-config deployment
- ✅ **Database Integration**: Built-in PostgreSQL, Redis support
- ✅ **Environment Variables**: Easy `.env` management
- ✅ **Real-time Features**: Socket.IO support
- ✅ **Background Jobs**: Cron jobs and background processing
- ✅ **Cost**: $5/month hobby plan, scales with usage
- ✅ **Monitoring**: Built-in logs and metrics

## 📋 **Step-by-Step Railway Setup**

### **1. Create Railway Account**
- **Go to**: https://railway.app
- **Sign up**: Use `info@theflowstateapp.com`
- **Connect**: Link your GitHub account
- **Select**: `theflowstateapp/flowstateapp` repository

### **2. Deploy Backend Service**
- **Click**: "New Project" → "Deploy from GitHub repo"
- **Select**: `theflowstateapp/flowstateapp`
- **Choose**: `backend` folder as root directory
- **Railway will**: Automatically detect Node.js and deploy

### **3. Configure Environment Variables**
In Railway dashboard, add these environment variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://awpqoykarscjyawcaeou.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHFveWthcnNjanlhd2NhZW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MDYzNzcsImV4cCI6MjA3MjM4MjM3N30._vJ9mqEFzAZXj_LGOVMuiujcSyAyo2L__tKWxdiDzso
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cHFveWthcnNjanlhd2NhZW91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgwNjM3NywiZXhwIjoyMDcyMzgyMzc3fQ.30bky1YidNJk8fpkYPqO9k5AswAMSxorMZdzbduWA9Y

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Redis Configuration (Optional)
REDIS_URL=your_redis_url_here
```

### **4. Configure Build Settings**
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x

### **5. Custom Domain Setup**
- **Go to**: Railway project settings
- **Add Domain**: `api.theflowstateapp.com`
- **Configure**: DNS records in GoDaddy
- **SSL**: Automatic HTTPS with Let's Encrypt

## 🔧 **Railway Configuration Files**

### **Create `railway.json` in backend folder:**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **Update `backend/package.json` scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## 📊 **Expected Results**

### **After Deployment:**
- ✅ **Backend URL**: `https://api.theflowstateapp.com`
- ✅ **Health Check**: `https://api.theflowstateapp.com/api/health`
- ✅ **AI Endpoints**: `https://api.theflowstateapp.com/api/ai/*`
- ✅ **Auth Endpoints**: `https://api.theflowstateapp.com/api/auth/*`
- ✅ **Apple Reminders**: `https://api.theflowstateapp.com/api/integrations/apple-reminders/*`

### **Monitoring:**
- **Logs**: Real-time logs in Railway dashboard
- **Metrics**: CPU, memory, and request metrics
- **Alerts**: Automatic alerts for errors and downtime

## 💰 **Pricing Breakdown**

### **Railway Hobby Plan:**
- **Cost**: $5/month
- **Included**: 
  - 512MB RAM
  - 1GB storage
  - 100GB bandwidth
  - Custom domains
  - SSL certificates
  - Unlimited deploys

### **Scaling:**
- **Pro Plan**: $20/month (2GB RAM, 10GB storage)
- **Team Plan**: $99/month (8GB RAM, 50GB storage)
- **Enterprise**: Custom pricing

## 🚀 **Next Steps**

1. **Complete Railway Setup**: Follow steps above
2. **Test Backend**: Verify all endpoints work
3. **Move to Vercel**: Deploy frontend
4. **Connect Domains**: Link frontend and backend
5. **Production Testing**: Full end-to-end testing

## 🔗 **Useful Links**

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app
- **Node.js Guide**: https://docs.railway.app/guides/nodejs
- **Environment Variables**: https://docs.railway.app/variables-and-secrets
- **Custom Domains**: https://docs.railway.app/custom-domains

---

**Ready to deploy? Let's get your backend live on Railway! 🚀**
