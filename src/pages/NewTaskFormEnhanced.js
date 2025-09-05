// Enhanced AI with Memory and Pattern Learning
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Save, Sparkles, Calendar, Tag, Settings, Clock, User, MapPin, Target, Repeat, FileText, Plus, X, Link, Paperclip, CheckSquare, AlertCircle, Star, Eye, EyeOff, Users, DollarSign, BarChart3, Milestone, FolderOpen, GitBranch, Shield, Globe, Building2, Brain, Zap, Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { processTaskWithAI } from '../lib/enhancedAI';

const NewTaskFormEnhanced = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // UI States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showMemoryInsights, setShowMemoryInsights] = useState(false);
  const [memoryInsights, setMemoryInsights] = useState({});
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);

  // Form Data - Enhanced with memory integration
  const [formData, setFormData] = useState({
    // Core Information
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    type: 'Task',
    
    // Time & Scheduling
    startDate: '',
    dueDate: '',
    estimatedHours: '',
    actualHours: '',
    reminderTime: '',
    reminderType: 'email',
    
    // Task Details
    project: '',
    section: '',
    tags: [],
    context: '',
    location: '',
    
    // Team & Collaboration
    assignee: '',
    watchers: [],
    team: '',
    
    // Advanced Features
    dependencies: [],
    blockedBy: '',
    relatedTasks: [],
    subtasks: [],
    attachments: [],
    links: [],
    customFields: {},
    
    // Recurring Task
    isRecurring: false,
    recurrencePattern: '',
    recurrenceInterval: 1,
    recurrenceDays: [],
    recurrenceEndDate: '',
    
    // Metadata
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: user?.id || '',
    lastModifiedBy: user?.id || ''
  });

  // Mock Data - Enhanced with memory-based suggestions
  const mockData = {
    taskTypes: [
      { value: 'Task', label: 'Task', icon: '📋' },
      { value: 'Meeting', label: 'Meeting', icon: '🤝' },
      { value: 'Bug', label: 'Bug', icon: '🐛' },
      { value: 'Feature', label: 'Feature', icon: '✨' },
      { value: 'Research', label: 'Research', icon: '🔬' },
      { value: 'Review', label: 'Review', icon: '👀' },
      { value: 'Call', label: 'Call', icon: '📞' },
      { value: 'Email', label: 'Email', icon: '📧' }
    ],
    
    statuses: [
      { value: 'Not Started', label: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-100' },
      { value: 'In Progress', label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-100' },
      { value: 'Completed', label: 'Completed', color: 'text-green-600', bg: 'bg-green-100' },
      { value: 'On Hold', label: 'On Hold', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      { value: 'Cancelled', label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' }
    ],
    
    priorities: [
      { value: 'Low', label: 'Low', color: 'text-green-600', bg: 'bg-green-100', icon: '🟢' },
      { value: 'Medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🟡' },
      { value: 'High', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100', icon: '🟠' },
      { value: 'Critical', label: 'Critical', color: 'text-red-600', bg: 'bg-red-100', icon: '🔴' }
    ],
    
    contexts: [
      { value: 'At Computer', label: 'At Computer', icon: '💻' },
      { value: 'At Phone', label: 'At Phone', icon: '📱' },
      { value: 'At Office', label: 'At Office', icon: '🏢' },
      { value: 'At Home', label: 'At Home', icon: '🏠' },
      { value: 'Errands', label: 'Errands', icon: '🚗' },
      { value: 'Anywhere', label: 'Anywhere', icon: '🌍' }
    ],
    
    commonTags: [
      'urgent', 'important', 'meeting', 'call', 'email', 'review', 'bug', 'feature',
      'research', 'planning', 'execution', 'follow-up', 'blocked', 'waiting',
      'delegated', 'personal', 'work', 'health', 'family', 'finance', 'learning'
    ]
  };

  // Load user's task memory and patterns
  const loadUserTaskMemory = useCallback(async () => {
    if (!user) return;
    
    setIsLoadingMemory(true);
    try {
      // Get recent tasks for pattern analysis
      const { data: recentTasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Analyze patterns
      const patterns = analyzeTaskPatterns(recentTasks || []);
      setMemoryInsights(patterns);
    } catch (error) {
      console.error('Error loading task memory:', error);
    } finally {
      setIsLoadingMemory(false);
    }
  }, [user]);

  // Analyze task patterns for AI learning
  const analyzeTaskPatterns = (tasks) => {
    const patterns = {
      frequentAssignees: {},
      commonTags: {},
      typicalDurations: {},
      priorityPatterns: {},
      contextPatterns: {},
      timePatterns: {},
      similarTasks: []
    };

    tasks.forEach(task => {
      // Analyze assignees
      if (task.assignee_id) {
        patterns.frequentAssignees[task.assignee_id] = (patterns.frequentAssignees[task.assignee_id] || 0) + 1;
      }

      // Analyze tags
      if (task.tags) {
        task.tags.forEach(tag => {
          patterns.commonTags[tag] = (patterns.commonTags[tag] || 0) + 1;
        });
      }

      // Analyze durations
      if (task.estimated_hours) {
        const duration = Math.round(task.estimated_hours);
        patterns.typicalDurations[duration] = (patterns.typicalDurations[duration] || 0) + 1;
      }

      // Analyze priorities
      if (task.priority_matrix) {
        patterns.priorityPatterns[task.priority_matrix] = (patterns.priorityPatterns[task.priority_matrix] || 0) + 1;
      }

      // Analyze contexts
      if (task.life_area_id) {
        patterns.contextPatterns[task.life_area_id] = (patterns.contextPatterns[task.life_area_id] || 0) + 1;
      }

      // Analyze time patterns
      if (task.do_date) {
        const dayOfWeek = new Date(task.do_date).getDay();
        patterns.timePatterns[dayOfWeek] = (patterns.timePatterns[dayOfWeek] || 0) + 1;
      }
    });

    return patterns;
  };

  // Enhanced AI Analysis with Memory Integration
  const handleAIAnalysis = useCallback(async () => {
    if (!formData.title.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Get AI suggestions
      const suggestions = await processTaskWithAI(formData.title);
      
      // Apply suggestions to form data
      const updatedFormData = { ...formData };
      
      suggestions.forEach(suggestion => {
        if (suggestion.field && suggestion.value !== undefined) {
          updatedFormData[suggestion.field] = suggestion.value;
        }
      });

      // Apply memory-based insights
      const memorySuggestions = applyMemoryInsights(formData.title, memoryInsights);
      memorySuggestions.forEach(suggestion => {
        if (suggestion.field && suggestion.value !== undefined) {
          updatedFormData[suggestion.field] = suggestion.value;
        }
      });
      
      setFormData(updatedFormData);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to basic pattern matching
      const basicSuggestions = basicPatternAnalysis(formData.title);
      const updatedFormData = { ...formData };
      
      basicSuggestions.forEach(suggestion => {
        if (suggestion.field && suggestion.value !== undefined) {
          updatedFormData[suggestion.field] = suggestion.value;
        }
      });
      
      setFormData(updatedFormData);
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData.title, formData, memoryInsights]);

  // Apply memory insights to current task
  const applyMemoryInsights = (title, insights) => {
    const suggestions = [];
    const lowerTitle = title.toLowerCase();

    // Suggest frequent assignees for similar tasks
    if (lowerTitle.includes('meeting') || lowerTitle.includes('call')) {
      const topAssignee = Object.entries(insights.frequentAssignees || {})
        .sort(([,a], [,b]) => b - a)[0];
      if (topAssignee) {
        suggestions.push({ field: 'assignee', value: topAssignee[0] });
      }
    }

    // Suggest common tags
    const topTags = Object.entries(insights.commonTags || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);
    
    if (topTags.length > 0) {
      suggestions.push({ field: 'tags', value: topTags });
    }

    // Suggest typical duration
    const topDuration = Object.entries(insights.typicalDurations || {})
      .sort(([,a], [,b]) => b - a)[0];
    if (topDuration) {
      suggestions.push({ field: 'estimatedHours', value: topDuration[0] });
    }

    // Suggest priority based on patterns
    const topPriority = Object.entries(insights.priorityPatterns || {})
      .sort(([,a], [,b]) => b - a)[0];
    if (topPriority) {
      const priorityMap = {
        'Priority 1. Urgent & Important': 'Critical',
        'Priority 2. Important, Not Urgent': 'High',
        'Priority 3. Urgent, Not Important': 'Medium',
        'Priority 4. Low': 'Low'
      };
      suggestions.push({ field: 'priority', value: priorityMap[topPriority[0]] || 'Medium' });
    }

    return suggestions;
  };

  // Load memory on component mount
  useEffect(() => {
    loadUserTaskMemory();
  }, [loadUserTaskMemory]);

  // Basic pattern analysis fallback
  const basicPatternAnalysis = (input) => {
    const lowerInput = input.toLowerCase();
    const suggestions = [];

    // Task type detection
    if (lowerInput.includes('meeting') || lowerInput.includes('call')) {
      suggestions.push({ field: 'type', value: 'Meeting' });
    } else if (lowerInput.includes('bug') || lowerInput.includes('fix')) {
      suggestions.push({ field: 'type', value: 'Bug' });
    } else if (lowerInput.includes('feature') || lowerInput.includes('new')) {
      suggestions.push({ field: 'type', value: 'Feature' });
    }

    // Priority detection
    if (lowerInput.includes('urgent') || lowerInput.includes('asap') || lowerInput.includes('critical')) {
      suggestions.push({ field: 'priority', value: 'Critical' });
    } else if (lowerInput.includes('important') || lowerInput.includes('high priority')) {
      suggestions.push({ field: 'priority', value: 'High' });
    }

    // Context detection
    if (lowerInput.includes('call') || lowerInput.includes('phone')) {
      suggestions.push({ field: 'context', value: 'At Phone' });
    } else if (lowerInput.includes('computer') || lowerInput.includes('laptop')) {
      suggestions.push({ field: 'context', value: 'At Computer' });
    }

    // Time detection
    const timeMatch = lowerInput.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)/i);
    if (timeMatch) {
      const hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const period = timeMatch[3].toLowerCase();
      
      let hour24 = hour;
      if (period.includes('pm') && hour !== 12) {
        hour24 = hour + 12;
      } else if (period.includes('am') && hour === 12) {
        hour24 = 0;
      }
      
      const timeString = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      suggestions.push({ field: 'reminderTime', value: timeString });
    }

    // Date detection
    if (lowerInput.includes('today')) {
      suggestions.push({ field: 'dueDate', value: new Date().toISOString().split('T')[0] });
    } else if (lowerInput.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      suggestions.push({ field: 'dueDate', value: tomorrow.toISOString().split('T')[0] });
    }

    return suggestions;
  };

  // Helper functions for database mapping
  const getPriorityMatrix = (priority) => {
    switch (priority) {
      case 'Critical': return 'Priority 1. Urgent & Important';
      case 'High': return 'Priority 2. Important, Not Urgent';
      case 'Medium': return 'Priority 3. Urgent, Not Important';
      case 'Low': return 'Priority 4. Low';
      default: return 'Priority 4. Low';
    }
  };

  const getDailyPriority = (priority) => {
    switch (priority) {
      case 'Critical': return 5;
      case 'High': return 4;
      case 'Medium': return 3;
      case 'Low': return 2;
      default: return 1;
    }
  };

  // Handle form submission with enhanced memory storage
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      const taskData = {
        name: formData.title, // Changed from 'title' to 'name' to match DB schema
        description: formData.description || '',
        status: formData.status,
        do_date: formData.dueDate || null, // Changed from 'due_date' to 'do_date'
        start_date: formData.startDate || null,
        deadline_date: formData.dueDate || null, // Added deadline_date
        is_important: formData.priority === 'High' || formData.priority === 'Critical',
        is_urgent: formData.priority === 'Critical',
        priority_matrix: getPriorityMatrix(formData.priority),
        assignee_id: formData.assignee || null,
        daily_priority: getDailyPriority(formData.priority),
        dependency_report: 'Actionable', // Default value
        life_area_id: formData.context || null,
        estimated_hours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
        actual_hours: formData.actualHours ? parseFloat(formData.actualHours) : null,
        tags: formData.tags || [],
        notes: formData.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (error) {
        throw error;
      }
      
      // Update memory after successful creation
      await loadUserTaskMemory();
      
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`Error creating task: ${error.message}`);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Enhanced Header with Memory Integration */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Tasks</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Task</h1>
              <p className="text-gray-600 text-lg">AI-powered task creation with memory learning</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">AI Powered</span>
              </div>
              <button
                onClick={() => setShowMemoryInsights(!showMemoryInsights)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  showMemoryInsights 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">Memory</span>
              </button>
            </div>
          </div>
        </div>

        {/* Memory Insights Panel */}
        {showMemoryInsights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              AI Memory Insights
            </h3>
            
            {isLoadingMemory ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
                <span className="ml-3 text-gray-600">Loading your task patterns...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Frequent Assignees */}
                {memoryInsights.frequentAssignees && Object.keys(memoryInsights.frequentAssignees).length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Frequent Assignees</h4>
                    <div className="space-y-1">
                      {Object.entries(memoryInsights.frequentAssignees)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([assignee, count]) => (
                          <div key={assignee} className="flex justify-between text-sm">
                            <span className="text-purple-700">{assignee}</span>
                            <span className="text-purple-600">{count} tasks</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Common Tags */}
                {memoryInsights.commonTags && Object.keys(memoryInsights.commonTags).length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Common Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(memoryInsights.commonTags)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([tag, count]) => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {tag} ({count})
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Typical Duration */}
                {memoryInsights.typicalDurations && Object.keys(memoryInsights.typicalDurations).length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Typical Duration</h4>
                    <div className="space-y-1">
                      {Object.entries(memoryInsights.typicalDurations)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([hours, count]) => (
                          <div key={hours} className="flex justify-between text-sm">
                            <span className="text-green-700">{hours} hours</span>
                            <span className="text-green-600">{count} tasks</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Priority Patterns */}
                {memoryInsights.priorityPatterns && Object.keys(memoryInsights.priorityPatterns).length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">Priority Patterns</h4>
                    <div className="space-y-1">
                      {Object.entries(memoryInsights.priorityPatterns)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 3)
                        .map(([priority, count]) => (
                          <div key={priority} className="flex justify-between text-sm">
                            <span className="text-orange-700">{priority.split('.')[1]?.trim() || priority}</span>
                            <span className="text-orange-600">{count} tasks</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enhanced Core Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-600" />
              Core Information
            </h2>
            
            <div className="space-y-6">
              {/* Enhanced Title with AI Button */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Task Title *</label>
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder="What needs to be done?"
                      required
                    />
                    {formData.title && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAIAnalysis}
                    disabled={!formData.title.trim() || isAnalyzing}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                      !formData.title.trim() || isAnalyzing
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                    title="Use AI to analyze title and fill fields"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>AI Analyze</span>
                      </>
                    )}
                  </button>
                </div>
                {formData.title && (
                  <p className="mt-2 text-sm text-gray-500">
                    💡 Try: "Urgent meeting with Sarah tomorrow at 2pm about the project"
                  </p>
                )}
              </div>

              {/* Enhanced Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Add details, context, or notes about this task..."
                />
              </div>

              {/* Enhanced Type, Status, Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  >
                    {mockData.taskTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  >
                    {mockData.statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  >
                    {mockData.priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.icon} {priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Time & Scheduling */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-600" />
              Time & Scheduling
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder="0.5"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Reminder Time</label>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => handleInputChange('reminderTime', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Enhanced Recurring Task */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  />
                  <span className="text-sm font-semibold text-gray-700">Recurring Task</span>
                </label>
              </div>
              
              {formData.isRecurring && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Pattern</label>
                    <select
                      value={formData.recurrencePattern}
                      onChange={(e) => handleInputChange('recurrencePattern', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select Pattern</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Interval</label>
                    <input
                      type="number"
                      value={formData.recurrenceInterval}
                      onChange={(e) => handleInputChange('recurrenceInterval', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">End Date</label>
                    <input
                      type="date"
                      value={formData.recurrenceEndDate}
                      onChange={(e) => handleInputChange('recurrenceEndDate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center font-medium"
            >
              <Save className="w-5 h-5 mr-2" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskFormEnhanced;
