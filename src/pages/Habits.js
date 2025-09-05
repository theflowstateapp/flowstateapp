import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Repeat,
  Plus,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  MoreVertical,
  Filter,
  Search,
  ArrowUpRight,
  Star,
  Zap,
  Bot,
  Sparkles,
  Lightbulb,
  Crown,
  AlertCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
// Removed AIAssistant import - now using dedicated AI Assistant page
import { AI_FEATURES } from '../lib/aiAssistant';
import { usageTracker, USAGE_CATEGORIES } from '../lib/usagePricing';
import aiAssistant from '../lib/aiAssistant';

const Habits = () => {
  const [habits, setHabits] = useState([
    {
      id: 1,
      title: 'Morning Exercise',
      description: '30 minutes of cardio or strength training',
      category: 'Health',
      frequency: 'daily',
      streak: 7,
      longestStreak: 15,
      completedToday: true,
      completedDates: ['2024-05-01', '2024-05-02', '2024-05-03', '2024-05-04', '2024-05-05', '2024-05-06', '2024-05-07'],
      reminder: '08:00',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Read 30 Minutes',
      description: 'Read a book or educational content',
      category: 'Learning',
      frequency: 'daily',
      streak: 12,
      longestStreak: 25,
      completedToday: false,
      completedDates: ['2024-05-01', '2024-05-02', '2024-05-03', '2024-05-04', '2024-05-05', '2024-05-06'],
      reminder: '21:00',
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day',
      category: 'Health',
      frequency: 'daily',
      streak: 3,
      longestStreak: 8,
      completedToday: true,
      completedDates: ['2024-05-05', '2024-05-06', '2024-05-07'],
      reminder: '12:00',
      createdAt: '2024-02-01'
    },
    {
      id: 4,
      title: 'Practice Spanish',
      description: 'Use language learning app for 20 minutes',
      category: 'Learning',
      frequency: 'daily',
      streak: 0,
      longestStreak: 5,
      completedToday: false,
      completedDates: [],
      reminder: '19:00',
      createdAt: '2024-03-01'
    }
  ]);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [usage, setUsage] = useState(null);
  const [canUseAI, setCanUseAI] = useState(true);

  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    category: 'Health',
    frequency: 'daily',
    reminder: ''
  });

  // Initialize AI usage tracking
  useEffect(() => {
    initializeAI();
  }, []);

  const initializeAI = async () => {
    try {
      await usageTracker.initialize();
      const currentUsage = await usageTracker.getCurrentUsage();
      const canUse = await usageTracker.canPerformAction(USAGE_CATEGORIES.AI_REQUESTS, 1);
      
      setUsage(currentUsage);
      setCanUseAI(canUse);
    } catch (error) {
      console.error('Error initializing AI:', error);
    }
  };

  const analyzeHabitsWithAI = async () => {
    if (!canUseAI) {
      toast.error('You have reached your AI usage limit. Please upgrade your plan.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiAssistant.analyzeHabits(habits, {
        currentDate: new Date().toISOString(),
        totalHabits: habits.length,
        activeHabits: habits.filter(h => h.streak > 0).length,
        totalStreaks: habits.reduce((acc, h) => acc + h.streak, 0),
        averageStreak: Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length)
      });

      if (result.success) {
        setAiInsights(result.result);
        setShowAIInsights(true);
        toast.success('AI analysis completed!');
      } else {
        toast.error('AI analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('Something went wrong with AI analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const recommendHabitsWithAI = async () => {
    if (!canUseAI) {
      toast.error('You have reached your AI usage limit. Please upgrade your plan.');
      return;
    }

    try {
      const userProfile = {
        currentHabits: habits.map(h => ({ title: h.title, category: h.category, streak: h.streak })),
        totalHabits: habits.length,
        averageStreak: Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length)
      };

      const result = await aiAssistant.recommendHabits(userProfile, habits);
      
      if (result.success) {
        setAiInsights(result.result);
        setShowAIInsights(true);
        toast.success('Habit recommendations generated!');
      } else {
        toast.error('Failed to generate habit recommendations.');
      }
    } catch (error) {
      console.error('Habit recommendations error:', error);
      toast.error('Something went wrong generating habit recommendations.');
    }
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabit.title || !newHabit.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const habit = {
      id: Date.now(),
      ...newHabit,
      streak: 0,
      longestStreak: 0,
      completedToday: false,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setHabits([...habits, habit]);
    setNewHabit({
      title: '',
      description: '',
      category: 'Health',
      frequency: 'daily',
      reminder: ''
    });
    setShowAddHabit(false);
    toast.success('Habit added successfully!');
  };

  const handleToggleHabit = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompletedToday = habit.completedDates.includes(today);
        let newCompletedDates = [...habit.completedDates];
        let newStreak = habit.streak;
        let newLongestStreak = habit.longestStreak;

        if (isCompletedToday) {
          // Uncomplete today
          newCompletedDates = newCompletedDates.filter(date => date !== today);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          // Complete today
          newCompletedDates.push(today);
          newStreak += 1;
          newLongestStreak = Math.max(newLongestStreak, newStreak);
        }

        return {
          ...habit,
          completedToday: !isCompletedToday,
          completedDates: newCompletedDates,
          streak: newStreak,
          longestStreak: newLongestStreak
        };
      }
      return habit;
    }));
  };

  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    toast.success('Habit deleted successfully!');
  };

  const handleResetStreak = (habitId) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, streak: 0, completedDates: [] }
        : habit
    ));
    toast.success('Streak reset successfully!');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Health': return 'bg-success-100 text-success-700';
      case 'Learning': return 'bg-primary-100 text-primary-700';
      case 'Productivity': return 'bg-warning-100 text-warning-700';
      case 'Relationships': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFrequencyIcon = (frequency) => {
    switch (frequency) {
      case 'daily': return <Calendar size={16} />;
      case 'weekly': return <TrendingUp size={16} />;
      case 'monthly': return <ArrowUpRight size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true;
    if (filter === 'completed') return habit.completedToday;
    if (filter === 'pending') return !habit.completedToday;
    return true;
  });

  const HabitCard = ({ habit }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
            {habit.streak >= 7 && <Star size={16} className="text-warning-500 fill-current" />}
          </div>
          <p className="text-gray-600 text-sm mb-3">{habit.description}</p>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(habit.category)}`}>
              {habit.category}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {getFrequencyIcon(habit.frequency)}
              <span>{habit.frequency}</span>
            </div>
            {habit.reminder && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock size={12} />
                <span>{habit.reminder}</span>
              </div>
            )}
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Streak Information */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Current Streak</span>
          <span className="text-sm text-gray-500">Longest: {habit.longestStreak}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Zap size={16} className="text-warning-500" />
            <span className="text-2xl font-bold text-gray-900">{habit.streak}</span>
            <span className="text-sm text-gray-500">days</span>
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-warning-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((habit.streak / Math.max(habit.longestStreak, 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">This Week</h4>
        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (date.getDay() - index));
            const dateStr = date.toISOString().split('T')[0];
            const isCompleted = habit.completedDates.includes(dateStr);
            
            return (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{day}</div>
                <div className={`w-6 h-6 rounded-full mx-auto ${
                  isCompleted ? 'bg-success-500' : 'bg-gray-200'
                }`}>
                  {isCompleted && <CheckCircle size={12} className="text-white m-auto mt-1" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleToggleHabit(habit.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              habit.completedToday
                ? 'bg-success-100 text-success-700 hover:bg-success-200'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            {habit.completedToday ? 'Completed' : 'Mark Complete'}
          </button>
          <button
            onClick={() => handleResetStreak(habit.id)}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium"
          >
            Reset
          </button>
        </div>
        <button
          onClick={() => handleDeleteHabit(habit.id)}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Habits & Routines</h1>
          <p className="text-gray-600 mt-1">Build positive habits and track your daily routines with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={analyzeHabitsWithAI}
            disabled={!canUseAI || isAnalyzing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              canUseAI 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Bot size={16} />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'AI Insights'}</span>
          </button>
          <button
            onClick={recommendHabitsWithAI}
            disabled={!canUseAI}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              canUseAI 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Lightbulb size={16} />
            <span>Get Recommendations</span>
          </button>
          <button
            onClick={() => setShowAddHabit(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Habit</span>
          </button>
        </div>
      </div>

      {/* AI Usage Status */}
      {usage && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown size={20} className="text-yellow-600" />
              <div>
                <h3 className="font-medium text-gray-900">AI Usage Status</h3>
                <p className="text-sm text-gray-600">
                  AI Requests: {usage.ai_requests || 0} / {usage.ai_requests_limit || '∞'}
                </p>
              </div>
            </div>
            {!canUseAI && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">Upgrade for more AI features</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Habits</p>
              <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Repeat className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {habits.filter(h => h.completedToday).length}
              </p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...habits.map(h => h.streak), 0)}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100)}%
              </p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Habits</option>
              <option value="completed">Completed Today</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search habits..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Habit</h2>
            <form onSubmit={handleAddHabit} className="space-y-4">
              <div>
                <label htmlFor="habit-title" className="block text-sm font-medium text-gray-700 mb-1">Habit Title</label>
                <input
                  id="habit-title"
                  type="text"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter habit title"
                  required
                />
              </div>
              <div>
                <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="habit-description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Describe your habit"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="habit-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="habit-category"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Health">Health</option>
                    <option value="Learning">Learning</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Relationships">Relationships</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    id="habit-frequency"
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                    className="input-field"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="habit-reminder" className="block text-sm font-medium text-gray-700 mb-1">Reminder Time (Optional)</label>
                <input
                  id="habit-reminder"
                  type="time"
                  value={newHabit.reminder}
                  onChange={(e) => setNewHabit({ ...newHabit, reminder: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Habit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddHabit(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      {showAIInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Bot size={24} className="text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">AI Habit Analysis</h2>
              </div>
              <button
                onClick={() => setShowAIInsights(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles size={16} className="text-primary-600" />
                  <h3 className="font-medium text-gray-900">AI-Powered Insights</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Based on your current habits and progress, here are personalized recommendations to optimize your routine.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                    {aiInsights}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAIInsights(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Habits;
