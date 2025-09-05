import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Palette, Layout, Check, Eye, RefreshCw, Save, 
  BarChart3, Calendar, Target, Clock, TrendingUp, 
  Users, DollarSign, BookOpen, Heart, Activity, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const CustomizeModal = ({ isOpen, onClose, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState('themes');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [selectedWidgets, setSelectedWidgets] = useState([
    'tasks', 'projects', 'goals', 'habits', 'analytics'
  ]);

  const themes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean and professional',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#06B6D4'
      },
      preview: 'bg-gradient-to-br from-blue-50 to-purple-50'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes',
      colors: {
        primary: '#1F2937',
        secondary: '#374151',
        accent: '#6B7280'
      },
      preview: 'bg-gradient-to-br from-gray-900 to-gray-800'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Calm and refreshing',
      colors: {
        primary: '#059669',
        secondary: '#10B981',
        accent: '#34D399'
      },
      preview: 'bg-gradient-to-br from-green-50 to-emerald-50'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm and energetic',
      colors: {
        primary: '#F59E0B',
        secondary: '#EF4444',
        accent: '#F97316'
      },
      preview: 'bg-gradient-to-br from-orange-50 to-red-50'
    }
  ];

  const availableWidgets = [
    { id: 'tasks', name: 'Tasks', icon: Check, description: 'Your task list and progress' },
    { id: 'projects', name: 'Projects', icon: Target, description: 'Active project overview' },
    { id: 'goals', name: 'Goals', icon: TrendingUp, description: 'Goal tracking and progress' },
    { id: 'habits', name: 'Habits', icon: Activity, description: 'Daily habit tracking' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, description: 'Productivity insights' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, description: 'Upcoming events' },
    { id: 'time', name: 'Time Tracking', icon: Clock, description: 'Time management' },
    { id: 'team', name: 'Team', icon: Users, description: 'Collaboration tools' },
    { id: 'finance', name: 'Finance', icon: DollarSign, description: 'Financial overview' },
    { id: 'learning', name: 'Learning', icon: BookOpen, description: 'Knowledge tracking' },
    { id: 'health', name: 'Health', icon: Heart, description: 'Wellness metrics' },
    { id: 'ai', name: 'AI Assistant', icon: Zap, description: 'Smart recommendations' }
  ];

  const handleWidgetToggle = (widgetId) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleApplyTheme = () => {
    // Apply theme to localStorage and show success message
    localStorage.setItem('dashboardTheme', selectedTheme);
    if (onThemeChange) {
      onThemeChange(selectedTheme);
    }
    toast.success(`Applied ${themes.find(t => t.id === selectedTheme)?.name} theme!`);
    onClose();
  };

  const handleSaveLayout = () => {
    // Save widget layout to localStorage
    localStorage.setItem('dashboardWidgets', JSON.stringify(selectedWidgets));
    toast.success('Dashboard layout saved!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Customize Dashboard</h2>
                <p className="text-sm text-gray-600">Personalize your workspace</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'themes'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Themes</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('widgets')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'widgets'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Layout className="w-4 h-4" />
                <span>Widgets</span>
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'themes' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedTheme === theme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {selectedTheme === theme.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div className={`w-full h-16 rounded-lg mb-3 ${theme.preview}`}></div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                          <p className="text-sm text-gray-600">{theme.description}</p>
                          
                          <div className="flex space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.colors.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.colors.secondary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.colors.accent }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'widgets' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Widgets</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Select which widgets to display on your dashboard
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableWidgets.map((widget) => {
                      const Icon = widget.icon;
                      const isSelected = selectedWidgets.includes(widget.id);
                      
                      return (
                        <div
                          key={widget.id}
                          onClick={() => handleWidgetToggle(widget.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-blue-500' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                isSelected ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">{widget.name}</h4>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Preview changes in real-time</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={activeTab === 'themes' ? handleApplyTheme : handleSaveLayout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{activeTab === 'themes' ? 'Apply Theme' : 'Save Layout'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomizeModal;
