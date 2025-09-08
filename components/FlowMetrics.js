import React, { useState, useEffect } from 'react';

const FlowScoreBadge = ({ className = '' }) => {
  const [flowScore, setFlowScore] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFlowMetrics();
  }, []);
  
  const fetchFlowMetrics = async () => {
    try {
      const response = await fetch('/api/focus/metrics');
      if (response.ok) {
        const data = await response.json();
        setFlowScore(data.week.score);
      }
    } catch (error) {
      console.error('Failed to fetch flow metrics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 ${className}`}>
        <div className="animate-pulse">Flow: --</div>
      </div>
    );
  }
  
  if (flowScore === null) {
    return null;
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(flowScore)} ${className}`}>
      Flow: {flowScore}
    </div>
  );
};

const FlowMetricsSection = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFlowMetrics();
  }, []);
  
  const fetchFlowMetrics = async () => {
    try {
      const response = await fetch('/api/focus/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch flow metrics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Flow this week</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Flow this week</h3>
        <p className="text-gray-500">No focus sessions this week</p>
      </div>
    );
  }
  
  const { week } = metrics;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Flow this week</h3>
      
      <div className="space-y-4">
        {/* Flow Score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Flow Score</span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            week.score >= 80 ? 'bg-green-100 text-green-800' :
            week.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
            week.score >= 40 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {week.score}/100
          </div>
        </div>
        
        {/* Session Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Sessions</span>
          <span className="text-sm font-medium text-gray-900">{week.sessionCount}</span>
        </div>
        
        {/* Flow Minutes */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Flow Minutes</span>
          <span className="text-sm font-medium text-gray-900">{week.flowMinutes}m</span>
        </div>
        
        {/* Total Minutes */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Minutes</span>
          <span className="text-sm font-medium text-gray-900">{week.totalMinutes}m</span>
        </div>
        
        {/* Average Session */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Avg Session</span>
          <span className="text-sm font-medium text-gray-900">{week.avgSession}m</span>
        </div>
        
        {/* Distraction Rate */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Distraction Rate</span>
          <span className="text-sm font-medium text-gray-900">
            {week.distractionRate.toFixed(1)}/session
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Deep Work Progress</span>
          <span>{week.flowMinutes}/300m</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (week.flowMinutes / 300) * 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Target: 5 hours (300 minutes) of deep work per week
        </p>
      </div>
    </div>
  );
};

export { FlowScoreBadge, FlowMetricsSection };
