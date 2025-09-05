# Life OS Usage-Based Pricing System

This document outlines the implementation of a usage-based pricing model similar to OpenAI's for the Life OS application, specifically designed for the Indian market.

## Overview

The pricing system follows OpenAI's model with:
- **Free tier** with generous limits
- **Usage-based billing** for exceeding limits
- **Transparent pricing** per unit
- **Indian market pricing** in INR

## Pricing Structure

### Free Plan
- **Price**: ₹0/month
- **AI Requests**: 50 per month
- **AI Tokens**: 50,000 per month
- **Storage**: 500MB
- **Projects**: 5 per month
- **Tasks**: 100 per month

### Pro Plan
- **Price**: ₹999/month or ₹9,999/year (17% savings)
- **AI Requests**: 500 per month
- **AI Tokens**: 500,000 per month
- **Storage**: 10GB
- **Projects**: 50 per month
- **Tasks**: 1,000 per month

### Enterprise Plan
- **Price**: ₹2,499/month or ₹24,999/year (17% savings)
- **AI Requests**: 2,000 per month
- **AI Tokens**: 2,000,000 per month
- **Storage**: 100GB
- **Projects**: 200 per month
- **Tasks**: 5,000 per month

## Usage-Based Pricing

### AI Token Pricing (per 1,000 tokens)
- **Free Plan**: ₹0.0001 per input token, ₹0.0002 per output token
- **Pro Plan**: ₹0.00008 per input token, ₹0.00015 per output token (20% discount)
- **Enterprise Plan**: ₹0.00006 per input token, ₹0.00012 per output token (40% discount)

### Additional Storage
- **₹50 per GB per month** for storage beyond plan limits

## Database Schema

### Tables Created

1. **subscription_plans** - Plan definitions and pricing
2. **user_subscriptions** - User subscription details and usage tracking
3. **ai_usage_logs** - Detailed AI usage tracking
4. **billing_history** - Billing records and invoices
5. **usage_alerts** - Usage notifications and alerts

### Key Functions

- `track_ai_usage()` - Track AI usage and calculate costs
- `get_user_usage()` - Get current usage statistics
- `can_use_ai_feature()` - Check if user can use AI features

## Implementation Files

### Database
- `supabase-usage-pricing-schema.sql` - Complete database schema
- `apply-usage-pricing.js` - Script to apply schema

### Frontend Components
- `src/hooks/useUsage.js` - React hook for usage management
- `src/components/UsageDashboard.js` - Usage dashboard component
- `src/components/PricingPage.js` - Pricing page component

### Updated Pages
- `src/pages/Settings.js` - Added usage & billing tab
- `src/pages/Landing.js` - Updated pricing section

## Setup Instructions

### 1. Apply Database Schema

```bash
# Option 1: Run the script
node apply-usage-pricing.js

# Option 2: Manual SQL execution
# Copy the contents of supabase-usage-pricing-schema.sql
# and run it in your Supabase SQL editor
```

### 2. Environment Variables

Ensure you have these environment variables:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Frontend Integration

The usage system is automatically integrated into:
- **Settings page** - Usage & Billing tab
- **Landing page** - Updated pricing section
- **AI features** - Automatic usage tracking

## Usage Tracking

### AI Usage Tracking

The system automatically tracks:
- **Input tokens** - Tokens sent to AI models
- **Output tokens** - Tokens received from AI models
- **Feature type** - What AI feature was used
- **Cost calculation** - Based on plan pricing

### Usage Limits

Users are notified when approaching limits:
- **80% threshold** - Warning notification
- **100% threshold** - Limit reached notification
- **Exceeding limits** - Additional charges applied

## Billing Features

### Automatic Billing
- **Monthly billing** for subscription plans
- **Usage-based charges** for exceeding limits
- **Prorated billing** for plan changes

### Payment Integration
- **Stripe integration** ready
- **Multiple payment methods** supported
- **Invoice generation** automatic

## Best Practices

### For Users
1. **Monitor usage** in Settings > Usage & Billing
2. **Set up alerts** for approaching limits
3. **Upgrade plans** before hitting limits
4. **Review billing history** regularly

### For Developers
1. **Track all AI usage** using the `trackAIUsage` function
2. **Check limits** before AI operations
3. **Handle usage errors** gracefully
4. **Provide clear messaging** about costs

## Monitoring and Analytics

### Usage Metrics
- **Daily usage tracking**
- **Monthly billing cycles**
- **Usage trends and patterns**
- **Cost optimization suggestions**

### Alerts and Notifications
- **Usage threshold alerts**
- **Billing reminders**
- **Payment failure notifications**
- **Plan upgrade suggestions**

## Future Enhancements

### Planned Features
1. **Usage predictions** - AI-powered usage forecasting
2. **Cost optimization** - Suggestions for reducing costs
3. **Team billing** - Shared billing for teams
4. **Usage analytics** - Detailed usage insights
5. **Custom plans** - Tailored pricing for enterprise

### Integration Opportunities
1. **Stripe billing** - Full payment processing
2. **Email notifications** - Usage and billing alerts
3. **Webhook support** - Real-time usage updates
4. **API access** - External usage monitoring

## Support and Documentation

### User Documentation
- **Pricing FAQ** - Common questions about pricing
- **Usage guides** - How to monitor and optimize usage
- **Billing help** - Understanding charges and invoices

### Developer Documentation
- **API reference** - Usage tracking API
- **Integration guide** - How to integrate usage tracking
- **Best practices** - Recommended implementation patterns

## Conclusion

This usage-based pricing system provides:
- **Transparent pricing** similar to OpenAI
- **Fair usage limits** for all users
- **Scalable billing** for growing usage
- **Indian market optimization** with INR pricing
- **Comprehensive tracking** of all usage metrics

The system is designed to be fair, transparent, and scalable while providing excellent value for users at all levels.
