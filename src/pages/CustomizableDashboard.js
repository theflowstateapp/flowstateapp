import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Settings, Palette, Grid, Layout, Target, CheckCircle, TrendingUp,
  Clock, AlertCircle, Star, Brain, Mic, Sparkles, PieChart, BarChart3,
  Calendar, Heart, DollarSign, BookOpen, Users, Zap, Focus, Timer, Award,
  Rocket, Lightbulb, Inbox, Filter, Search, Bell, RefreshCw, Eye, EyeOff,
  Maximize, Minimize, MoreHorizontal, DragHandleDots2Icon as DragHandle, X, Activity
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

// Widget Components
const QuickStatsWidget = ({ data, theme }) => (
  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Quick Stats</h3>
      <BarChart3 size={20} className="text-blue-600" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{data.completedToday}</div>
        <div className="text-sm text-gray-600">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{data.activeProjects}</div>
        <div className="text-sm text-gray-600">Projects</div>
      </div>
    </div>
  </div>
);

const TodayFocusWidget = ({ data, theme }) => (
  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Today's Focus</h3>
      <Target size={20} className="text-orange-600" />
    </div>
    <div className="space-y-2">
      {data.todayFocus.slice(0, 3).map((task, index) => (
        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
          <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
          <span className="text-sm text-gray-700">{task.title}</span>
        </div>
      ))}
    </div>
  </div>
);

const CalendarWidget = ({ data, theme }) => (
  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Calendar</h3>
      <Calendar size={20} className="text-green-600" />
    </div>
    <div className="text-center">
      <div className="text-2xl font-bold text-gray-900">{new Date().getDate()}</div>
      <div className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long' })}</div>
    </div>
  </div>
);

