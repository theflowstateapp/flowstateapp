const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { planId, billingCycle, amount, currency = 'INR' } = req.body;

    // Validate input
    if (!planId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan or amount'
      });
    }

    // Validate planId against allowed values
    const allowedPlans = ['pro', 'enterprise'];
    if (!allowedPlans.includes(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID'
      });
    }

    // Validate billing cycle
    const allowedBillingCycles = ['monthly', 'yearly'];
    if (!allowedBillingCycles.includes(billingCycle)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid billing cycle'
      });
    }

    // Validate amount range
    if (amount > 100000) { // Max ₹100,000
      return res.status(400).json({
        success: false,
        message: 'Amount exceeds maximum limit'
      });
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create order options
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: `lifeos_${planId}_${Date.now()}`,
      notes: {
        planId: planId,
        billingCycle: billingCycle,
        userId: req.user?.id || 'anonymous'
      }
    };

    // Create order
    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planId,
      billingCycle
    } = req.body;

    // Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters'
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured'
      });
    }

    // Update user subscription in database
    const userId = req.user?.id;
    if (userId) {
      await updateUserSubscription(userId, planId, billingCycle, {
        razorpay_payment_id,
        razorpay_order_id,
        amount: payment.amount / 100, // Convert from paise to rupees
        currency: payment.currency
      });
    }

    res.json({
      success: true,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status
    });

  } catch (error) {
    console.error('Razorpay payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

// Update user subscription in database
const updateUserSubscription = async (userId, planId, billingCycle, paymentDetails) => {
  try {
    // Get plan details
    const plan = await getPlanDetails(planId);
    
    // Update user subscription
    const subscriptionData = {
      user_id: userId,
      plan_id: plan.id,
      status: 'active',
      billing_cycle: billingCycle,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
      razorpay_payment_id: paymentDetails.razorpay_payment_id,
      razorpay_order_id: paymentDetails.razorpay_order_id,
      updated_at: new Date().toISOString()
    };

    // Insert or update subscription
    await upsertUserSubscription(subscriptionData);

    // Create billing record
    await createBillingRecord(userId, planId, billingCycle, paymentDetails);

    console.log(`Subscription updated for user ${userId}: ${planId} plan, ${billingCycle} billing`);

  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
};

// Get plan details from database
const getPlanDetails = async (planName) => {
  // This would typically query your database
  // For now, return mock data
  const plans = {
    'pro': {
      id: 'pro-plan-id',
      name: 'pro',
      display_name: 'Pro',
      price_monthly: 999,
      price_yearly: 9999
    },
    'enterprise': {
      id: 'enterprise-plan-id',
      name: 'enterprise',
      display_name: 'Enterprise',
      price_monthly: 2499,
      price_yearly: 24999
    }
  };

  return plans[planName];
};

// Upsert user subscription
const upsertUserSubscription = async (subscriptionData) => {
  // This would typically use Supabase or your database
  // For now, just log the operation
  console.log('Upserting subscription:', subscriptionData);
};

// Create billing record
const createBillingRecord = async (userId, planId, billingCycle, paymentDetails) => {
  // This would typically insert into your billing_history table
  const billingData = {
    user_id: userId,
    billing_period_start: new Date().toISOString(),
    billing_period_end: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
    base_plan_cost: paymentDetails.amount,
    usage_cost: 0,
    total_cost: paymentDetails.amount,
    payment_status: 'paid',
    paid_at: new Date().toISOString(),
    razorpay_payment_id: paymentDetails.razorpay_payment_id,
    razorpay_order_id: paymentDetails.razorpay_order_id
  };

  console.log('Creating billing record:', billingData);
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { payment_id } = req.params;

    if (!payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    const payment = await razorpay.payments.fetch(payment_id);

    res.json({
      success: true,
      payment_id: payment.id,
      status: payment.status,
      amount: payment.amount / 100,
      currency: payment.currency,
      method: payment.method,
      created_at: payment.created_at
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status'
    });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;

    if (!payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    const refundOptions = {
      payment_id: payment_id,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise
      notes: {
        reason: reason || 'Customer request'
      }
    };

    const refund = await razorpay.payments.refund(refundOptions);

    res.json({
      success: true,
      refund_id: refund.id,
      payment_id: refund.payment_id,
      amount: refund.amount / 100,
      status: refund.status
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund'
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentStatus,
  refundPayment
};
