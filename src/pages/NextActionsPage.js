import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Zap,
  Target,
  Calendar,
  Activity,
  Brain,
  Filter,
  Search,
  Plus,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NextActionsPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const nextActions = [
    {
      id: 1,
      title: 'Email project status to team',
      description: 'Send weekly update on project progress',
      context: 'Computer',
      energy: 'Low',
      time: '5 mins',
      priority: 'high',
      dueDate: 'Today',
      status: 'pending',
      category: 'Communication'
    },
    {
      id: 2,
      title: 'Research competitor analysis',
      description: 'Analyze top 3 competitors and their strategies',
      context: 'Computer',
      energy: 'High',
      time: '45 mins',
      priority: 'medium',
      dueDate: 'Tomorrow',
      status: 'pending',
      category: 'Research'
    },
    {
      id: 3,
      title: 'Schedule team meeting',
      description: 'Find time slot for next sprint planning',
      context: 'Phone',
      energy: 'Low',
      time: '10 mins',
      priority: 'high',
      dueDate: 'Today',
      status: 'in_progress',
      category: 'Planning'
    },
    {
      id: 4,
      title: 'Update project documentation',
      description: 'Add latest changes to project wiki',
      context: 'Computer',
      energy: 'Medium',
      time: '30 mins',
      priority: 'low',
      dueDate: 'This week',
      status: 'pending',
      category: 'Documentation'
    },
    {
      id: 5,
      title: 'Review code pull requests',
      description: 'Check and approve pending PRs',
      context: 'Computer',
      energy: 'High',
      time: '20 mins',
      priority: 'medium',
      dueDate: 'Today',
      status: 'pending',
      category: 'Development'
    },
    {
      id: 6,
      title: 'Call client for follow-up',
      description: 'Discuss project timeline and next steps',
      context: 'Phone',
      energy: 'Medium',
      time: '15 mins',
      priority: 'high',
      dueDate: 'Tomorrow',
      status: 'pending',
      category: 'Communication'
    }
  ];

  const filteredActions = nextActions.filter(action => {
    const matchesFilter = filter === 'all' || action.status === filter || action.priority === filter;
    const matchesSearch = action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        action.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEnergyColor = (energy) => {
    switch (energy) {
      case 'High': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Next Actions</h1>
          <p className="text-gray-600">AI-optimized action items based on your context and energy</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Action</span>
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">2.5h</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">4</div>
              <div className="text-sm text-gray-600">Computer Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">2</div>
              <div className="text-sm text-gray-600">Phone Tasks</div>
            </div>
          </div>
        </motion.div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Energy Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnergyColor(action.energy)}`}>
                    {action.energy}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
                    {action.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <span className="text-sm font-medium text-gray-900">{action.time}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Context</span>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{action.context}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Due</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{action.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium text-gray-900">{action.category}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                  Start Action
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No actions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or add a new action</p>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Add New Action
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NextActionsPage;
