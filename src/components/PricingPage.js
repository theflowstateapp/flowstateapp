import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Star,
  Zap,
  BarChart3,
  Database,
  FolderOpen,
  CheckSquare,
  Shield,
  Clock,
  ArrowRight,
  Info,
  AlertTriangle
} from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showDetails, setShowDetails] = useState(false);

  const plans = [
    {
      name: 'free',
      displayName: 'Free',
      description: 'Perfect for getting started with Life OS',
      priceMonthly: 0,
      priceYearly: 0,
      currency: 'INR',
      features: [
        'Basic goal tracking',
        'Simple habit tracking',
        'Task management',
        'Basic health metrics',
        'Email support'
      ],
      limits: {
        aiRequests: 50,
        aiTokens: 50000,
        storage: 0.5,
        projects: 5,
        tasks: 100
      },
      popular: false,
      cta: 'Start Free',
      ctaVariant: 'secondary'
    },
    {
      name: 'pro',
      displayName: 'Pro',
      description: 'Complete life management system for professionals',
      priceMonthly: 999,
      priceYearly: 9999,
      currency: 'INR',
      features: [
        'Advanced goal setting & milestones',
        'Project & task management',
        'Comprehensive habit tracking',
        'Health & wellness dashboard',
        'Finance tracking',
        'Learning & skill development',
        'Journal & reflection tools',
        'Priority support',
        'Data export',
        'AI-powered insights',
        'Advanced analytics'
      ],
      limits: {
        aiRequests: 500,
        aiTokens: 500000,
        storage: 10,
        projects: 50,
        tasks: 1000
      },
      popular: true,
      cta: 'Start Pro Trial',
      ctaVariant: 'primary'
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'For teams and organizations',
      priceMonthly: 2499,
      priceYearly: 24999,
      currency: 'INR',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Shared goals & projects',
        'Family health tracking',
        'Team analytics',
        'Admin dashboard',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'White-label options'
      ],
      limits: {
        aiRequests: 2000,
        aiTokens: 2000000,
        storage: 100,
        projects: 200,
        tasks: 5000
      },
      popular: false,
      cta: 'Contact Sales',
      ctaVariant: 'secondary'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getCurrentPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  };

  const getSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.priceMonthly > 0) {
      const yearlySavings = (plan.priceMonthly * 12) - plan.priceYearly;
      return yearlySavings;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Start free, then pay only for what you use. No hidden fees, no surprises.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-4 mb-8"
          >
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Save 17%
              </span>
            )}
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                plan.popular ? 'border-primary-500' : 'border-gray-200'
              } p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.displayName}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {getCurrentPrice(plan) === 0 ? 'Free' : formatCurrency(getCurrentPrice(plan))}
                  </span>
                  {getCurrentPrice(plan) > 0 && (
                    <span className="text-gray-500 ml-1">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>

                {getSavings(plan) > 0 && (
                  <div className="text-green-600 text-sm font-medium">
                    Save {formatCurrency(getSavings(plan))} per year
                  </div>
                )}
              </div>

              {/* Usage Limits */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Monthly Limits</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-700">AI Requests</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(plan.limits.aiRequests)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-700">AI Tokens</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(plan.limits.aiTokens)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">Storage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {plan.limits.storage} GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FolderOpen className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-sm text-gray-700">Projects</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {plan.limits.projects}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckSquare className="h-4 w-4 text-indigo-600 mr-2" />
                      <span className="text-sm text-gray-700">Tasks</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatNumber(plan.limits.tasks)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  plan.ctaVariant === 'primary'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Usage-Based Pricing Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Usage-Based Pricing</h2>
            <p className="text-xl text-gray-600">
              Pay only for what you use beyond your plan limits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Tokens</h3>
              <p className="text-gray-600 mb-3">
                Pay per 1,000 tokens used beyond your limit
              </p>
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-medium">Free:</span> ₹0.0001 per input token
                </div>
                <div className="text-sm">
                  <span className="font-medium">Pro:</span> ₹0.00008 per input token
                </div>
                <div className="text-sm">
                  <span className="font-medium">Enterprise:</span> ₹0.00006 per input token
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-green-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Database className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Storage</h3>
              <p className="text-gray-600 mb-3">
                Additional storage beyond your plan limit
              </p>
              <div className="text-sm">
                <span className="font-medium">₹50 per GB per month</span>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-purple-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 mb-3">
                Advanced analytics and insights
              </p>
              <div className="text-sm">
                <span className="font-medium">Included in Pro & Enterprise</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does usage-based billing work?</h3>
              <p className="text-gray-600">
                You get a generous free tier with monthly limits. If you exceed these limits, you only pay for the additional usage at transparent per-unit rates.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching limits. If you exceed them, you'll be charged for the additional usage on your next billing cycle.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! All paid plans come with a 30-day free trial. No credit card required to start.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have already organized their lives with Life OS
          </p>
          <button className="bg-primary-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto">
            <span>Start Free Trial</span>
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
