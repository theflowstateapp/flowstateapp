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
  Users,
  DollarSign,
  BarChart3,
  Milestone,
  FolderOpen,
  GitBranch,
  Shield,
  Globe,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { processProjectWithAI } from '../lib/enhancedAI';
import { ProjectAnalytics } from '../lib/projectAnalytics';

const NewProjectForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // UI States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);
  const [showTeamMembers, setShowTeamMembers] = useState(false);

  // Form Data - Comprehensive project fields based on successful apps
  const [formData, setFormData] = useState({
    // Core Information
    title: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    type: 'Project',
    
    // Time & Scheduling
    startDate: '',
    dueDate: '',
    estimatedDuration: '',
    actualDuration: '',
    
    // Project Details
    category: '',
    area: '',
    tags: [],
    location: '',
    
    // Team & Collaboration
    owner: '',
    teamMembers: [],
    stakeholders: [],
    externalPartners: [],
    
    // Budget & Resources
    budget: '',
    spent: '',
    currency: 'USD',
    resources: [],
    
    // Goals & Objectives
    objectives: [],
    successCriteria: [],
    keyMetrics: [],
    
    // Dependencies & Relationships
    dependencies: [],
    relatedProjects: [],
    parentProject: '',
    
    // Advanced Features
    milestones: [],
    risks: [],
    attachments: [],
    links: [],
    customFields: {},
    
    // Metadata
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: user?.id || '',
    lastModifiedBy: user?.id || ''
  });

  // Mock Data - Comprehensive options based on successful project management apps
  const mockData = {
    projectTypes: [
      { value: 'Project', label: 'Project', icon: '📋' },
      { value: 'Initiative', label: 'Initiative', icon: '🚀' },
      { value: 'Campaign', label: 'Campaign', icon: '📢' },
      { value: 'Product', label: 'Product', icon: '📦' },
      { value: 'Service', label: 'Service', icon: '🛠️' },
      { value: 'Research', label: 'Research', icon: '🔬' },
      { value: 'Event', label: 'Event', icon: '🎉' },
      { value: 'Training', label: 'Training', icon: '🎓' }
    ],
    
    statuses: [
      { value: 'Planning', label: 'Planning', color: 'text-blue-600', bg: 'bg-blue-100' },
      { value: 'Active', label: 'Active', color: 'text-green-600', bg: 'bg-green-100' },
      { value: 'On Hold', label: 'On Hold', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      { value: 'Completed', label: 'Completed', color: 'text-purple-600', bg: 'bg-purple-100' },
      { value: 'Cancelled', label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' }
    ],
    
    priorities: [
      { value: 'Low', label: 'Low', color: 'text-green-600', bg: 'bg-green-100', icon: '🟢' },
      { value: 'Medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '🟡' },
      { value: 'High', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100', icon: '🟠' },
      { value: 'Critical', label: 'Critical', color: 'text-red-600', bg: 'bg-red-100', icon: '🔴' }
    ],
    
    categories: [
      { value: 'Business', label: 'Business', icon: '💼' },
      { value: 'Technology', label: 'Technology', icon: '💻' },
      { value: 'Marketing', label: 'Marketing', icon: '📢' },
      { value: 'Sales', label: 'Sales', icon: '💰' },
      { value: 'Operations', label: 'Operations', icon: '⚙️' },
      { value: 'HR', label: 'HR', icon: '👥' },
      { value: 'Finance', label: 'Finance', icon: '📊' },
      { value: 'Legal', label: 'Legal', icon: '⚖️' },
      { value: 'Creative', label: 'Creative', icon: '🎨' },
      { value: 'Personal', label: 'Personal', icon: '👤' }
    ],
    
    areas: [
      { value: 'Career', label: 'Career', icon: '💼' },
      { value: 'Health & Fitness', label: 'Health & Fitness', icon: '💪' },
      { value: 'Family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
      { value: 'Finances', label: 'Finances', icon: '💰' },
      { value: 'Personal Growth', label: 'Personal Growth', icon: '🌱' },
      { value: 'Home', label: 'Home', icon: '🏠' },
      { value: 'Social', label: 'Social', icon: '👥' },
      { value: 'Hobbies', label: 'Hobbies', icon: '🎨' }
    ],
    
    currencies: [
      { value: 'USD', label: 'USD ($)', symbol: '$' },
      { value: 'EUR', label: 'EUR (€)', symbol: '€' },
      { value: 'GBP', label: 'GBP (£)', symbol: '£' },
      { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
      { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
      { value: 'JPY', label: 'JPY (¥)', symbol: '¥' }
    ],
    
    commonTags: [
      'urgent', 'important', 'strategic', 'tactical', 'innovation', 
      'optimization', 'expansion', 'consolidation', 'digital', 'analog',
      'customer-facing', 'internal', 'external', 'partnership', 'acquisition',
      'launch', 'rebrand', 'restructure', 'automation', 'manual',
      'high-impact', 'low-risk', 'experimental', 'proven', 'scalable'
    ]
  };

  // Enhanced AI Analysis with Analytics
  const handleAIAnalysis = useCallback(async () => {
    if (!formData.title.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const suggestions = await processProjectWithAI(formData.title);
      
      // Track AI analysis usage
      const success = suggestions.length > 0;
      ProjectAnalytics.trackAIAnalysis(formData.title, suggestions, success);
      
      // Apply suggestions to form data
      const updatedFormData = { ...formData };
      
      suggestions.forEach(suggestion => {
        if (suggestion.field && suggestion.value !== undefined) {
          updatedFormData[suggestion.field] = suggestion.value;
        }
      });
      
      setFormData(updatedFormData);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Track failed analysis
      ProjectAnalytics.trackAIAnalysis(formData.title, [], false);
      
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
  }, [formData.title, formData]);

  // Basic pattern analysis fallback
  const basicPatternAnalysis = (input) => {
    const lowerInput = input.toLowerCase();
    const suggestions = [];

    // Project type detection
    if (lowerInput.includes('campaign') || lowerInput.includes('marketing')) {
      suggestions.push({ field: 'type', value: 'Campaign' });
      suggestions.push({ field: 'category', value: 'Marketing' });
    } else if (lowerInput.includes('product') || lowerInput.includes('launch')) {
      suggestions.push({ field: 'type', value: 'Product' });
      suggestions.push({ field: 'category', value: 'Business' });
    } else if (lowerInput.includes('research') || lowerInput.includes('study')) {
      suggestions.push({ field: 'type', value: 'Research' });
      suggestions.push({ field: 'category', value: 'Technology' });
    } else if (lowerInput.includes('event') || lowerInput.includes('conference')) {
      suggestions.push({ field: 'type', value: 'Event' });
      suggestions.push({ field: 'category', value: 'Marketing' });
    } else if (lowerInput.includes('training') || lowerInput.includes('workshop')) {
      suggestions.push({ field: 'type', value: 'Training' });
      suggestions.push({ field: 'category', value: 'HR' });
    } else if (lowerInput.includes('initiative') || lowerInput.includes('strategy')) {
      suggestions.push({ field: 'type', value: 'Initiative' });
      suggestions.push({ field: 'category', value: 'Business' });
    } else if (lowerInput.includes('service') || lowerInput.includes('support')) {
      suggestions.push({ field: 'type', value: 'Service' });
      suggestions.push({ field: 'category', value: 'Operations' });
    }

    // Priority detection
    if (lowerInput.includes('urgent') || lowerInput.includes('critical') || lowerInput.includes('asap')) {
      suggestions.push({ field: 'priority', value: 'Critical' });
    } else if (lowerInput.includes('important') || lowerInput.includes('high priority')) {
      suggestions.push({ field: 'priority', value: 'High' });
    }

    // Area detection
    if (lowerInput.includes('health') || lowerInput.includes('fitness') || lowerInput.includes('workout')) {
      suggestions.push({ field: 'area', value: 'Health & Fitness' });
    } else if (lowerInput.includes('career') || lowerInput.includes('work') || lowerInput.includes('business')) {
      suggestions.push({ field: 'area', value: 'Career' });
    } else if (lowerInput.includes('family') || lowerInput.includes('home')) {
      suggestions.push({ field: 'area', value: 'Family' });
    } else if (lowerInput.includes('finance') || lowerInput.includes('money') || lowerInput.includes('budget')) {
      suggestions.push({ field: 'area', value: 'Finances' });
    }

    // Date detection
    if (lowerInput.includes('next week')) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      suggestions.push({ field: 'startDate', value: nextWeek.toISOString().split('T')[0] });
    } else if (lowerInput.includes('next month')) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      suggestions.push({ field: 'startDate', value: nextMonth.toISOString().split('T')[0] });
    }

    // Duration detection
    const durationMatch = lowerInput.match(/(\d+)\s*(week|month|day)s?/i);
    if (durationMatch) {
      const amount = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      suggestions.push({ field: 'estimatedDuration', value: `${amount} ${unit}${amount > 1 ? 's' : ''}` });
    }

    // Budget detection
    const budgetMatch = lowerInput.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(k|m|b)?/i);
    if (budgetMatch) {
      let budget = parseFloat(budgetMatch[1].replace(/,/g, ''));
      const multiplier = budgetMatch[2]?.toLowerCase();
      if (multiplier === 'k') budget *= 1000;
      else if (multiplier === 'm') budget *= 1000000;
      else if (multiplier === 'b') budget *= 1000000000;
      suggestions.push({ field: 'budget', value: budget.toString() });
    }

    return suggestions;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      const projectData = {
        title: formData.title,
        description: formData.description || '',
        status: formData.status,
        priority: formData.priority,
        type: formData.type,
        start_date: formData.startDate || null,
        due_date: formData.dueDate || null,
        estimated_duration: formData.estimatedDuration || null,
        actual_duration: formData.actualDuration || null,
        category: formData.category || null,
        area: formData.area || null,
        tags: formData.tags || [],
        location: formData.location || null,
        owner: formData.owner || null,
        team_members: formData.teamMembers || [],
        stakeholders: formData.stakeholders || [],
        external_partners: formData.externalPartners || [],
        budget: formData.budget ? parseFloat(formData.budget) : null,
        spent: formData.spent ? parseFloat(formData.spent) : null,
        currency: formData.currency,
        resources: formData.resources || [],
        objectives: formData.objectives || [],
        success_criteria: formData.successCriteria || [],
        key_metrics: formData.keyMetrics || [],
        dependencies: formData.dependencies || [],
        related_projects: formData.relatedProjects || [],
        parent_project: formData.parentProject || null,
        milestones: formData.milestones || [],
        risks: formData.risks || [],
        attachments: formData.attachments || [],
        links: formData.links || [],
        custom_fields: formData.customFields || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: user.id,
        last_modified_by: user.id,
        user_id: user.id
      };

      // eslint-disable-next-line no-console
      console.log('Saving project to database:', projectData);

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

        // eslint-disable-next-line no-console
        console.log('Project created successfully:', data);
      
      // Track project creation analytics
      ProjectAnalytics.trackProjectCreation(formData);
      
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Error creating project: ${error.message}`);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { 
        id: Date.now(), 
        title: '', 
        description: '', 
        dueDate: '', 
        completed: false 
      }]
    }));
  };

  const updateMilestone = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const removeMilestone = (index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index, value) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Projects</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
              <p className="text-gray-600 text-lg">AI-powered project creation with intelligent field detection</p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-3">Project Title *</label>
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg"
                      placeholder="What project are you creating?"
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
                    💡 Try: "Urgent marketing campaign for Q4 product launch, 3 months duration, $50k budget"
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
                  placeholder="Add detailed project description, goals, and context..."
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
                    {mockData.projectTypes.map(type => (
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

          {/* Time & Scheduling */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Time & Scheduling
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
                <input
                  type="text"
                  value={formData.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3 months, 6 weeks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Actual Duration</label>
                <input
                  type="text"
                  value={formData.actualDuration}
                  onChange={(e) => handleInputChange('actualDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2.5 months"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FolderOpen className="w-5 h-5 mr-2" />
              Project Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {mockData.categories.map(category => (
                    <option key={category.value} value={category.value}>{category.icon} {category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Area</option>
                  {mockData.areas.map(area => (
                    <option key={area.value} value={area.value}>{area.icon} {area.label}</option>
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
                  placeholder="Where is this project based?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Owner</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who owns this project?"
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

          {/* Budget & Resources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Budget & Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spent</label>
                <input
                  type="number"
                  value={formData.spent}
                  onChange={(e) => handleInputChange('spent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {mockData.currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>{currency.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Goals & Objectives */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Goals & Objectives
              </h2>
              <button
                type="button"
                onClick={addObjective}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Objective
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Objective ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dependencies</label>
                  <input
                    type="text"
                    value={formData.dependencies.join(', ')}
                    onChange={(e) => handleInputChange('dependencies', e.target.value.split(',').map(dep => dep.trim()).filter(dep => dep))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Project IDs or titles that this project depends on (comma separated)"
                  />
                </div>

                {/* Related Projects */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Projects</label>
                  <input
                    type="text"
                    value={formData.relatedProjects.join(', ')}
                    onChange={(e) => handleInputChange('relatedProjects', e.target.value.split(',').map(proj => proj.trim()).filter(proj => proj))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Related project IDs or titles (comma separated)"
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
              onClick={() => navigate('/projects')}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center font-medium"
            >
              <Save className="w-5 h-5 mr-2" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectForm;
