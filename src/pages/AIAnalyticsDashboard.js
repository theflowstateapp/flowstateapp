// CAIO Agent Task: AI Analytics Dashboard
// Advanced AI analytics visualization for LifeOS

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, TrendingUp, TrendingDown, Target, Clock, Zap, Users,
  BarChart3, PieChart, LineChart, Activity, Award, Lightbulb,
  Calendar, RefreshCw, Download, Filter, Eye, BrainCircuit
} from 'lucide-react';
import { aiAnalytics } from '../lib/aiAnalytics';

const AIAnalyticsDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [selectedUserId, setSelectedUserId] = useState('current');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Generate insights
  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const newInsights = await aiAnalytics.generateProductivityInsights(selectedUserId, selectedTimeRange);
      setInsights(newInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(generateInsights, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedTimeRange, selectedUserId]);

  // Initialize analytics on mount
  useEffect(() => {
    aiAnalytics.initialize();
    generateInsights();
  }, [selectedTimeRange, selectedUserId]);

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend.direction) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  // Export insights
  const exportInsights = () => {
    if (!insights) return;
    
    const dataStr = JSON.stringify(insights, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-insights-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="mr-3 text-purple-600" size={32} />
                AI Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Advanced AI-powered productivity insights and predictions</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <Activity className="w-4 h-4 mr-2 inline" />
                Auto Refresh
              </button>
              
              <button
                onClick={generateInsights}
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BrainCircuit className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Analyzing...' : 'Generate Insights'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="hour">Last Hour</option>
              <option value="day">Last Day</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
            
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="current">Current User</option>
              <option value="all">All Users</option>
            </select>
            
            <button
              onClick={exportInsights}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Insights
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productivity Score</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.metrics.productivityScore}%</p>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${insights.metrics.productivityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Task Completion</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(insights.metrics.taskCompletionRate * 100)}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Avg: {Math.round(insights.metrics.averageTaskTime / 60000)} min
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Focus Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {insights.metrics.focusTime.toFixed(1)}h
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Daily average
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Usage</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {insights.metrics.aiAssistantUsage.dailyUsage}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Interactions/day
              </div>
            </div>
          </div>
        )}

        {/* Productivity Patterns */}
        {insights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Peak Productivity Hours
              </h3>
              
              <div className="space-y-3">
                {insights.patterns.peakHours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-900">{hour}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-blue-700">Peak</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Task Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Preferred Task Types
              </h3>
              
              <div className="space-y-3">
                {insights.patterns.preferredTaskTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-900 capitalize">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700">Frequent</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Predictions */}
        {insights && insights.predictions && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              AI Predictions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Weekly Task Completion Prediction */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900">Weekly Completion</h4>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-2">
                  {Math.round(insights.predictions.weeklyTaskCompletion.predictedCompletionRate * 100)}%
                </div>
                <div className="text-sm text-blue-700">
                  Confidence: {Math.round(insights.predictions.weeklyTaskCompletion.confidence * 100)}%
                </div>
              </div>

              {/* Productivity Trend */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-green-900">Productivity Trend</h4>
                  {getTrendIcon(insights.predictions.productivityTrend)}
                </div>
                <div className="text-2xl font-bold text-green-900 mb-2 capitalize">
                  {insights.predictions.productivityTrend.direction}
                </div>
                <div className="text-sm text-green-700">
                  Magnitude: {insights.predictions.productivityTrend.magnitude.toFixed(1)}%
                </div>
              </div>

              {/* Optimal Work Schedule */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-purple-900">Optimal Schedule</h4>
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm text-purple-700 space-y-1">
                  <div>Start: {insights.predictions.optimalWorkSchedule.recommendedStartTime}</div>
                  <div>End: {insights.predictions.optimalWorkSchedule.recommendedEndTime}</div>
                  <div>Focus Blocks: {insights.predictions.optimalWorkSchedule.focusBlocks.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {insights && insights.recommendations && insights.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              AI Recommendations
            </h3>
            
            <div className="space-y-4">
              {insights.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${
                    rec.priority === 'high' 
                      ? 'border-red-200 bg-red-50' 
                      : rec.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      rec.priority === 'high' 
                        ? 'bg-red-100' 
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}>
                      <Award className={`w-4 h-4 ${
                        rec.priority === 'high' 
                          ? 'text-red-600' 
                          : rec.priority === 'medium'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.priority === 'high' 
                            ? 'bg-red-100 text-red-700' 
                            : rec.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {rec.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{rec.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-600">Action: </span>
                          <span className="text-gray-700">{rec.action}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-600">Expected Impact: </span>
                          <span className="text-gray-700">{rec.expectedImpact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No Insights State */}
        {!insights && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI Insights Yet</h3>
            <p className="text-gray-600 mb-6">Generate AI-powered insights to understand your productivity patterns and get personalized recommendations.</p>
            <button
              onClick={generateInsights}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Generate AI Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;



