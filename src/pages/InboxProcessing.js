import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, CheckCircle, Clock, Target, Archive, Trash2, 
  Calendar, User, Flag, Tag, ArrowRight, Brain, Sparkles,
  Filter, Search, SortAsc, SortDesc, RefreshCw, Zap
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const InboxProcessing = () => {
  const { user } = useAuth();
  const { tasks, projects, areas, resources, addTask, addProject, updateTask } = useData();
  const [inboxItems, setInboxItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [processingStep, setProcessingStep] = useState('review'); // review, decide, organize
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    date: 'all'
  });

  useEffect(() => {
    // Get all inbox items (tasks with status 'inbox')
    const inboxTasks = tasks.filter(task => task.status === 'inbox');
    setInboxItems(inboxTasks);
  }, [tasks]);

  const processItem = (item, action, data = {}) => {
    switch (action) {
      case 'delete':
        // Delete the item
        setInboxItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Item deleted');
        break;
        
      case 'defer':
        // Defer to later (add to tasks with future date)
        const deferredTask = {
          ...item,
          status: 'pending',
          dueDate: data.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          priority: data.priority || 'medium'
        };
        updateTask(deferredTask);
        setInboxItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Task deferred');
        break;
        
      case 'delegate':
        // Delegate to someone
        const delegatedTask = {
          ...item,
          status: 'delegated',
          assignedTo: data.assignedTo,
          priority: data.priority || 'medium'
        };
        updateTask(delegatedTask);
        setInboxItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Task delegated');
        break;
        
      case 'do':
        // Do it now (if < 2 minutes)
        if (data.estimatedTime <= 2) {
          const completedTask = {
            ...item,
            status: 'completed',
            completedAt: new Date()
          };
          updateTask(completedTask);
          setInboxItems(prev => prev.filter(i => i.id !== item.id));
          toast.success('Task completed!');
        } else {
          // Move to next actions
          const nextActionTask = {
            ...item,
            status: 'pending',
            priority: data.priority || 'high'
          };
          updateTask(nextActionTask);
          setInboxItems(prev => prev.filter(i => i.id !== item.id));
          toast.success('Moved to next actions');
        }
        break;
        
      case 'project':
        // Convert to project
        const newProject = {
          id: `project_${Date.now()}`,
          title: item.title,
          description: item.description,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          tasks: []
        };
        addProject(newProject);
        setInboxItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Created new project');
        break;
        
      case 'reference':
        // Move to reference/resource
        const referenceItem = {
          id: `resource_${Date.now()}`,
          title: item.title,
          content: item.description,
          type: 'reference',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        // Add to resources (you'd need to implement this)
        setInboxItems(prev => prev.filter(i => i.id !== item.id));
        toast.success('Moved to reference');
        break;
        
      default:
        break;
    }
    
    // Move to next item
    setCurrentItem(null);
    setProcessingStep('review');
  };

  const getNextItem = () => {
    if (inboxItems.length > 0) {
      setCurrentItem(inboxItems[0]);
    }
  };

  const getItemIcon = (item) => {
    switch (item.type) {
      case 'task': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'project': return <Target className="w-5 h-5 text-green-600" />;
      case 'note': return <Archive className="w-5 h-5 text-purple-600" />;
      default: return <Inbox className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Inbox className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inbox Processing</h1>
                <p className="text-sm text-gray-600">Process your captured items using GTD methodology</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{inboxItems.length} items</span>
              </div>
              <button
                onClick={getNextItem}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>Start Processing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {inboxItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Inbox is Empty!</h3>
            <p className="text-gray-600 mb-6">Great job! All your captured items have been processed.</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>All items organized</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>GTD workflow complete</span>
              </div>
            </div>
          </motion.div>
        ) : currentItem ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* Current Item */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="flex items-start space-x-4 mb-6">
                {getItemIcon(currentItem)}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentItem.title}</h3>
                  <p className="text-gray-600 mb-4">{currentItem.description || 'No description'}</p>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentItem.priority)}`}>
                      {currentItem.priority || 'No priority'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Captured: {new Date(currentItem.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* GTD Processing Options */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">What is this?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Delete */}
                  <button
                    onClick={() => processItem(currentItem, 'delete')}
                    className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <div className="font-medium text-red-900">Delete</div>
                      <div className="text-sm text-red-600">Not actionable or relevant</div>
                    </div>
                  </button>

                  {/* Do Now */}
                  <button
                    onClick={() => processItem(currentItem, 'do', { estimatedTime: 1 })}
                    className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                  >
                    <Zap className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-green-900">Do Now</div>
                      <div className="text-sm text-green-600">Takes less than 2 minutes</div>
                    </div>
                  </button>

                  {/* Defer */}
                  <button
                    onClick={() => processItem(currentItem, 'defer', { 
                      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                      priority: 'medium'
                    })}
                    className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-blue-900">Defer</div>
                      <div className="text-sm text-blue-600">Schedule for later</div>
                    </div>
                  </button>

                  {/* Delegate */}
                  <button
                    onClick={() => processItem(currentItem, 'delegate', { 
                      assignedTo: 'Someone',
                      priority: 'medium'
                    })}
                    className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                  >
                    <User className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium text-purple-900">Delegate</div>
                      <div className="text-sm text-purple-600">Assign to someone else</div>
                    </div>
                  </button>

                  {/* Project */}
                  <button
                    onClick={() => processItem(currentItem, 'project')}
                    className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                  >
                    <Target className="w-5 h-5 text-orange-600" />
                    <div className="text-left">
                      <div className="font-medium text-orange-900">Project</div>
                      <div className="text-sm text-orange-600">Multi-step project</div>
                    </div>
                  </button>

                  {/* Reference */}
                  <button
                    onClick={() => processItem(currentItem, 'reference')}
                    className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Archive className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Reference</div>
                      <div className="text-sm text-gray-600">Store for future reference</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Processing Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Processing Progress</h4>
                <span className="text-sm text-gray-600">
                  {inboxItems.length - inboxItems.indexOf(currentItem)} of {inboxItems.length} remaining
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((inboxItems.length - inboxItems.indexOf(currentItem)) / inboxItems.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Process</h3>
            <p className="text-gray-600 mb-6">You have {inboxItems.length} items waiting to be processed.</p>
            <button
              onClick={getNextItem}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Processing
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InboxProcessing;

