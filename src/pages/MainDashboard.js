import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Plus,
  Target,
  CheckCircle,
  TrendingUp,
  Heart,
  DollarSign,
  Users,
  Settings,
  Search,
  ArrowRight,
  Star,
  Bell,
  Globe,
  X,
  Loader,
  Sparkles,
  MessageCircle,
  Clock,
  Tag,
  Zap,
  Inbox,
  GraduationCap,
  Lightbulb,
  FileText,
  Flag,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  BookOpen,
  Archive,
  BookMarked,
  User,
  MessageSquare,
  Database,
  LayoutDashboard,
  ExternalLink,
  BarChart3,
  PieChart,
  Activity,
  Dumbbell,
  Utensils,
  BookOpenCheck,
  Wallet,
  CreditCard,
  Target as TargetIcon,
  FolderOpen,
  Repeat,
  Eye,
  EyeOff,
  Home,
  Briefcase,
  Book,
  Coffee,
  CalendarDays,
  PieChart as PieChartIcon,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MainDashboard = () => {
  const [expandedSections, setExpandedSections] = useState({
    quickCapture: true,
    projectsAreas: true,
    lifeAreas: true,
    weeklyReview: true,
    habitTracker: true,
    mealPlanner: true,
    journal: true,
    goalsBudget: true,
    calendar: true,
    goalSetting: true,
    paraDashboard: true,
    system: true
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data based on the Notion template
  const quickInbox = [
    { id: 1, name: 'New Task', type: 'Task', status: 'Not Started', priority: 'High', dueDate: '2023-10-26', createdTime: '2023-10-26', lastEdited: '2023-10-26' }
  ];

  const quickTasks = [
    { id: 1, name: 'New Task', status: 'Not Started', priority: 'High', dueDate: '2023-10-26', project: 'None', area: 'None', createdTime: '2023-10-26', lastEdited: '2023-10-26' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Light the World',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2023-12-31',
      area: 'Personal Growth',
      tags: ['Creative', 'Personal'],
      goal: 'Become a better writer',
      progress: 50,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Life Design',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: '2024-01-01',
      area: 'Personal Growth',
      tags: ['Planning', 'Personal'],
      goal: 'Design my ideal life',
      progress: 0,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Family Table',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2023-11-15',
      area: 'Family',
      tags: ['Family', 'Home'],
      goal: 'Cook more meals at home',
      progress: 75,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Home Renovation',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '2024-03-01',
      area: 'Home',
      tags: ['Home', 'DIY'],
      goal: 'Renovate the kitchen',
      progress: 25,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    }
  ];

  const areas = [
    {
      id: 1,
      title: 'Personal Growth',
      description: 'Focus on self-improvement and learning',
      projects: ['Light the World', 'Life Design'],
      goals: ['Become a better writer', 'Design my ideal life'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Health & Fitness',
      description: 'Maintain physical and mental well-being',
      projects: [],
      goals: ['Exercise regularly', 'Eat healthy'],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Finances',
      description: 'Manage money and investments',
      projects: [],
      goals: ['Save for retirement', 'Invest wisely'],
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Career',
      description: 'Develop professional skills and advance career',
      projects: [],
      goals: ['Get a promotion', 'Learn new skills'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop'
    },
    {
      id: 5,
      title: 'Family',
      description: 'Nurture relationships with family',
      projects: ['Family Table'],
      goals: ['Spend more time with family', 'Plan family activities'],
      image: 'https://images.unsplash.com/photo-1511895428188-9c4b2b2b3b3b?w=300&h=200&fit=crop'
    },
    {
      id: 6,
      title: 'Home',
      description: 'Create a comfortable and organized living space',
      projects: ['Home Renovation'],
      goals: ['Declutter home', 'Decorate living room'],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    },
    {
      id: 7,
      title: 'Social',
      description: 'Connect with friends and community',
      projects: [],
      goals: ['Meet new people', 'Attend social events'],
      image: 'https://images.unsplash.com/photo-1511895428188-9c4b2b2b3b3b?w=300&h=200&fit=crop'
    },
    {
      id: 8,
      title: 'Hobbies',
      description: 'Pursue interests and passions',
      projects: [],
      goals: ['Learn a new instrument', 'Read more books'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    }
  ];

  const habits = [
    { name: 'Exercise', status: 'Done' },
    { name: 'Read', status: 'Done' },
    { name: 'Meditate', status: 'Not Done' },
    { name: 'Journal', status: 'Not Done' },
    { name: 'Drink Water', status: 'Done' }
  ];

  const meals = [
    { meal: 'Breakfast', recipe: 'Oatmeal', preparation: '5 min' },
    { meal: 'Lunch', recipe: 'Salad', preparation: '10 min' },
    { meal: 'Dinner', recipe: 'Pasta', preparation: '30 min' },
    { meal: 'Snack', recipe: 'Fruit', preparation: '1 min' }
  ];

  const goals = [
    {
      id: 1,
      title: 'Become a better writer',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2023-12-31',
      area: 'Personal Growth',
      projects: ['Light the World'],
      progress: 50,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Design my ideal life',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: '2024-01-01',
      area: 'Personal Growth',
      projects: ['Life Design'],
      progress: 0,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Cook more meals at home',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2023-11-15',
      area: 'Family',
      projects: ['Family Table'],
      progress: 75,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      title: 'Renovate the kitchen',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '2024-03-01',
      area: 'Home',
      projects: ['Home Renovation'],
      progress: 25,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    }
  ];

  const budgets = [
    {
      id: 1,
      title: 'Monthly Budget - October',
      status: 'In Progress',
      amount: 2000,
      spent: 1500,
      remaining: 500,
      category: 'Personal',
      dueDate: '2023-10-31',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Emergency Fund',
      status: 'In Progress',
      amount: 10000,
      spent: 0,
      remaining: 10000,
      category: 'Savings',
      dueDate: null,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Travel Fund - Europe',
      status: 'Not Started',
      amount: 5000,
      spent: 0,
      remaining: 5000,
      category: 'Travel',
      dueDate: '2024-06-01',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop'
    }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Done': return 'bg-green-100 text-green-800';
      case 'Not Done': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CollapsibleSection = ({ title, icon: Icon, expanded, onToggle, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 space-y-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Life OS Demo</h2>
            <p className="text-gray-600 mb-6">This is a demo version. Sign up to access all features.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sun className="mr-3 text-yellow-500" size={32} />
              Notion Life OS
            </h1>
            <p className="text-gray-600 mt-1">Welcome to your Notion Life OS! This template is designed to help you organize your life and achieve your goals.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/quick-capture')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Quick Capture</span>
            </button>
            <button 
              onClick={() => navigate('/new-task')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Quick Capture */}
        <CollapsibleSection
          title="Quick Capture"
          icon={Zap}
          expanded={expandedSections.quickCapture}
          onToggle={() => toggleSection('quickCapture')}
        >
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Inbox */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Quick Inbox</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Priority</th>
                        <th className="text-left py-2">Due Date</th>
                      </tr>
                    </thead>
                                         <tbody>
                       {quickInbox.map((item) => (
                         <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/task/${item.id}`)}>
                           <td className="py-2">{item.name}</td>
                          <td className="py-2">{item.type}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-2">{item.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Tasks */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Quick Tasks</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Priority</th>
                        <th className="text-left py-2">Due Date</th>
                        <th className="text-left py-2">Project</th>
                      </tr>
                    </thead>
                                         <tbody>
                       {quickTasks.map((task) => (
                         <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/task/${task.id}`)}>
                           <td className="py-2">{task.name}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-2">{task.dueDate}</td>
                          <td className="py-2">{task.project}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Projects & Areas */}
        <CollapsibleSection
          title="Projects & Areas"
          icon={Target}
          expanded={expandedSections.projectsAreas}
          onToggle={() => toggleSection('projectsAreas')}
        >
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Projects</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-32 bg-gray-200 relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">{project.title}</h5>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Due:</span>
                        <span>{project.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Area:</span>
                        <span>{project.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progress:</span>
                        <span>{project.progress}%</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Life Areas */}
        <CollapsibleSection
          title="Life Areas"
          icon={Heart}
          expanded={expandedSections.lifeAreas}
          onToggle={() => toggleSection('lifeAreas')}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {areas.map((area) => (
                <div key={area.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="h-32 bg-gray-200 relative">
                    <img src={area.image} alt={area.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">{area.title}</h5>
                    <p className="text-sm text-gray-600 mb-3">{area.description}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Projects:</span>
                        <span className="ml-2">{area.projects.length > 0 ? area.projects.join(', ') : 'None'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Goals:</span>
                        <span className="ml-2">{area.goals.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Weekly Review */}
        <CollapsibleSection
          title="Weekly Review"
          icon={RefreshCw}
          expanded={expandedSections.weeklyReview}
          onToggle={() => toggleSection('weeklyReview')}
        >
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">Last Review: 2023-10-20</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Habit Tracker */}
        <CollapsibleSection
          title="Habit Tracker"
          icon={Repeat}
          expanded={expandedSections.habitTracker}
          onToggle={() => toggleSection('habitTracker')}
        >
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Habit List</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {habits.map((habit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="font-medium">{habit.name}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(habit.status)}`}>
                        {habit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Description & Actions</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-4">
                  This is your daily habit tracker. Mark your habits as done when you complete them. You can add new habits or remove existing ones.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Today's Habits</p>
                  <div className="flex space-x-3">
                    <button className="btn-secondary">Add Habit</button>
                    <button className="btn-secondary">View All Habits</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Meal Planner */}
        <CollapsibleSection
          title="Meal Planner"
          icon={Utensils}
          expanded={expandedSections.mealPlanner}
          onToggle={() => toggleSection('mealPlanner')}
        >
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Meal</th>
                      <th className="text-left py-2">Recipe</th>
                      <th className="text-left py-2">Preparation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meals.map((meal, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 font-medium">{meal.meal}</td>
                        <td className="py-2">{meal.recipe}</td>
                        <td className="py-2">{meal.preparation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Journal */}
        <CollapsibleSection
          title="Journal"
          icon={BookOpen}
          expanded={expandedSections.journal}
          onToggle={() => toggleSection('journal')}
        >
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Description & Actions</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-4">
                  This is your daily journal. Write down your thoughts, feelings, and experiences. You can add new entries or view past entries.
                </p>
                <div className="flex space-x-3">
                  <button className="btn-secondary">New Entry</button>
                  <button className="btn-secondary">View All Entries</button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Journal Entries</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <CalendarDays className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-600">Monthly Calendar View</p>
                  <p className="text-sm text-gray-500">October 2023</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Goals & Budget */}
        <CollapsibleSection
          title="Goals & Budget"
          icon={TargetIcon}
          expanded={expandedSections.goalsBudget}
          onToggle={() => toggleSection('goalsBudget')}
        >
          <div className="p-6 space-y-6">
            {/* Goals */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Goals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-32 bg-gray-200 relative">
                      <img src={goal.image} alt={goal.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{goal.title}</h5>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Priority:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Due:</span>
                          <span>{goal.dueDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Area:</span>
                          <span>{goal.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Progress:</span>
                          <span>{goal.progress}%</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budgets */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">My Budgets Database</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map((budget) => (
                  <div key={budget.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-32 bg-gray-200 relative">
                      <img src={budget.image} alt={budget.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                          {budget.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">{budget.title}</h5>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span>${budget.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spent:</span>
                          <span>${budget.spent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span>${budget.remaining.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          <span>{budget.category}</span>
                        </div>
                        {budget.dueDate && (
                          <div className="flex justify-between">
                            <span>Due:</span>
                            <span>{budget.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Calendar */}
        <CollapsibleSection
          title="Calendar"
          icon={Calendar}
          expanded={expandedSections.calendar}
          onToggle={() => toggleSection('calendar')}
        >
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Tasks Database</h4>
              <div className="text-center">
                <CalendarDays className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-600">Monthly Calendar View</p>
                <p className="text-sm text-gray-500">October 2023</p>
                <p className="text-sm text-gray-500 mt-2">Task: New Task (2023-10-26)</p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Goal Setting & Yearly Planner */}
        <CollapsibleSection
          title="Goal Setting & Yearly Planner"
          icon={TargetIcon}
          expanded={expandedSections.goalSetting}
          onToggle={() => toggleSection('goalSetting')}
        >
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Goals</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Priority</th>
                      <th className="text-left py-2">Due Date</th>
                      <th className="text-left py-2">Area</th>
                      <th className="text-left py-2">Projects</th>
                      <th className="text-left py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goals.map((goal) => (
                      <tr key={goal.id} className="border-b border-gray-100">
                        <td className="py-2 font-medium">{goal.title}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status}
                          </span>
                        </td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                          </span>
                        </td>
                        <td className="py-2">{goal.dueDate}</td>
                        <td className="py-2">{goal.area}</td>
                        <td className="py-2">{goal.projects.join(', ')}</td>
                        <td className="py-2">{goal.progress}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* P.A.R.A. Dashboard */}
        <CollapsibleSection
          title="P.A.R.A. Dashboard"
          icon={LayoutDashboard}
          expanded={expandedSections.paraDashboard}
          onToggle={() => toggleSection('paraDashboard')}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/projects')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <h5 className="font-semibold text-gray-900 mb-2">Projects</h5>
                <p className="text-sm text-gray-600">Manage your active projects</p>
              </button>
              <button 
                onClick={() => navigate('/areas')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <h5 className="font-semibold text-gray-900 mb-2">Areas</h5>
                <p className="text-sm text-gray-600">Organize by life areas</p>
              </button>
              <button 
                onClick={() => navigate('/resources')}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <h5 className="font-semibold text-gray-900 mb-2">Resources</h5>
                <p className="text-sm text-gray-600">Access your resources</p>
              </button>
            </div>
          </div>
        </CollapsibleSection>

        {/* System */}
        <CollapsibleSection
          title="System"
          icon={Settings}
          expanded={expandedSections.system}
          onToggle={() => toggleSection('system')}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h5 className="font-semibold text-gray-900 mb-2">About this template</h5>
                <p className="text-sm text-gray-600">Learn about the Life OS system</p>
              </button>
              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h5 className="font-semibold text-gray-900 mb-2">Getting Started</h5>
                <p className="text-sm text-gray-600">Quick start guide</p>
              </button>
              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h5 className="font-semibold text-gray-900 mb-2">Template Walkthrough</h5>
                <p className="text-sm text-gray-600">Detailed system overview</p>
              </button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Footer */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Star size={16} />
            <span className="text-sm">Enjoying the template? Please leave us a quick review!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
