import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Target,
  Calendar,
  Activity,
  Zap,
  Brain,
  PieChart,
  LineChart
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CommandCenterDashboard = () => {
  const { areas, projects, tasks, goals, habits, loading } = useData();

  // Calculate stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0;
  const activeProjects = projects?.length || 0;
  const totalGoals = goals?.length || 0;
  const activeHabits = habits?.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statsCards = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Goals Set',
      value: totalGoals,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+3%',
      changeType: 'positive'
    }
  ];

  const insights = [
    {
      title: 'Productivity Trends',
      description: 'Your productivity has increased by 15% this week',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      title: 'Focus Areas',
      description: 'Health and Career are your most active areas',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Habit Streaks',
      description: 'You have 3 habits with 7+ day streaks',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'AI Insights',
      description: 'AI suggests optimizing your morning routine',
      icon: Brain,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    { title: 'Add Task', icon: CheckCircle, color: 'bg-blue-500' },
    { title: 'New Project', icon: Target, color: 'bg-green-500' },
    { title: 'Set Goal', icon: Calendar, color: 'bg-purple-500' },
    { title: 'Track Habit', icon: Activity, color: 'bg-orange-500' }
  ];

  if (loading) {
    return (
      <div className="p-4 space-y-4" data-testid="command-center-dashboard">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" data-testid="command-center-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-2 text-purple-500" size={24} />
            Command Center
          </h1>
          <p className="text-sm text-gray-600 mt-1">Your central hub for life management insights and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
            <Zap size={16} className="mr-1 inline" />
            AI Analysis
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last week
                </p>
              </div>
              <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.color}`} size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="mr-2 text-purple-500" size={20} />
            AI Insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center`}>
                  <insight.icon className={`${insight.color}`} size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="mr-2 text-orange-500" size={20} />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                  <action.icon className="text-white" size={16} />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="mr-2 text-blue-500" size={20} />
            Task Distribution
          </h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <PieChart size={48} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LineChart className="mr-2 text-green-500" size={20} />
            Progress Trends
          </h3>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <LineChart size={48} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenterDashboard;

