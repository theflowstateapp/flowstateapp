import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Plus, Archive, CheckCircle, Clock, Star, Tag, Search, Filter,
  MoreVertical, Edit, Trash2, Send, Sparkles, MessageCircle,
  X, Loader, Target, Calendar, User, ArrowRight, Bot, Zap,
  BookOpen, Heart, DollarSign, GraduationCap, Users, TrendingUp,
  FileText, BookMarked, AlertCircle, Play, Pause, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Inbox = () => {
  const { user } = useAuth();
  const { tasks, projects, areas, resources, archives, loading, createTask, createProject, updateTask } = useData();
  const navigate = useNavigate();
  
  const [quickInput, setQuickInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showQuickDrop, setShowQuickDrop] = useState(true);
  const [processingItem, setProcessingItem] = useState(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  // Get inbox items (tasks without status or with 'inbox' status)
  const inboxItems = tasks?.filter(task => 
    !task.status || task.status === 'inbox' || task.status === 'active'
  ) || [];

  // GTD Processing Options
  const processingOptions = [
    {
      id: 'project',
      name: 'Project',
      description: 'Multi-step outcome with deadline',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: 'Move to Projects'
    },
    {
      id: 'next-action',
      name: 'Next Action',
      description: 'Single step you can do now',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: 'Create Task'
    },
    {
      id: 'waiting-for',
      name: 'Waiting For',
      description: 'Something you\'re waiting for',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: 'Mark as Waiting'
    },
    {
      id: 'someday-maybe',
      name: 'Someday/Maybe',
      description: 'Future possibility',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: 'Move to Someday'
    },
    {
      id: 'reference',
      name: 'Reference',
      description: 'Information to keep',
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      action: 'Move to Resources'
    },
    {
      id: 'trash',
      name: 'Trash',
      description: 'Not actionable or useful',
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: 'Delete'
    }
  ];

  // Life Areas for categorization
  const lifeAreas = [
    { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'text-red-600' },
    { id: 'finance', name: 'Finance', icon: DollarSign, color: 'text-green-600' },
    { id: 'learning', name: 'Learning', icon: GraduationCap, color: 'text-blue-600' },
    { id: 'relationships', name: 'Relationships', icon: Users, color: 'text-pink-600' },
    { id: 'career', name: 'Career', icon: TrendingUp, color: 'text-purple-600' },
    { id: 'personal', name: 'Personal', icon: User, color: 'text-gray-600' }
  ];

  const addQuickItem = async (text) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Create a new task in inbox status
      const newTask = {
        title: text,
        description: text,
        status: 'inbox',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        tags: []
      };
      
      await createTask(newTask);
      setQuickInput('');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    addQuickItem(quickInput);
  };

  const processItem = (item, option) => {
    setProcessingItem({ item, option });
    setShowProcessingModal(true);
  };

  const handleProcessAction = async (item, option) => {
    try {
      switch (option.id) {
        case 'project':
          // Create a project
          const newProject = {
            name: item.title,
            description: item.description || item.title,
            status: 'active',
            priority: item.priority || 'medium',
            createdAt: new Date().toISOString()
          };
          await createProject(newProject);
          break;
          
        case 'next-action':
          // Update task to active status
          await updateTask(item.id, { 
            ...item, 
            status: 'active',
            processedAt: new Date().toISOString()
          });
          break;
          
        case 'waiting-for':
          // Update task to waiting status
          await updateTask(item.id, { 
            ...item, 
            status: 'waiting',
            processedAt: new Date().toISOString()
          });
          break;
          
        case 'someday-maybe':
          // Move to someday/maybe (archive with special status)
          await updateTask(item.id, { 
            ...item, 
            status: 'someday',
            processedAt: new Date().toISOString()
          });
          break;
          
        case 'reference':
          // Move to resources
          await updateTask(item.id, { 
            ...item, 
            status: 'reference',
            processedAt: new Date().toISOString()
          });
          break;
          
        case 'trash':
          // Delete the task
          await updateTask(item.id, { 
            ...item, 
            status: 'deleted',
            processedAt: new Date().toISOString()
          });
          break;
      }
    } catch (error) {
      console.error('Error processing item:', error);
    } finally {
      setShowProcessingModal(false);
      setProcessingItem(null);
    }
  };

  const filteredItems = inboxItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Archive className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
          </div>
          
          {/* Process Inbox Button */}
          <button
            onClick={() => navigate('/inbox-processing')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Process Inbox</span>
          </button>
        </div>
        <p className="text-gray-600">Capture everything here first, then process into your system</p>
      </div>

      {/* Quick Capture */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Quick Capture</h2>
        </div>
        
        <form onSubmit={handleQuickSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="What's on your mind? (task, idea, reminder...)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={!quickInput.trim() || isProcessing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isProcessing ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              <span>Capture</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Sparkles size={14} />
              <span>AI will suggest categories</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>Process later</span>
            </div>
            <div className="flex items-center space-x-1">
              <Tag size={14} />
              <span>Auto-tagging</span>
            </div>
          </div>
        </form>
      </motion.div>

      {/* GTD Processing Guide */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">GTD Processing Guide</h2>
        </div>
        <p className="text-gray-700 mb-4">
          For each inbox item, ask: <strong>"What is it?"</strong> and <strong>"Is it actionable?"</strong>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {processingOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 text-sm">
              <div className={`p-1 rounded ${option.bgColor}`}>
                <option.icon className={`w-4 h-4 ${option.color}`} />
              </div>
              <span className="font-medium text-gray-900">{option.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Inbox Items ({filteredItems.length})</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search inbox..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Items</option>
              <option value="inbox">Inbox</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        {/* Inbox Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Archive className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inbox is empty!</h3>
              <p className="text-gray-600 mb-4">Great job! Your inbox is clear.</p>
              <button
                onClick={() => setShowQuickDrop(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
              >
                <Plus size={16} />
                <span>Add something</span>
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {item.status}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {item.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => processItem(item, processingOptions[0])}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Process this item"
                    >
                      <Play size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inboxItems.length}</p>
            </div>
            <Archive className="text-blue-500" size={24} />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Needs Processing</p>
              <p className="text-2xl font-bold text-red-600">
                {inboxItems.filter(item => item.status === 'inbox').length}
              </p>
            </div>
            <AlertCircle className="text-red-500" size={24} />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processed Today</p>
              <p className="text-2xl font-bold text-green-600">
                {inboxItems.filter(item => 
                  item.processedAt && 
                  new Date(item.processedAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Processing Modal */}
      <AnimatePresence>
        {showProcessingModal && processingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Process Item</h3>
                <button
                  onClick={() => setShowProcessingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">{processingItem.item.title}</h4>
                <p className="text-gray-600 text-sm">{processingItem.item.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {processingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleProcessAction(processingItem.item, option)}
                    className={`p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors text-left ${option.bgColor}`}
                  >
                    <div className="flex items-center space-x-3">
                      <option.icon className={`w-5 h-5 ${option.color}`} />
                      <div>
                        <p className="font-medium text-gray-900">{option.name}</p>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inbox;