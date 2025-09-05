// CFO Agent Task: Payment Processing and Monetization
// Stripe integration and subscription management for LifeOS

import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Up to 100 tasks',
      'Basic AI assistant',
      'Voice capture (5 min/day)',
      'Standard analytics',
      'Mobile & web access'
    ],
    limits: {
      tasks: 100,
      voiceMinutes: 5,
      aiRequests: 50
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 900, // $9.00 in cents
    interval: 'month',
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited tasks',
      'Advanced AI assistant',
      'Unlimited voice capture',
      'Advanced analytics & insights',
      'Priority support',
      'Custom integrations',
      'Team collaboration'
    ],
    limits: {
      tasks: -1, // Unlimited
      voiceMinutes: -1, // Unlimited
      aiRequests: -1 // Unlimited
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'custom',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Custom AI training',
      'Advanced security',
      'Dedicated support',
      'Custom integrations',
      'Analytics dashboard',
      'API access'
    ],
    limits: {
      tasks: -1,
      voiceMinutes: -1,
      aiRequests: -1
    }
  }
};

// Payment Processing Functions
export class PaymentService {
  // Create Stripe Checkout Session
  static async createCheckoutSession(userId, planId, successUrl, cancelUrl) {
    try {
      const plan = SUBSCRIPTION_PLANS[planId];
      if (!plan || plan.id === 'free') {
        throw new Error('Invalid plan selected');
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: await this.getUserEmail(userId),
        metadata: {
          userId: userId,
          planId: planId
        }
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Handle Successful Payment
  static async handleSuccessfulPayment(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      const { userId, planId } = session.metadata;

      // Update user subscription in database
      await this.updateUserSubscription(userId, planId, session.subscription);

      return {
        success: true,
        userId,
        planId,
        subscriptionId: session.subscription
      };
    } catch (error) {
      console.error('Error handling successful payment:', error);
      throw error;
    }
  }

  // Create Customer Portal Session
  static async createPortalSession(userId, returnUrl) {
    try {
      const customerId = await this.getCustomerId(userId);
      
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  // Handle Webhook Events
  static async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleSuccessfulPayment(event.data.object.id);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object);
          break;
        
        case 'invoice.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        
        default:
          // eslint-disable-next-line no-console
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }

  // Subscription Management
  static async updateUserSubscription(userId, planId, subscriptionId) {
    // Update user subscription in database
    const subscription = {
      userId,
      planId,
      subscriptionId,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    // Save to database (implement based on your database)
    await this.saveSubscriptionToDatabase(subscription);
    
    return subscription;
  }

  static async handleSubscriptionUpdate(subscription) {
    // Handle subscription updates (plan changes, etc.)
    // eslint-disable-next-line no-console
    console.log('Subscription updated:', subscription.id);
  }

  static async handleSubscriptionCancellation(subscription) {
    // Handle subscription cancellation
    // eslint-disable-next-line no-console
    console.log('Subscription cancelled:', subscription.id);
  }

  static async handlePaymentFailure(invoice) {
    // Handle failed payments
    // eslint-disable-next-line no-console
    console.log('Payment failed for invoice:', invoice.id);
  }

  // Utility Functions
  static async getUserEmail(userId) {
    // Get user email from database
    // Implement based on your user management system
    return 'user@example.com';
  }

  static async getCustomerId(userId) {
    // Get Stripe customer ID for user
    // Implement based on your database
    return 'cus_example';
  }

  static async saveSubscriptionToDatabase(subscription) {
    // Save subscription to database
    // Implement based on your database
    // eslint-disable-next-line no-console
    console.log('Saving subscription:', subscription);
  }
}

// Usage Tracking and Billing
export class UsageTracker {
  static async trackUsage(userId, feature, amount = 1) {
    const userPlan = await this.getUserPlan(userId);
    const limits = SUBSCRIPTION_PLANS[userPlan].limits;

    if (limits[feature] !== -1) {
      const currentUsage = await this.getCurrentUsage(userId, feature);
      if (currentUsage + amount > limits[feature]) {
        throw new Error(`Usage limit exceeded for ${feature}`);
      }
    }

    // Track usage in database
    await this.recordUsage(userId, feature, amount);
  }

  static async getUserPlan(userId) {
    // Get user's current plan from database
    // Implement based on your database
    return 'free';
  }

  static async getCurrentUsage(userId, feature) {
    // Get current usage for feature from database
    // Implement based on your database
    return 0;
  }

  static async recordUsage(userId, feature, amount) {
    // Record usage in database
    // Implement based on your database
    // eslint-disable-next-line no-console
    console.log(`Recording usage: ${userId}, ${feature}, ${amount}`);
  }
}

// Revenue Analytics
export class RevenueAnalytics {
  static async getRevenueMetrics(timeframe = 'month') {
    try {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get revenue data from Stripe
      const charges = await stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000)
        }
      });

      const revenue = charges.data.reduce((sum, charge) => sum + charge.amount, 0);
      const customerCount = new Set(charges.data.map(charge => charge.customer)).size;

      return {
        revenue: revenue / 100, // Convert from cents to dollars
        customerCount,
        averageRevenuePerCustomer: customerCount > 0 ? (revenue / 100) / customerCount : 0,
        timeframe
      };
    } catch (error) {
      console.error('Error getting revenue metrics:', error);
      throw error;
    }
  }

  static async getSubscriptionMetrics() {
    try {
      const subscriptions = await stripe.subscriptions.list({
        status: 'active'
      });

      const planCounts = {};
      subscriptions.data.forEach(sub => {
        const planId = sub.items.data[0].price.id;
        planCounts[planId] = (planCounts[planId] || 0) + 1;
      });

      return {
        totalActiveSubscriptions: subscriptions.data.length,
        planBreakdown: planCounts,
        monthlyRecurringRevenue: subscriptions.data.reduce((sum, sub) => {
          return sum + (sub.items.data[0].price.unit_amount || 0);
        }, 0) / 100
      };
    } catch (error) {
      console.error('Error getting subscription metrics:', error);
      throw error;
    }
  }
}

// Pricing Strategy
export const PricingStrategy = {
  // Calculate dynamic pricing based on usage
  calculateDynamicPricing: (usage, basePrice) => {
    const usageMultiplier = Math.min(usage / 1000, 2); // Cap at 2x
    return Math.round(basePrice * (1 + usageMultiplier));
  },

  // Suggest plan upgrades
  suggestPlanUpgrade: (currentUsage, currentPlan) => {
    const suggestions = [];

    if (currentPlan === 'free' && currentUsage.tasks > 80) {
      suggestions.push({
        plan: 'pro',
        reason: 'You\'re approaching your task limit',
        benefit: 'Unlimited tasks and advanced features'
      });
    }

    if (currentUsage.voiceMinutes > 4) {
      suggestions.push({
        plan: 'pro',
        reason: 'You\'re using most of your voice capture time',
        benefit: 'Unlimited voice capture'
      });
    }

    return suggestions;
  },

  // Calculate ROI for enterprise plans
  calculateROI: (currentCosts, expectedSavings) => {
    return {
      roi: ((expectedSavings - currentCosts) / currentCosts) * 100,
      paybackPeriod: currentCosts / (expectedSavings / 12) // months
    };
  }
};

export default {
  PaymentService,
  UsageTracker,
  RevenueAnalytics,
  PricingStrategy,
  SUBSCRIPTION_PLANS
};
