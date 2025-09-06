# FlowState Production Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying FlowState to production with security, performance, and monitoring best practices.

## Prerequisites

### Required Accounts
- [ ] Vercel account (for hosting)
- [ ] Supabase account (for database)
- [ ] OpenAI account (for AI services)
- [ ] Google Analytics account (for analytics)
- [ ] Domain registrar account (GoDaddy, etc.)

### Required Tools
- [ ] Node.js 18+ installed
- [ ] Git installed and configured
- [ ] Vercel CLI installed (`npm i -g vercel`)
- [ ] Text editor (VS Code recommended)

## Environment Setup

### 1. Domain Configuration
```bash
# Purchase domain (if not already done)
# Configure DNS records in your domain registrar
# Point domain to Vercel hosting
```

### 2. Vercel Project Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project to Vercel
vercel link

# Deploy to production
vercel --prod
```

### 3. Environment Variables
Configure these environment variables in Vercel dashboard:

#### Frontend Variables
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_GA_MEASUREMENT_ID=your_ga_measurement_id
REACT_APP_VERSION=1.0.0
NODE_ENV=production
```

#### Backend Variables (if using Vercel Functions)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

## Security Configuration

### 1. Content Security Policy
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://www.google-analytics.com; frame-src 'none'; object-src 'none';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### 2. Rate Limiting
Configure in Vercel Functions:
```javascript
// api/rate-limit.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = limiter;
```

### 3. Input Validation
```javascript
// api/validate.js
const { validateInput, sanitizeInput } = require('../utils/security');

const validateRequest = (req, res, next) => {
  // Validate all inputs
  const { email, password, name } = req.body;
  
  const emailValidation = validateInput(email, 'email');
  if (!emailValidation.valid) {
    return res.status(400).json({ error: emailValidation.error });
  }
  
  const passwordValidation = validateInput(password, 'password');
  if (!passwordValidation.valid) {
    return res.status(400).json({ error: passwordValidation.error });
  }
  
  // Sanitize inputs
  req.body.email = sanitizeInput(email, 'email');
  req.body.password = sanitizeInput(password, 'password');
  req.body.name = sanitizeInput(name, 'name');
  
  next();
};

module.exports = validateRequest;
```

## Performance Optimization

### 1. Build Optimization
```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "build:analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

### 2. Caching Strategy
```json
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 3. Image Optimization
```javascript
// utils/imageOptimization.js
export const optimizeImage = (src, width, height) => {
  return `https://images.unsplash.com/photo-${src}?w=${width}&h=${height}&fit=crop&auto=format`;
};
```

## Monitoring and Analytics

### 1. Google Analytics Setup
```javascript
// utils/analytics.js
import { initAnalytics } from './analytics';

// Initialize in App.js
useEffect(() => {
  initAnalytics();
}, []);
```

### 2. Error Tracking
```javascript
// utils/errorTracking.js
export const trackError = (error, context) => {
  // Send to your error tracking service
  fetch('/api/analytics/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error, context, timestamp: new Date().toISOString() })
  });
};
```

### 3. Performance Monitoring
```javascript
// utils/performanceMonitor.js
export const trackPerformance = (metrics) => {
  // Send performance metrics
  fetch('/api/analytics/performance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metrics)
  });
};
```

## Database Setup

### 1. Supabase Configuration
```sql
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE archives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
```

### 2. Backup Strategy
```bash
# Automated backups
# Set up daily backups in Supabase dashboard
# Configure point-in-time recovery
# Test restore procedures monthly
```

## SSL/TLS Configuration

### 1. Vercel SSL
- Vercel automatically provides SSL certificates
- Configure custom domain SSL in Vercel dashboard
- Enable HSTS headers for additional security

### 2. Certificate Management
```bash
# Check SSL configuration
curl -I https://theflowstateapp.com

# Verify certificate
openssl s_client -connect theflowstateapp.com:443 -servername theflowstateapp.com
```

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Security headers implemented
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] Error handling tested
- [ ] Performance optimizations applied
- [ ] Analytics configured
- [ ] SSL certificates valid

### Deployment
- [ ] Code committed to repository
- [ ] Vercel deployment successful
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] Health checks passing
- [ ] Performance metrics acceptable

### Post-Deployment
- [ ] Smoke tests passed
- [ ] User acceptance testing completed
- [ ] Monitoring alerts configured
- [ ] Backup procedures tested
- [ ] Documentation updated
- [ ] Team notified of deployment

## Monitoring and Alerts

### 1. Health Checks
```javascript
// api/health.js
export default function handler(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.REACT_APP_VERSION,
    environment: process.env.NODE_ENV
  };
  
  res.status(200).json(health);
}
```

### 2. Uptime Monitoring
- Configure uptime monitoring service (UptimeRobot, Pingdom)
- Set up alerts for downtime
- Monitor response times and availability

### 3. Error Monitoring
- Configure error tracking service (Sentry, Bugsnag)
- Set up alerts for critical errors
- Monitor error rates and trends

## Backup and Recovery

### 1. Database Backups
- Daily automated backups
- Point-in-time recovery
- Cross-region backup replication
- Monthly restore testing

### 2. Code Backups
- Git repository backups
- Multiple remote repositories
- Regular backup verification
- Disaster recovery procedures

### 3. Configuration Backups
- Environment variable backups
- SSL certificate backups
- DNS configuration backups
- Infrastructure as Code

## Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables and dependencies
2. **SSL Issues**: Verify certificate configuration
3. **Performance Issues**: Check bundle size and caching
4. **Database Issues**: Verify connection strings and permissions

### Debug Commands
```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Check environment variables
vercel env ls

# Test local build
npm run build
```

## Maintenance

### Regular Tasks
- [ ] Weekly security updates
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Annual penetration testing

### Monitoring
- [ ] Daily health check reviews
- [ ] Weekly performance reports
- [ ] Monthly error analysis
- [ ] Quarterly capacity planning

---

*This deployment guide is updated regularly. Last updated: September 2025*