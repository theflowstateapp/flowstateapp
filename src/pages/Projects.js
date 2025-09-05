import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Plus,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  X,
  MoreVertical,
  Filter,
  Search,
  ArrowUpRight,
  Star,
  Bot,
  Sparkles,
  Lightbulb,
  TrendingUp,
  Zap,
  Crown,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
// Removed AIAssistant import - now using dedicated AI Assistant page
import { AI_FEATURES } from '../lib/aiAssistant';
import { usageTracker, USAGE_CATEGORIES } from '../lib/usagePricing';
import aiAssistant from '../lib/aiAssistant';

const Projects = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      status: 'in-progress',
      priority: 'high',
      progress: 65,
      dueDate: '2024-06-15',
      team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      tasks: [
        { id: 1, title: 'Design mockups', completed: true },
        { id: 2, title: 'Frontend development', completed: true },
        { id: 3, title: 'Backend integration', completed: false },
        { id: 4, title: 'Testing & QA', completed: false },
        { id: 5, title: 'Deployment', completed: false }
      ],
      budget: 15000,
      spent: 8500,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Mobile App Development',
      description: 'Build a cross-platform mobile app for iOS and Android',
      status: 'planning',
      priority: 'medium',
      progress: 25,
      dueDate: '2024-08-30',
      team: ['Sarah Wilson', 'Alex Brown'],
      tasks: [
        { id: 1, title: 'Requirements gathering', completed: true },
        { id: 2, title: 'UI/UX design', completed: false },
        { id: 3, title: 'Development', completed: false },
        { id: 4, title: 'Testing', completed: false }
      ],
      budget: 25000,
      spent: 5000,
      createdAt: '2024-02-01'
    },
    {
      id: 3,
      title: 'Marketing Campaign',
      description: 'Launch comprehensive marketing campaign for Q2',
      status: 'completed',
      priority: 'high',
      progress: 100,
      dueDate: '2024-04-30',
      team: ['Lisa Chen', 'David Kim'],
      tasks: [
        { id: 1, title: 'Strategy planning', completed: true },
        { id: 2, title: 'Content creation', completed: true },
        { id: 3, title: 'Campaign launch', completed: true },
        { id: 4, title: 'Performance analysis', completed: true }
      ],
      budget: 8000,
      spent: 7800,
      createdAt: '2024-01-01'
    }
  ]);

  const [showAddProject, setShowAddProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [usage, setUsage] = useState(null);
  const [canUseAI, setCanUseAI] = useState(true);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    dueDate: '',
    budget: '',
    team: []
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

  const analyzeProjectsWithAI = async () => {
    if (!canUseAI) {
      toast.error('You have reached your AI usage limit. Please upgrade your plan.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiAssistant.analyzeProject(projects, {
        currentDate: new Date().toISOString(),
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        inProgressProjects: projects.filter(p => p.status === 'in-progress').length,
        totalBudget: projects.reduce((acc, p) => acc + p.budget, 0),
        totalSpent: projects.reduce((acc, p) => acc + p.spent, 0)
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

  const prioritizeTasksWithAI = async (projectId) => {
    if (!canUseAI) {
      toast.error('You have reached your AI usage limit. Please upgrade your plan.');
      return;
    }

    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      const result = await aiAssistant.prioritizeTasks(project.tasks, {
        projectTitle: project.title,
        projectStatus: project.status,
        projectPriority: project.priority,
        dueDate: project.dueDate
      });

      if (result.success) {
        setAiInsights(result.result);
        setShowAIInsights(true);
        toast.success('Task prioritization completed!');
      } else {
        toast.error('Task prioritization failed. Please try again.');
      }
    } catch (error) {
      console.error('Task prioritization error:', error);
      toast.error('Something went wrong with task prioritization.');
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description || !newProject.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const project = {
      id: Date.now(),
      ...newProject,
      progress: 0,
      tasks: [],
      spent: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects([...projects, project]);
    setNewProject({
      title: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      dueDate: '',
      budget: '',
      team: []
    });
    setShowAddProject(false);
    toast.success('Project added successfully!');
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
    toast.success('Project deleted successfully!');
  };



  const handleAddTask = (projectId) => {
    if (!newTaskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newTask = {
          id: Date.now(),
          title: newTaskTitle,
          completed: false
        };
        const updatedTasks = [...project.tasks, newTask];
        const completedCount = updatedTasks.filter(task => task.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return { ...project, tasks: updatedTasks, progress };
      }
      return project;
    }));

    setNewTaskTitle('');
    toast.success('Task added successfully!');
  };

  const handleToggleTask = (projectId, taskId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const updatedTasks = project.tasks.map(task =>
          task.id === taskId
            ? { ...task, completed: !task.completed }
            : task
        );
        const completedCount = updatedTasks.filter(task => task.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return { ...project, tasks: updatedTasks, progress };
      }
      return project;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-700';
      case 'in-progress': return 'bg-primary-100 text-primary-700';
      case 'planning': return 'bg-warning-100 text-warning-700';
      case 'on-hold': return 'bg-gray-100 text-gray-700';
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

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'completed') return project.status === 'completed';
    if (filter === 'in-progress') return project.status === 'in-progress';
    if (filter === 'planning') return project.status === 'planning';
    return true;
  });

  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            {project.priority === 'high' && <Star size={16} className="text-danger-500 fill-current" />}
          </div>
          <p className="text-gray-600 text-sm mb-3">{project.description}</p>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Users size={12} />
              <span>{project.team.length} members</span>
            </div>
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
          <span className="text-sm text-gray-500">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Budget */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Budget</span>
          <span className="font-medium text-gray-900">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
          <div 
            className="bg-warning-500 h-1 rounded-full"
            style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Tasks */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tasks ({project.tasks.filter(t => t.completed).length}/{project.tasks.length})</h4>
        <div className="space-y-2">
          {project.tasks.slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleTask(project.id, task.id)}
                className={`p-1 rounded ${
                  task.completed 
                    ? 'text-success-600 bg-success-50' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <CheckCircle size={14} className={task.completed ? 'fill-current' : ''} />
              </button>
              <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {task.title}
              </span>
            </div>
          ))}
          {project.tasks.length > 3 && (
            <p className="text-xs text-gray-500">+{project.tasks.length - 3} more tasks</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedProject(project)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => handleDeleteProject(project.id)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Calendar size={12} />
          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 space-y-4" data-testid="projects-container">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects & Tasks</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your projects and track progress with AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={analyzeProjectsWithAI}
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
            onClick={() => setShowAddProject(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Project</span>
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
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter(p => p.status === 'in-progress').length}
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
                {projects.filter(p => p.status === 'completed').length}
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
                {Math.round(projects.reduce((acc, project) => acc + project.progress, 0) / projects.length)}%
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
              <option value="all">All Projects</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="planning">Planning</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

            {/* Add Project Modal */}
      <Modal
        isOpen={showAddProject}
        onClose={() => setShowAddProject(false)}
        title="Add New Project"
        size="lg"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="input-field"
              placeholder="Enter project title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Describe your project"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                className="input-field"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={newProject.priority}
                onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={newProject.dueDate}
                onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
              <input
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Add Project
            </button>
            <button
              type="button"
              onClick={() => setShowAddProject(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Project Details Modal */}
      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title}
        size="2xl"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{selectedProject?.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProject?.status)}`}>
                {selectedProject?.status.replace('-', ' ')}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Priority</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedProject?.priority)}`}>
                {selectedProject?.priority}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Due Date</h3>
              <p className="text-gray-900">{selectedProject?.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : ''}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Progress</h3>
              <p className="text-gray-900">{selectedProject?.progress}%</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject?.team.map((member, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {member}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks</h3>
            <div className="space-y-3">
              {selectedProject?.tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <button
                    onClick={() => handleToggleTask(selectedProject.id, task.id)}
                    className={`p-2 rounded-lg ${
                      task.completed 
                        ? 'text-success-600 bg-success-100' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <CheckCircle size={16} className={task.completed ? 'fill-current' : ''} />
                  </button>
                  <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Add New Task */}
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add new task..."
                className="flex-1 input-field"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask(selectedProject.id)}
              />
              <button
                onClick={() => handleAddTask(selectedProject.id)}
                className="btn-primary px-4"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* AI Insights Modal */}
      {showAIInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Bot size={24} className="text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">AI Project Analysis</h2>
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
                  Based on your current projects and progress, here are personalized recommendations to optimize your workflow.
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

export default Projects;
