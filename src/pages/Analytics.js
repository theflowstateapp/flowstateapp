import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Users,
  Zap,
  Activity
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Analytics = () => {
  const { tasks, projects, goals, habits, loading } = useData();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('productivity');

  // Calculate analytics data
  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];
  const activeProjects = projects?.filter(project => project.status === 'active') || [];
  const completedGoals = goals?.filter(goal => goal.status === 'achieved') || [];
  const activeHabits = habits?.filter(habit => habit.isActive) || [];

  const productivityScore = Math.round((completedTasks.length / Math.max(tasks?.length || 1, 1)) * 100);
  const projectCompletionRate = Math.round((activeProjects.filter(p => p.progress >= 100).length / Math.max(activeProjects.length, 1)) * 100);
  const goalAchievementRate = Math.round((completedGoals.length / Math.max(goals?.length || 1, 1)) * 100);

  const metrics = [
    {
      title: 'Productivity Score',
      value: `${productivityScore}%`,
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tasks Completed',
      value: completedTasks.length,
      change: '+5',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Projects',
      value: activeProjects.length,
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Goals Achieved',
      value: completedGoals.length,
      change: '+1',
      trend: 'up',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const chartData = [
    { day: 'Mon', tasks: 8, projects: 2 },
    { day: 'Tue', tasks: 12, projects: 3 },
    { day: 'Wed', tasks: 6, projects: 1 },
    { day: 'Thu', tasks: 15, projects: 4 },
    { day: 'Fri', tasks: 10, projects: 2 },
    { day: 'Sat', tasks: 4, projects: 1 },
    { day: 'Sun', tasks: 7, projects: 2 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6" data-testid="analytics-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600">Track your productivity and progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${metric.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center mt-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {chartData.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-gray-600">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="text-xs text-gray-500">Tasks</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(day.tasks / 15) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{day.tasks}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-500">Projects</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(day.projects / 4) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600">{day.projects}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Task Completion</span>
                <span className="text-sm text-gray-900">{productivityScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${productivityScore}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Project Progress</span>
                <span className="text-sm text-gray-900">{projectCompletionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${projectCompletionRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Goal Achievement</span>
                <span className="text-sm text-gray-900">{goalAchievementRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${goalAchievementRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-lg border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Positive Trend</span>
            </div>
            <p className="text-sm text-green-700">
              Your productivity has increased by 12% this week. Keep up the great work!
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Peak Hours</span>
            </div>
            <p className="text-sm text-blue-700">
              You're most productive between 9-11 AM. Schedule important tasks during this time.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;



