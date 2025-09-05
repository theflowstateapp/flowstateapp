import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  MoreVertical,
  Filter,
  Search,
  X,
  ArrowUpRight,
  Bot,
  Sparkles,
  Lightbulb,
  TrendingUp,
  Zap,
  Crown,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
// Removed AIAssistant import - now using dedicated AI Assistant page
import { AI_FEATURES } from '../lib/aiAssistant';
import { usageTracker, USAGE_CATEGORIES } from '../lib/usagePricing';
import aiAssistant from '../lib/aiAssistant';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Launch Business',
      description: 'Start my own tech consulting business',
      category: 'Career',
      priority: 'high',
      status: 'in-progress',
      progress: 75,
      targetDate: '2024-12-31',
      milestones: [
        { id: 1, title: 'Business Plan', completed: true },
        { id: 2, title: 'Legal Setup', completed: true },
        { id: 3, title: 'First Client', completed: true },
        { id: 4, title: 'Website Launch', completed: false }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Learn Spanish',
      description: 'Achieve conversational fluency in Spanish',
      category: 'Learning',
      priority: 'medium',
      status: 'in-progress',
      progress: 45,
      targetDate: '2024-08-15',
      milestones: [
        { id: 1, title: 'Complete Basic Course', completed: true },
        { id: 2, title: 'Practice Speaking', completed: true },
        { id: 3, title: 'Watch Spanish Movies', completed: false },
        { id: 4, title: 'Have First Conversation', completed: false },
        { id: 5, title: 'Take Proficiency Test', completed: false }
      ],
      createdAt: '2024-02-01'
    },
    {
      id: 3,
      title: 'Run a Marathon',
      description: 'Complete a full marathon in under 4 hours',
      category: 'Health',
      priority: 'high',
      status: 'not-started',
      progress: 0,
      targetDate: '2024-10-20',
      milestones: [
        { id: 1, title: 'Start Training Program', completed: false },
        { id: 2, title: 'Run 10K', completed: false },
        { id: 3, title: 'Run Half Marathon', completed: false },
        { id: 4, title: 'Complete Marathon', completed: false }
      ],
      createdAt: '2024-03-01'
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [usage, setUsage] = useState(null);
  const [canUseAI, setCanUseAI] = useState(true);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Career',
    priority: 'medium',
    targetDate: '',
    milestones: []
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

  const analyzeGoalsWithAI = async () => {
    if (!canUseAI) {
      toast.error('You have reached your AI usage limit. Please upgrade your plan.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiAssistant.analyzeGoals(goals, {
        currentDate: new Date().toISOString(),
        totalGoals: goals.length,
        completedGoals: goals.filter(g => g.status === 'completed').length,
        inProgressGoals: goals.filter(g => g.status === 'in-progress').length
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

  const generateSMARTGoals = async (area) => {
    if (!canUseAI) {
      toast.error('You have reached your AI usage limit. Please upgrade your plan.');
      return;
    }

    try {
      const result = await aiAssistant.generateSMARTGoals(area, goals);
      
      if (result.success) {
        // Parse the AI response and create new goals
        const aiResponse = result.result;
        // This would need more sophisticated parsing, but for now we'll show the response
        setAiInsights(aiResponse);
        setShowAIInsights(true);
        toast.success('SMART goals generated!');
      } else {
        toast.error('Failed to generate SMART goals.');
      }
    } catch (error) {
      console.error('SMART goals generation error:', error);
      toast.error('Something went wrong generating SMART goals.');
    }
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.description || !newGoal.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      status: 'not-started',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'Career',
      priority: 'medium',
      targetDate: '',
      milestones: []
    });
    setShowAddGoal(false);
    toast.success('Goal added successfully!');
  };



  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
    toast.success('Goal deleted successfully!');
  };

  const handleToggleMilestone = (goalId, milestoneId) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...goal, milestones: updatedMilestones, progress };
      }
      return goal;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700';
      case 'in-progress': return 'bg-primary-100 text-primary-700';
      case 'not-started': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-700';
      case 'medium': return 'bg-warning-100 text-warning-700';
      case 'low': return 'bg-success-100 text-success-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    if (filter === 'completed') return goal.status === 'completed';
    if (filter === 'in-progress') return goal.status === 'in-progress';
    if (filter === 'not-started') return goal.status === 'not-started';
    return true;
  });

  const GoalCard = ({ goal }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
            {goal.priority === 'high' && <Star size={16} className="text-danger-500 fill-current" />}
          </div>
          <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
              {goal.status.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
              {goal.priority}
            </span>
            <span className="text-xs text-gray-500">{goal.category}</span>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
        <div className="space-y-2">
          {goal.milestones.slice(0, 3).map((milestone) => (
            <div key={milestone.id} className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                className={`p-1 rounded ${
                  milestone.completed 
                    ? 'text-success-600 bg-success-50' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <CheckCircle size={14} className={milestone.completed ? 'fill-current' : ''} />
              </button>
              <span className={`text-sm ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {milestone.title}
              </span>
            </div>
          ))}
          {goal.milestones.length > 3 && (
            <p className="text-xs text-gray-500">+{goal.milestones.length - 3} more milestones</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedGoal(goal)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => handleDeleteGoal(goal.id)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Calendar size={12} />
          <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 space-y-4" data-testid="goals-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goals & Vision</h1>
          <p className="text-sm text-gray-600 mt-1">Set meaningful goals and track your progress with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={analyzeGoalsWithAI}
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
            onClick={() => setShowAddGoal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Goal</span>
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
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Target className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter(g => g.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {goals.filter(g => g.status === 'completed').length}
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
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
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
              <option value="all">All Goals</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search goals..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Goal</h2>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Describe your goal"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Learning">Learning</option>
                    <option value="Finance">Finance</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Details Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{selectedGoal.title}</h2>
              <button
                onClick={() => setSelectedGoal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedGoal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                  <p className="text-gray-900">{selectedGoal.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Priority</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedGoal.priority)}`}>
                    {selectedGoal.priority}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Target Date</h3>
                  <p className="text-gray-900">{new Date(selectedGoal.targetDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Progress</h3>
                  <p className="text-gray-900">{selectedGoal.progress}%</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Milestones</h3>
                <div className="space-y-3">
                  {selectedGoal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => handleToggleMilestone(selectedGoal.id, milestone.id)}
                        className={`p-2 rounded-lg ${
                          milestone.completed 
                            ? 'text-success-600 bg-success-100' 
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <CheckCircle size={16} className={milestone.completed ? 'fill-current' : ''} />
                      </button>
                      <span className={`flex-1 ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                <h2 className="text-xl font-semibold text-gray-900">AI Goal Analysis</h2>
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
                  Based on your current goals and progress, here are personalized recommendations to help you achieve more.
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

export default Goals;
