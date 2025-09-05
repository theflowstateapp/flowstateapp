import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Calendar,
  Tag,
  Settings,
  Clock,
  User,
  MapPin,
  Target,
  Repeat,
  FileText,
  Plus,
  X,
  Link,
  Paperclip,
  CheckSquare,
  AlertCircle,
  Star,
  Eye,
  EyeOff,
  Bot,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { aiAssistant, AI_FEATURES, LIFE_AREAS, TASK_TAGS } from '../lib/aiAssistant';
import { processTaskWithAI } from '../lib/enhancedAI';
import { TaskTemplateSystem, processTaskWithAIAndTemplates } from '../lib/taskTemplates';
import { TaskAnalytics } from '../lib/taskAnalytics';
import toast from 'react-hot-toast';

const NewTaskForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // UI States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showTemplateSuggestions, setShowTemplateSuggestions] = useState(false);
  const [templateSuggestions, setTemplateSuggestions] = useState([]);

  // Form Data - Comprehensive task fields based on successful apps
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
    reminderType: 'none',
    isRecurring: false,
    recurrencePattern: '',
    recurrenceInterval: 1,
    recurrenceDays: [],
    recurrenceEndDate: '',
    
    // Organization & Context
    project: '',
    section: '',
    tags: [],
    context: '',
    location: '',
    
    // Assignment & Collaboration
    assignee: '',
    watchers: [],
    team: '',
    
    // Dependencies & Relationships
    dependencies: [],
    blockedBy: '',
    relatedTasks: [],
    
    // Advanced Features
    subtasks: [],
    attachments: [],
    links: [],
    customFields: {},
    
    // Metadata
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: user?.id || '',
    lastModifiedBy: user?.id || ''
  });

  // Mock Data - Comprehensive options based on successful apps
  const mockData = {
    taskTypes: [
      { value: 'Task', label: 'Task', icon: '📋' },
      { value: 'Bug', label: 'Bug', icon: '🐛' },
      { value: 'Feature', label: 'Feature', icon: '✨' },
      { value: 'Meeting', label: 'Meeting', icon: '📅' },
      { value: 'Call', label: 'Call', icon: '📞' },
      { value: 'Email', label: 'Email', icon: '📧' },
      { value: 'Review', label: 'Review', icon: '👀' },
      { value: 'Research', label: 'Research', icon: '🔍' }
    ],
    
    statuses: [
      { value: 'Not Started', label: 'Not Started', color: 'text-gray-600', bg: 'bg-gray-100' },
      { value: 'In Progress', label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-100' },
      { value: 'On Hold', label: 'On Hold', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      { value: 'Completed', label: 'Completed', color: 'text-green-600', bg: 'bg-green-100' },
      { value: 'Cancelled', label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' }
    ],
    
    priorities: [
      { value: 'Low', label: 'Low', color: 'text-green-600', bg: 'bg-green-100', icon: '🟢' },
      { value: 'Medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🟡' },
      { value: 'High', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100', icon: '🟠' },
      { value: 'Critical', label: 'Critical', color: 'text-red-600', bg: 'bg-red-100', icon: '🔴' }
    ],
    
    projects: [
      { value: 'Light the World', label: 'Light the World', icon: '📝' },
      { value: 'Family Table', label: 'Family Table', icon: '🍳' },
      { value: 'Life Design', label: 'Life Design', icon: '🎯' },
      { value: 'Home Renovation', label: 'Home Renovation', icon: '🏠' },
      { value: 'Career Growth', label: 'Career Growth', icon: '💼' },
      { value: 'Health & Fitness', label: 'Health & Fitness', icon: '💪' }
    ],
    
    sections: [
      { value: 'Planning', label: 'Planning' },
      { value: 'Development', label: 'Development' },
      { value: 'Testing', label: 'Testing' },
      { value: 'Review', label: 'Review' },
      { value: 'Deployment', label: 'Deployment' },
      { value: 'Maintenance', label: 'Maintenance' }
    ],
    
    contexts: [
      { value: 'At Computer', label: 'At Computer', icon: '💻' },
      { value: 'At Phone', label: 'At Phone', icon: '📱' },
      { value: 'At Office', label: 'At Office', icon: '🏢' },
      { value: 'At Home', label: 'At Home', icon: '🏠' },
      { value: 'Errands', label: 'Errands', icon: '🚗' },
      { value: 'Waiting For', label: 'Waiting For', icon: '⏳' }
    ],
    
    teams: [
      { value: 'Personal', label: 'Personal' },
      { value: 'Work', label: 'Work' },
      { value: 'Family', label: 'Family' },
      { value: 'Project Alpha', label: 'Project Alpha' },
      { value: 'Project Beta', label: 'Project Beta' }
    ],
    
    commonTags: [
      'urgent', 'important', 'meeting', 'call', 'email', 'review', 
      'planning', 'research', 'deadline', 'milestone', 'blocker', 
      'collaboration', 'fitness', 'health', 'finance', 'family', 
      'learning', 'creative', 'analytical', 'quick', 'complex'
    ]
  };

  // Enhanced AI Analysis with Template Suggestions and Analytics
  const handleAIAnalysis = useCallback(async () => {
    if (!formData.title.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Use the new intelligent task creation
      const aiResult = await aiAssistant.createIntelligentTask(formData.title, {
        description: formData.description,
        user: user?.id,
        currentTime: new Date().toISOString()
      });

      if (aiResult.success && aiResult.task) {
        const taskData = aiResult.task;
        
        // Update form with AI suggestions
        setFormData(prev => ({
          ...prev,
          title: taskData.title || prev.title,
          description: taskData.description || prev.description,
          priority: mapPriority(taskData.priority),
          tags: taskData.tags || [],
          dueDate: taskData.dueDate || prev.dueDate,
          estimatedHours: taskData.estimatedDuration ? (taskData.estimatedDuration / 60).toString() : prev.estimatedHours,
          subtasks: taskData.subtasks || []
        }));

        // Show success message
        toast.success('AI enhanced your task with intelligent suggestions!');
        
        // Track AI analysis usage
        TaskAnalytics.trackAIAnalysis(formData.title, [taskData], true);
      } else {
        // Fallback to old AI analysis
        const analysis = await processTaskWithAIAndTemplates(formData.title, formData);
        
        // Track AI analysis usage
        const success = analysis.aiSuggestions.length > 0;
        TaskAnalytics.trackAIAnalysis(formData.title, analysis.aiSuggestions, success);
        
        // Apply AI suggestions
        const updatedFormData = { ...formData };
        
        analysis.aiSuggestions.forEach(suggestion => {
          if (suggestion.field && suggestion.value !== undefined) {
            updatedFormData[suggestion.field] = suggestion.value;
          }
        });
        
        // Apply template if available
        if (analysis.appliedTemplate) {
          Object.assign(updatedFormData, analysis.appliedTemplate);
        }
        
        setFormData(updatedFormData);
        
        // Show template suggestions
        if (analysis.templateSuggestions.length > 0) {
          setTemplateSuggestions(analysis.templateSuggestions);
          setShowTemplateSuggestions(true);
        }
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast.error('AI analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData, user]);

  // Helper function to map AI priority to form priority
  const mapPriority = (aiPriority) => {
    const priorityMap = {
      'urgent': 'Critical',
      'important': 'High',
      'high_priority': 'High',
      'low_priority': 'Low'
    };
    return priorityMap[aiPriority] || 'Medium';
  };

  // Basic pattern analysis fallback

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

  // Handle form submission
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
      
      // Track task creation analytics
      TaskAnalytics.trackTaskCreation(formData);
      
      // Track template usage if a template was applied
      if (templateSuggestions.length > 0 && showTemplateSuggestions) {
        TaskAnalytics.trackTemplateUsage(templateSuggestions[0].name);
      }
      
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

  const addSubtask = () => {
    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: Date.now(), title: '', completed: false }]
    }));
  };

  const updateSubtask = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const removeSubtask = (index) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Enhanced Header */}
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
              <p className="text-gray-600 text-lg">Use AI to auto-fill fields or fill them manually</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">AI Powered</span>
              </div>
            </div>
          </div>
        </div>

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
                
                {/* Template Suggestions */}
                {showTemplateSuggestions && templateSuggestions.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Suggested Templates
                    </h3>
                    <div className="space-y-2">
                      {templateSuggestions.map((template, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{template.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{template.name}</p>
                              <p className="text-xs text-gray-500">{template.category}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedData = TaskTemplateSystem.applyTemplate(template, formData);
                              setFormData(updatedData);
                              setShowTemplateSuggestions(false);
                            }}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTemplateSuggestions(false)}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Hide suggestions
                    </button>
                  </div>
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

          {/* Organization & Context */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Organization & Context
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Project</option>
                  {mockData.projects.map(project => (
                    <option key={project.value} value={project.value}>{project.icon} {project.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <select
                  value={formData.section}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Section</option>
                  {mockData.sections.map(section => (
                    <option key={section.value} value={section.value}>{section.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                <select
                  value={formData.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Context</option>
                  {mockData.contexts.map(context => (
                    <option key={context.value} value={context.value}>{context.icon} {context.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Where should this be done?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {mockData.commonTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const currentTags = formData.tags;
                        const newTags = currentTags.includes(tag)
                          ? currentTags.filter(t => t !== tag)
                          : [...currentTags, tag];
                        handleInputChange('tags', newTags);
                      }}
                      className={`px-2 py-1 text-xs rounded-full ${
                        formData.tags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add custom tags separated by commas..."
                />
              </div>
            </div>
          </div>

          {/* Assignment & Collaboration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Assignment & Collaboration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => handleInputChange('assignee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who should do this task?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
                <select
                  value={formData.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Team</option>
                  {mockData.teams.map(team => (
                    <option key={team.value} value={team.value}>{team.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Watchers</label>
                <input
                  type="text"
                  value={formData.watchers.join(', ')}
                  onChange={(e) => handleInputChange('watchers', e.target.value.split(',').map(watcher => watcher.trim()).filter(watcher => watcher))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who should be notified? (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Advanced Features
              </h2>
              <button
                type="button"
                onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showAdvancedFields ? 'Hide' : 'Show'} Advanced
              </button>
            </div>

            {showAdvancedFields && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                {/* Dependencies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blocked By</label>
                  <input
                    type="text"
                    value={formData.blockedBy}
                    onChange={(e) => handleInputChange('blockedBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Task ID or title that blocks this task"
                  />
                </div>

                {/* Related Tasks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Tasks</label>
                  <input
                    type="text"
                    value={formData.relatedTasks.join(', ')}
                    onChange={(e) => handleInputChange('relatedTasks', e.target.value.split(',').map(task => task.trim()).filter(task => task))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Related task IDs or titles (comma separated)"
                  />
                </div>

                {/* Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
                  <input
                    type="text"
                    value={formData.links.join(', ')}
                    onChange={(e) => handleInputChange('links', e.target.value.split(',').map(link => link.trim()).filter(link => link))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Related links (comma separated)"
                  />
                </div>
              </motion.div>
            )}
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

export default NewTaskForm;