const HabitTrackerWidget = ({ data, theme }) => (
  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Habits</h3>
      <Star size={20} className="text-purple-600" />
    </div>
    <div className="space-y-2">
      {data.habits.slice(0, 3).map((habit, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-gray-700">{habit.name}</span>
          <div className="flex space-x-1">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < habit.streak ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickCaptureWidget = ({ theme, onCapture }) => {
  const [input, setInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onCapture(input);
      setInput('');
    }
  };

  return (
    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Quick Capture</h3>
        <Brain size={20} className="text-purple-600" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <Zap size={16} className="inline mr-1" />
          Capture
        </button>
      </form>
    </div>
  );
};

const PerformanceWidget = ({ data, theme }) => (
  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">Performance</h3>
      <TrendingUp size={20} className="text-green-600" />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Completion Rate</span>
        <span className="text-lg font-bold text-green-600">{data.completionRate}%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Focus Time</span>
        <span className="text-lg font-bold text-blue-600">4.2h</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Streak</span>
        <span className="text-lg font-bold text-purple-600">12 days</span>
      </div>
    </div>
  </div>
);

const CustomizableDashboard = () => {
  const { user } = useAuth();
  const { tasks, projects, goals, habits, loading } = useData();
  const [dashboardConfig, setDashboardConfig] = useState({
    theme: 'light',
    layout: 'grid',
    widgets: [
      { id: 'quick-stats', type: 'QuickStats', position: { x: 0, y: 0 }, size: { w: 2, h: 1 } },
      { id: 'today-focus', type: 'TodayFocus', position: { x: 2, y: 0 }, size: { w: 2, h: 1 } },
      { id: 'calendar', type: 'Calendar', position: { x: 0, y: 1 }, size: { w: 1, h: 1 } },
      { id: 'habits', type: 'HabitTracker', position: { x: 1, y: 1 }, size: { w: 1, h: 1 } },
      { id: 'quick-capture', type: 'QuickCapture', position: { x: 2, y: 1 }, size: { w: 2, h: 1 } },
      { id: 'performance', type: 'Performance', position: { x: 0, y: 2 }, size: { w: 2, h: 1 } }
    ]
  });
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [availableWidgets, setAvailableWidgets] = useState([
    { type: 'QuickStats', name: 'Quick Stats', icon: BarChart3, description: 'Overview of your productivity metrics' },
    { type: 'TodayFocus', name: 'Today\'s Focus', icon: Target, description: 'Your high-priority tasks for today' },
    { type: 'Calendar', name: 'Calendar', icon: Calendar, description: 'Upcoming events and deadlines' },
    { type: 'HabitTracker', name: 'Habit Tracker', icon: Star, description: 'Track your daily habits and streaks' },
    { type: 'QuickCapture', name: 'Quick Capture', icon: Brain, description: 'Capture thoughts and ideas instantly' },
    { type: 'Performance', name: 'Performance', icon: TrendingUp, description: 'Your productivity and focus metrics' },
    { type: 'RecentActivity', name: 'Recent Activity', icon: Activity, description: 'Your latest actions and updates' },
    { type: 'Goals', name: 'Goals', icon: Award, description: 'Track progress towards your goals' },
    { type: 'Finance', name: 'Finance', icon: DollarSign, description: 'Budget and spending overview' },
    { type: 'Health', name: 'Health', icon: Heart, description: 'Health and wellness metrics' }
  ]);

  // Calculate dashboard data
  const dashboardData = {
    completedToday: tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.updatedAt).toDateString() === new Date().toDateString()
    ).length,
    activeProjects: projects.filter(project => project.status === 'active').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.status === 'completed').length / tasks.length) * 100) : 0,
    todayFocus: tasks.filter(task => 
      task.priority === 'high' && 
      task.status !== 'completed' &&
      (!task.dueDate || new Date(task.dueDate).toDateString() === new Date().toDateString())
    ).slice(0, 5),
    habits: habits.filter(habit => habit.status === 'active')
  };

  // Widget type mapping
  const widgetComponents = {
    QuickStats: QuickStatsWidget,
    TodayFocus: TodayFocusWidget,
    Calendar: CalendarWidget,
    HabitTracker: HabitTrackerWidget,
    QuickCapture: QuickCaptureWidget,
    Performance: PerformanceWidget
  };

  // Handle widget drag
  const handleWidgetDrag = (widgetId, newPosition) => {
    setDashboardConfig(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => 
        widget.id === widgetId ? { ...widget, position: newPosition } : widget
      )
    }));
  };

  // Add widget
  const addWidget = (widgetType) => {
    const newWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      position: { x: 0, y: 0 },
      size: { w: 2, h: 1 }
    };
    
    setDashboardConfig(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));
  };

  // Remove widget
  const removeWidget = (widgetId) => {
    setDashboardConfig(prev => ({
      ...prev,
      widgets: prev.widgets.filter(widget => widget.id !== widgetId)
    }));
  };

  // Change theme
  const changeTheme = (theme) => {
    setDashboardConfig(prev => ({ ...prev, theme }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${dashboardConfig.theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20'}`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-cyan-900 bg-clip-text text-transparent mb-2">
                Customizable Dashboard
              </h1>
              <p className="text-gray-600">Design your perfect productivity workspace</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Theme Selector */}
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => changeTheme('light')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    dashboardConfig.theme === 'light' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => changeTheme('dark')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    dashboardConfig.theme === 'dark' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dark
                </button>
              </div>
              
              {/* Customize Button */}
              <button
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isCustomizing 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings size={16} className="inline mr-1" />
                {isCustomizing ? 'Done' : 'Customize'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardConfig.widgets.map((widget) => {
            const WidgetComponent = widgetComponents[widget.type];
            if (!WidgetComponent) return null;

            return (
              <motion.div
                key={widget.id}
                className={`${widget.size.w === 2 ? 'md:col-span-2' : ''} ${widget.size.h === 2 ? 'md:row-span-2' : ''}`}
                layout
                drag={isCustomizing}
                dragMomentum={false}
                onDragEnd={(event, info) => {
                  // Calculate new position based on drag
                  const newPosition = { x: info.point.x, y: info.point.y };
                  handleWidgetDrag(widget.id, newPosition);
                }}
              >
                <div className="relative group">
                  {WidgetComponent && (
                    <WidgetComponent 
                      data={dashboardData} 
                      theme={dashboardConfig.theme}
                      onCapture={(text) => console.log('Captured:', text)}
                    />
                  )}
                  
                  {isCustomizing && (
                    <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeWidget(widget.id)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add Widget Panel */}
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Widgets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {availableWidgets.map((widget) => (
                <button
                  key={widget.type}
                  onClick={() => addWidget(widget.type)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <widget.icon size={20} className="text-blue-600" />
                    <span className="font-medium text-gray-900">{widget.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{widget.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomizableDashboard;
