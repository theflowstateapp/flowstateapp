import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  AlertTriangle,
  Loader,
  Shield,
  Lock,
  ArrowRight,
  Calendar,
  DollarSign,
  Zap
} from 'lucide-react';
import { useUsage } from '../hooks/useUsage';
import toast from 'react-hot-toast';

const RazorpayPayment = ({ plan, billingCycle = 'monthly', onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const { upgradePlan } = useUsage();

  const getPlanPrice = () => {
    return billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  };

  const getPlanName = () => {
    return `${plan.displayName} (${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus('processing');

    try {
      // Validate plan data
      if (!plan || !plan.name || !getPlanPrice()) {
        throw new Error('Invalid plan data');
      }

      // Create payment order on your backend
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.name,
          billingCycle,
          amount: getPlanPrice(),
          currency: 'INR'
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Life OS',
        description: getPlanName(),
        order_id: orderData.id,
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.name,
                billingCycle
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Update user subscription
              await upgradePlan(plan.name, billingCycle);
              
              setPaymentStatus('success');
              toast.success('Payment successful! Your plan has been upgraded.');
              
              if (onSuccess) {
                onSuccess(verifyData);
              }
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'User Name', // Get from user profile
          email: 'user@example.com', // Get from user profile
          contact: '+91' // Get from user profile
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus('cancelled');
            setLoading(false);
            if (onCancel) {
              onCancel();
            }
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <Check className="h-6 w-6 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'processing':
        return <Loader className="h-6 w-6 text-blue-600 animate-spin" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'processing':
        return 'Processing Payment';
      case 'cancelled':
        return 'Payment Cancelled';
      default:
        return 'Ready to Pay';
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {getStatusText()}
        </h3>
        <p className="text-gray-600">
          {paymentStatus === 'idle' && 'Complete your subscription upgrade'}
          {paymentStatus === 'processing' && 'Please complete the payment in the popup'}
          {paymentStatus === 'success' && 'Your plan has been upgraded successfully'}
          {paymentStatus === 'failed' && 'Payment failed. Please try again'}
          {paymentStatus === 'cancelled' && 'Payment was cancelled'}
        </p>
      </div>

      {/* Plan Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Plan</span>
          <span className="text-sm font-semibold text-gray-900">{getPlanName()}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Amount</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(getPlanPrice())}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Billing Cycle</span>
          <span className="text-sm text-gray-900 capitalize">{billingCycle}</span>
        </div>
      </div>

      {/* Features Included */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">What's included:</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm text-gray-700">
              {plan.limits.aiRequests.toLocaleString()} AI requests per month
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-sm text-gray-700">
              {plan.limits.aiTokens.toLocaleString()} AI tokens per month
            </span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm text-gray-700">
              {plan.limits.storage} GB storage
            </span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Secure Payment</h4>
            <p className="text-xs text-blue-700">
              Your payment is processed securely by Razorpay. We never store your payment information.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {paymentStatus === 'idle' && (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Pay {formatCurrency(getPlanPrice())}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        )}

        {paymentStatus === 'failed' && (
          <button
            onClick={handlePayment}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        )}

        {paymentStatus === 'success' && (
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        )}

        {(paymentStatus === 'idle' || paymentStatus === 'failed') && (
          <button
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Payment Methods */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Accepted Payment Methods:</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-xs text-gray-600">Credit/Debit Cards</span>
          </div>
          <div className="flex items-center">
            <Lock className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-xs text-gray-600">UPI</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-xs text-gray-600">Net Banking</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RazorpayPayment;
