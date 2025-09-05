# Life OS Razorpay Integration Setup Guide

This guide will help you set up Razorpay payment integration for the Life OS usage-based pricing system in the Indian market.

## 🚀 **Step 1: Apply Database Schema**

First, let's apply the usage-based pricing schema to your Supabase database:

```bash
# Run the schema application script
node apply-usage-pricing.js

# Or run with verbose output
node apply-usage-pricing.js --verbose

# If you encounter issues, try the direct method
node apply-usage-pricing.js --direct
```

**Expected Output:**
```
🏢 Life OS Usage-Based Pricing Setup
🇮🇳 Configured for Indian market with Razorpay
🚀 Applying usage-based pricing schema for Life OS...
📍 Configured for Indian market with Razorpay integration
📝 Schema file loaded successfully
⚡ Executing schema in Supabase...
📊 Found 15 SQL statements to execute
✅ Statement 1 executed successfully
...
🎉 Usage-based pricing schema applied successfully!
🔍 Verifying schema...
✅ Table subscription_plans exists and is accessible
✅ Table user_subscriptions exists and is accessible
✅ Table ai_usage_logs exists and is accessible
✅ Table billing_history exists and is accessible
✅ Table usage_alerts exists and is accessible
📊 Verification Summary: 5/5 tables verified
🎉 Usage-based pricing system is ready for Life OS!
```

## 🏦 **Step 2: Set Up Razorpay Account**

1. **Create Razorpay Account:**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up for a business account
   - Complete KYC verification

2. **Get API Keys:**
   - Navigate to Settings > API Keys
   - Generate a new key pair
   - Copy the Key ID and Key Secret

3. **Configure Webhooks (Optional):**
   - Go to Settings > Webhooks
   - Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`

## 🔧 **Step 3: Configure Environment Variables**

1. **Copy the environment template:**
   ```bash
   cp env-template-razorpay.txt .env
   ```

2. **Fill in your Razorpay credentials:**
   ```env
   # Razorpay Configuration (Indian Market)
   RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   ```

3. **Add Supabase credentials:**
   ```env
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 📦 **Step 4: Install Dependencies**

```bash
# Install Razorpay SDK
npm install razorpay

# Install additional dependencies
npm install crypto dotenv
```

## 🔌 **Step 5: Set Up Backend API Routes**

Create the following API routes in your backend:

```javascript
// server/routes/razorpay.js
const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentStatus,
  refundPayment
} = require('./razorpay-handler');

// Create payment order
router.post('/create-order', createRazorpayOrder);

// Verify payment
router.post('/verify-payment', verifyRazorpayPayment);

// Get payment status
router.get('/payment/:payment_id', getPaymentStatus);

// Process refund
router.post('/refund', refundPayment);

module.exports = router;
```

## 🎨 **Step 6: Test the Integration**

1. **Test Payment Flow:**
   ```bash
   # Start your development server
   npm start
   ```

2. **Navigate to Settings > Usage & Billing**
3. **Click "Upgrade Now" on any plan**
4. **Complete a test payment using Razorpay test cards**

## 🧪 **Test Cards for Development**

Use these test cards in Razorpay test mode:

| Card Number | Bank | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Any Bank | Success |
| 4000 0000 0000 0002 | Any Bank | Failure |
| 4000 0000 0000 9995 | Any Bank | Insufficient Funds |

## 🔒 **Security Best Practices**

1. **Never expose your Razorpay secret key in frontend code**
2. **Always verify payment signatures on the backend**
3. **Use HTTPS in production**
4. **Implement proper error handling**
5. **Log all payment events for audit**

## 📊 **Monitoring and Analytics**

Set up monitoring for your payment system:

1. **Razorpay Dashboard:**
   - Monitor payment success rates
   - Track failed payments
   - Analyze payment methods

2. **Application Logs:**
   - Log all payment attempts
   - Track subscription changes
   - Monitor usage patterns

## 🚀 **Production Deployment**

1. **Update Environment Variables:**
   ```env
   NODE_ENV=production
   RAZORPAY_KEY_ID=rzp_live_your_live_key_id
   RAZORPAY_KEY_SECRET=your_live_secret_key
   ```

2. **Enable Webhooks:**
   - Set up production webhook URLs
   - Test webhook delivery
   - Monitor webhook failures

3. **SSL Certificate:**
   - Ensure HTTPS is enabled
   - Verify SSL certificate validity

## 🔄 **Future PayPal Integration**

When you're ready to expand internationally:

1. **Add PayPal environment variables:**
   ```env
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

2. **Create PayPal payment component:**
   - Similar to RazorpayPayment.js
   - Handle PayPal-specific payment flow
   - Support multiple currencies

3. **Update pricing display:**
   - Show prices in local currency
   - Handle currency conversion
   - Support regional payment methods

## 🆘 **Troubleshooting**

### Common Issues:

1. **"Invalid payment signature"**
   - Check your Razorpay secret key
   - Verify signature calculation
   - Ensure proper encoding

2. **"Payment not captured"**
   - Check payment status in Razorpay dashboard
   - Verify webhook delivery
   - Check payment method configuration

3. **"Failed to create payment order"**
   - Verify Razorpay API credentials
   - Check amount format (should be in paise)
   - Ensure proper error handling

### Support Resources:

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)
- [Life OS GitHub Issues](https://github.com/your-repo/issues)

## ✅ **Verification Checklist**

- [ ] Database schema applied successfully
- [ ] Razorpay account created and verified
- [ ] API keys configured in environment
- [ ] Backend API routes implemented
- [ ] Frontend payment component integrated
- [ ] Test payments working
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Production deployment ready

## 🎉 **Next Steps**

After completing this setup:

1. **Test the complete payment flow**
2. **Set up usage tracking for AI features**
3. **Configure usage alerts and notifications**
4. **Implement billing automation**
5. **Set up customer support processes**

Your Life OS application now has a complete usage-based pricing system with Razorpay integration, ready for the Indian market!
