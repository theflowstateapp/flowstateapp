import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  X,
  CheckCircle,
  Circle,
  Star,
  Heart,
  DollarSign,
  BookOpen,
  Users,
  Home,
  Car,
  Plane,
  Dumbbell,
  Brain,
  Coffee,
  Music,
  Camera,
  Gamepad2,
  Palette,
  Code,
  PenTool,
  Globe,
  Leaf,
  Zap,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { aiAssistant, LIFE_AREAS } from '../lib/aiAssistant';
import toast from 'react-hot-toast';

const LifeTracker = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [selectedArea, setSelectedArea] = useState('all');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    lifeArea: 'health',
    frequency: 'daily',
    target: 1,
    unit: 'times',
    color: '#3B82F6'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({});

  // Life area configurations
  const lifeAreas = {
    health: {
      name: 'Health & Fitness',
      icon: Dumbbell,
      color: '#EF4444',
      activities: ['Exercise', 'Meditation', 'Sleep', 'Hydration', 'Nutrition']
    },
    finance: {
      name: 'Finance',
      icon: DollarSign,
      color: '#10B981',
      activities: ['Budget Tracking', 'Saving', 'Investing', 'Expense Review']
    },
    career: {
      name: 'Career',
      icon: Target,
      color: '#3B82F6',
      activities: ['Learning', 'Networking', 'Skill Development', 'Goal Setting']
    },
    relationships: {
      name: 'Relationships',
      icon: Heart,
      color: '#EC4899',
      activities: ['Family Time', 'Date Night', 'Friend Meetup', 'Communication']
    },
    learning: {
      name: 'Learning',
      icon: BookOpen,
      color: '#8B5CF6',
      activities: ['Reading', 'Online Course', 'Language Practice', 'Research']
    },
    personal_growth: {
      name: 'Personal Growth',
      icon: Brain,
      color: '#F59E0B',
      activities: ['Journaling', 'Goal Review', 'Self-Reflection', 'New Skills']
    },
    hobbies: {
      name: 'Hobbies',
      icon: Palette,
      color: '#06B6D4',
      activities: ['Creative Projects', 'Gaming', 'Music', 'Art', 'Cooking']
    },
    family: {
      name: 'Family',
      icon: Users,
      color: '#84CC16',
      activities: ['Family Dinner', 'Kids Activities', 'Family Outing', 'Quality Time']
    },
    social: {
      name: 'Social',
      icon: Globe,
      color: '#6366F1',
      activities: ['Social Events', 'Community Service', 'Group Activities']
    },
    spiritual: {
      name: 'Spiritual',
      icon: Leaf,
      color: '#059669',
      activities: ['Prayer', 'Meditation', 'Nature Walk', 'Gratitude']
    },
    travel: {
      name: 'Travel',
      icon: Plane,
      color: '#DC2626',
      activities: ['Trip Planning', 'Local Exploration', 'Cultural Activities']
    },
    home: {
      name: 'Home',
      icon: Home,
      color: '#7C3AED',
      activities: ['Cleaning', 'Organization', 'Home Improvement', 'Decorating']
    }
  };

  useEffect(() => {
    loadActivities();
    loadStats();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('life_activities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activities');
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('life_activity_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const statsData = {};
      Object.keys(lifeAreas).forEach(area => {
        const areaActivities = activities.filter(a => a.life_area === area);
        const areaLogs = data?.filter(log => 
          areaActivities.some(activity => activity.id === log.activity_id)
        ) || [];

        statsData[area] = {
          totalActivities: areaActivities.length,
          completedToday: areaLogs.filter(log => 
            log.date === new Date().toISOString().split('T')[0]
          ).length,
          completedThisWeek: areaLogs.filter(log => 
            new Date(log.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          streak: calculateStreak(areaLogs)
        };
      });

      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const calculateStreak = (logs) => {
    if (!logs.length) return 0;
    
    const sortedLogs = logs
      .map(log => new Date(log.date))
      .sort((a, b) => b - a);

    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasActivity = sortedLogs.some(log => 
        log.toISOString().split('T')[0] === dateStr
      );

      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const addActivity = async () => {
    if (!newActivity.title.trim()) {
      toast.error('Please enter an activity title');
      return;
    }

    setIsLoading(true);

    try {
      // Use AI to enhance the activity
      const aiResult = await aiAssistant.trackLifeActivity(
        newActivity.title,
        newActivity.lifeArea,
        { description: newActivity.description }
      );

      const { data, error } = await supabase
        .from('life_activities')
        .insert({
          user_id: user?.id,
          title: newActivity.title,
          description: newActivity.description,
          life_area: newActivity.lifeArea,
          frequency: newActivity.frequency,
          target: newActivity.target,
          unit: newActivity.unit,
          color: newActivity.color,
          ai_insights: aiResult.success ? aiResult.result : null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setActivities(prev => [data, ...prev]);
      setNewActivity({
        title: '',
        description: '',
        lifeArea: 'health',
        frequency: 'daily',
        target: 1,
        unit: 'times',
        color: '#3B82F6'
      });
      setShowAddActivity(false);
      toast.success('Activity added successfully!');
      loadStats();
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    } finally {
      setIsLoading(false);
    }
  };

  const logActivity = async (activityId, value = 1) => {
    try {
      const { error } = await supabase
        .from('life_activity_logs')
        .insert({
          user_id: user?.id,
          activity_id: activityId,
          value: value,
          date: new Date().toISOString().split('T')[0],
          notes: '',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Activity logged!');
      loadStats();
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error('Failed to log activity');
    }
  };

  const filteredActivities = selectedArea === 'all' 
    ? activities 
    : activities.filter(activity => activity.life_area === selectedArea);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Life Tracker</h1>
          <p className="text-gray-600">Track and manage activities across all areas of your life</p>
        </div>

        {/* Life Areas Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(lifeAreas).map(([key, area]) => {
            const AreaIcon = area.icon;
            const areaStats = stats[key] || { totalActivities: 0, completedToday: 0, streak: 0 };
            
            return (
              <motion.button
                key={key}
                onClick={() => setSelectedArea(selectedArea === key ? 'all' : key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedArea === key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <AreaIcon className="w-6 h-6" style={{ color: area.color }} />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">{area.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {areaStats.totalActivities} activities
                  </div>
                  {areaStats.completedToday > 0 && (
                    <div className="text-xs text-green-600 mt-1">
                      {areaStats.completedToday} today
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Add Activity Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedArea === 'all' ? 'All Activities' : lifeAreas[selectedArea]?.name}
          </h2>
          <motion.button
            onClick={() => setShowAddActivity(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </motion.button>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const area = lifeAreas[activity.life_area];
            const AreaIcon = area?.icon || Target;
            const activityStats = stats[activity.life_area] || {};

            return (
              <motion.div
                key={activity.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${activity.color}20` }}
                    >
                      <AreaIcon 
                        className="w-5 h-5" 
                        style={{ color: activity.color }} 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.frequency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => logActivity(activity.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>

                {activity.description && (
                  <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Target: {activity.target} {activity.unit}
                  </span>
                  {activityStats.streak > 0 && (
                    <span className="text-orange-600 font-medium">
                      🔥 {activityStats.streak} day streak
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
            <p className="text-gray-500 mb-4">
              Start tracking your life activities to see your progress
            </p>
            <button
              onClick={() => setShowAddActivity(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Activity
            </button>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      <AnimatePresence>
        {showAddActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Life Activity</h3>
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Title
                  </label>
                  <input
                    type="text"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Morning Exercise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Optional description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Life Area
                  </label>
                  <select
                    value={newActivity.lifeArea}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, lifeArea: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(lifeAreas).map(([key, area]) => (
                      <option key={key} value={key}>{area.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={newActivity.frequency}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target
                    </label>
                    <input
                      type="number"
                      value={newActivity.target}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddActivity(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addActivity}
                    disabled={isLoading || !newActivity.title.trim()}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      'Add Activity'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LifeTracker;
