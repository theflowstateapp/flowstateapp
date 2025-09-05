import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Clock,
  Star,
  MessageSquare,
  CheckCircle,
  X,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Activity,
  PieChart,
  LineChart,
  Calendar,
  Zap,
  Heart,
  DollarSign,
  BookOpen,
  Settings,
  HelpCircle,
  Flag,
  Repeat
} from 'lucide-react';
import { UserAnalytics } from '../lib/userAnalytics';

const ProductAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [showDetailed, setShowDetailed] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = () => {
    const onboardingInsights = UserAnalytics.getOnboardingInsights();
    const behaviorInsights = UserAnalytics.getUserBehaviorInsights();
    const feedbackInsights = UserAnalytics.getFeedbackInsights();
    
    setAnalytics({
      onboarding: onboardingInsights,
      behavior: behaviorInsights,
      feedback: feedbackInsights
    });
  };

  const kpiCards = [
    {
      title: 'Onboarding Completion',
      value: analytics?.onboarding?.completionRate?.toFixed(1) || '0',
      unit: '%',
      change: '+12.5%',
      changeType: 'positive',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'First Task Rate',
      value: analytics?.onboarding?.firstTaskRate?.toFixed(1) || '0',
      unit: '%',
      change: '+8.2%',
      changeType: 'positive',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Avg. Session Time',
      value: Math.round(analytics?.behavior?.averageSessionTime / 60) || '0',
      unit: 'min',
      change: '+5.1%',
      changeType: 'positive',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'User Satisfaction',
      value: analytics?.feedback?.satisfactionScore?.toFixed(1) || '0',
      unit: '/5',
      change: '+0.3',
      changeType: 'positive',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-yellow-500'
    }
  ];

  const engagementMetrics = [
    {
      title: 'Tasks Created',
      value: analytics?.behavior?.engagementMetrics?.tasksCreated || 0,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Projects Created',
      value: analytics?.behavior?.engagementMetrics?.projectsCreated || 0,
      icon: <Target className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Goals Set',
      value: analytics?.behavior?.engagementMetrics?.goalsSet || 0,
      icon: <Flag className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Habits Tracked',
      value: analytics?.behavior?.engagementMetrics?.habitsTracked || 0,
      icon: <Repeat className="h-5 w-5" />,
      color: 'text-orange-600'
    }
  ];

  const mostUsedFeatures = analytics?.behavior?.mostUsedFeatures || [];
  const mostViewedPages = analytics?.behavior?.mostViewedPages || [];

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-3 text-blue-500" size={32} />
              Product Analytics
            </h1>
            <p className="text-gray-600 mt-1">Monitor key metrics and user behavior</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={loadAnalytics}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Refresh data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white`}>
                  {card.icon}
                </div>
                <span className={`text-sm font-medium ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}{card.unit}
              </h3>
              <p className="text-gray-600">{card.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="mr-2 text-blue-500" size={20} />
              Engagement Metrics
            </h3>
            <div className="space-y-4">
              {engagementMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={metric.color}>{metric.icon}</div>
                    <span className="font-medium text-gray-700">{metric.title}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-green-500" size={20} />
              Most Used Features
            </h3>
            <div className="space-y-3">
              {mostUsedFeatures.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{feature.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(feature.count / mostUsedFeatures[0]?.count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{feature.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Onboarding Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="mr-2 text-purple-500" size={20} />
            Onboarding Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics.onboarding.totalTours}
              </div>
              <p className="text-gray-600">Total Tours Started</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analytics.onboarding.completedTours}
              </div>
              <p className="text-gray-600">Tours Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {analytics.onboarding.skippedTours}
              </div>
              <p className="text-gray-600">Tours Skipped</p>
            </div>
          </div>
          
          {/* Step Completion Chart */}
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Step Completion Rate</h4>
            <div className="space-y-3">
              {Object.entries(analytics.onboarding.stepCompletion).map(([step, count]) => (
                <div key={step} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{step.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(count / analytics.onboarding.totalTours) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Feedback */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="mr-2 text-yellow-500" size={20} />
            User Feedback
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {analytics.feedback.averageRating.toFixed(1)}
              </div>
              <p className="text-gray-600">Average Rating</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${
                      star <= analytics.feedback.averageRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics.feedback.totalRatings}
              </div>
              <p className="text-gray-600">Total Ratings</p>
            </div>
          </div>
          
          {/* Recent Comments */}
          {analytics.feedback.recentComments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Recent Comments</h4>
              <div className="space-y-3">
                {analytics.feedback.recentComments.map((comment, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={`${
                              star <= comment.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{comment.type}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAnalyticsDashboard;
