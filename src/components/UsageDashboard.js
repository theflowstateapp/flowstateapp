import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap,
  Database,
  FolderOpen,
  CheckSquare,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Info,
  ExternalLink
} from 'lucide-react';
import { useUsage } from '../hooks/useUsage';
import toast from 'react-hot-toast';

const UsageDashboard = () => {
  const { usage, loading, error, getBillingHistory, getUsageAlerts, markAlertAsRead } = useUsage();
  const [billingHistory, setBillingHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (usage) {
      fetchBillingHistory();
      fetchAlerts();
    }
  }, [usage]);

  const fetchBillingHistory = async () => {
    const history = await getBillingHistory();
    setBillingHistory(history);
  };

  const fetchAlerts = async () => {
    const userAlerts = await getUsageAlerts();
    setAlerts(userAlerts);
  };

  const handleMarkAlertAsRead = async (alertId) => {
    await markAlertAsRead(alertId);
    fetchAlerts();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getUsagePercentage = (used, limit) => {
    if (!limit || limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage < 50) return 'text-green-600 bg-green-100';
    if (percentage < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getUsageBarColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading usage data: {error}</span>
        </div>
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-800">No usage data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Usage & Billing</h2>
          <p className="text-gray-600">Monitor your usage and manage your subscription</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUsageColor(getUsagePercentage(usage.ai_tokens_used, usage.ai_tokens_limit))}`}>
            {usage.plan_display_name} Plan
          </span>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">{alert.message}</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleMarkAlertAsRead(alert.id)}
                  className="text-yellow-600 hover:text-yellow-800 text-sm"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Current Period */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Billing Period</h3>
          <div className="text-sm text-gray-500">
            {new Date(usage.current_period_start).toLocaleDateString()} - {new Date(usage.current_period_end).toLocaleDateString()}
          </div>
        </div>

        {/* Usage Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI Requests */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">AI Requests</span>
              </div>
              <span className="text-xs text-gray-500">
                {formatNumber(usage.ai_requests_used)} / {formatNumber(usage.ai_requests_limit)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageBarColor(getUsagePercentage(usage.ai_requests_used, usage.ai_requests_limit))}`}
                style={{ width: `${getUsagePercentage(usage.ai_requests_used, usage.ai_requests_limit)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getUsagePercentage(usage.ai_requests_used, usage.ai_requests_limit).toFixed(1)}% used
            </div>
          </div>

          {/* AI Tokens */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">AI Tokens</span>
              </div>
              <span className="text-xs text-gray-500">
                {formatNumber(usage.ai_tokens_used)} / {formatNumber(usage.ai_tokens_limit)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageBarColor(getUsagePercentage(usage.ai_tokens_used, usage.ai_tokens_limit))}`}
                style={{ width: `${getUsagePercentage(usage.ai_tokens_used, usage.ai_tokens_limit)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getUsagePercentage(usage.ai_tokens_used, usage.ai_tokens_limit).toFixed(1)}% used
            </div>
          </div>

          {/* Storage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Storage</span>
              </div>
              <span className="text-xs text-gray-500">
                {usage.storage_used_gb} / {usage.storage_limit_gb} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageBarColor(getUsagePercentage(usage.storage_used_gb, usage.storage_limit_gb))}`}
                style={{ width: `${getUsagePercentage(usage.storage_used_gb, usage.storage_limit_gb)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getUsagePercentage(usage.storage_used_gb, usage.storage_limit_gb).toFixed(1)}% used
            </div>
          </div>

          {/* Projects */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FolderOpen className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Projects</span>
              </div>
              <span className="text-xs text-gray-500">
                {usage.projects_created} / {usage.projects_limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageBarColor(getUsagePercentage(usage.projects_created, usage.projects_limit))}`}
                style={{ width: `${getUsagePercentage(usage.projects_created, usage.projects_limit)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getUsagePercentage(usage.projects_created, usage.projects_limit).toFixed(1)}% used
            </div>
          </div>
        </div>

        {/* Estimated Cost */}
        {usage.estimated_cost > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Estimated Additional Cost</span>
              </div>
              <span className="text-lg font-semibold text-blue-800">
                {formatCurrency(usage.estimated_cost)}
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Based on current usage exceeding your plan limits
            </p>
          </div>
        )}
      </div>

      {/* Billing History */}
      {billingHistory.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
          <div className="space-y-3">
            {billingHistory.slice(0, 5).map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(bill.billing_period_start).toLocaleDateString()} - {new Date(bill.billing_period_end).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {bill.ai_tokens_used} tokens used
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(bill.total_cost)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    bill.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bill.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {usage.plan_name === 'free' && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Upgrade to Pro for More AI Power
            </h3>
            <p className="text-primary-700 mb-4">
              Get 10x more AI requests, advanced analytics, and priority support
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageDashboard;
