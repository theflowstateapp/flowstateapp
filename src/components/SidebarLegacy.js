import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  CheckCircle,
  Calendar,
  Star,
  User,
  BookOpen,
  Heart,
  DollarSign,
  Users,
  GraduationCap,
  Clock,
  FileText,
  Flag,
  Repeat,
  Archive,
  Search,
  Bot,
  Sparkles,
  Sun,
  Focus,
  BookMarked,
  MessageSquare,
  FilePlus,
  Phone,
  MapPin,
  LayoutDashboard,
  RefreshCw,
  Activity,
  Globe,
  Home,
  Dumbbell,
  Utensils,
  Wallet,
  Inbox,
  Mic,
  PieChart,
  Workflow
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FlowStateLogo from './FlowStateLogo';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    capture: true,
    organize: true,
    plan: true,
    action: true,
    review: false,
    ai: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Enhanced Flow Navigation Structure - Complete Workflow
  const navigationItems = [
    {
      section: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      items: [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, aiPowered: true },
        { name: 'Quick Actions', path: '/quick-actions', icon: Zap, aiPowered: true },
        { name: 'Recent Activity', path: '/recent', icon: Activity, aiPowered: true }
      ]
    },
    {
      section: 'capture',
      title: 'Capture',
      icon: Zap,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      items: [
        { name: 'Quick Capture', path: '/quick-capture', icon: Plus, aiPowered: true },
        { name: 'Voice Notes', path: '/voice-capture', icon: Mic, aiPowered: true },
        { name: 'Email Capture', path: '/email-capture', icon: MessageSquare, aiPowered: true },
        { name: 'Mobile Capture', path: '/mobile-capture', icon: Phone, aiPowered: true }
      ]
    },
    {
      section: 'organize',
      title: 'Organize',
      icon: Workflow,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      items: [
        { name: 'Inbox Processing', path: '/inbox-processing', icon: RefreshCw, aiPowered: true },
        { name: 'Task Management', path: '/tasks', icon: CheckCircle, aiPowered: false },
        { name: 'Project Organization', path: '/projects', icon: Target, aiPowered: false },
        { name: 'Resource Management', path: '/resources', icon: FileText, aiPowered: false }
      ]
    },
    {
      section: 'plan',
      title: 'Plan',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      items: [
        { name: 'Project Planning', path: '/project-planning', icon: Target, aiPowered: true },
        { name: 'Goal Setting', path: '/goals', icon: Flag, aiPowered: true },
        { name: 'Calendar View', path: '/calendar', icon: Calendar, aiPowered: false },
        { name: 'Time Blocking', path: '/time-blocking', icon: Clock, aiPowered: true },
        { name: 'Priority Matrix', path: '/priority-matrix', icon: PieChart, aiPowered: true }
      ]
    },
    {
      section: 'action',
      title: 'Take Action',
      icon: Focus,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      items: [
        { name: 'Today\'s Focus', path: '/focus', icon: Focus, aiPowered: true },
        { name: 'Next Actions', path: '/next-actions', icon: CheckCircle, aiPowered: true },
        { name: 'Time Tracking', path: '/time-tracking', icon: Clock, aiPowered: false },
        { name: 'Pomodoro Timer', path: '/pomodoro', icon: Clock, aiPowered: false },
        { name: 'Focus Mode', path: '/focus-mode', icon: Focus, aiPowered: true }
      ]
    },
    {
      section: 'review',
      title: 'Review',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      items: [
        { name: 'Weekly Review', path: '/weekly-review', icon: BarChart3, aiPowered: true },
        { name: 'Analytics Dashboard', path: '/analytics', icon: PieChart, aiPowered: true },
        { name: 'Progress Tracking', path: '/progress', icon: TrendingUp, aiPowered: true },
        { name: 'Habit Review', path: '/habit-review', icon: Repeat, aiPowered: true },
        { name: 'Goal Assessment', path: '/goal-assessment', icon: Flag, aiPowered: true }
      ]
    },
    {
      section: 'ai',
      title: 'AI Assistant',
      icon: Bot,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      items: [
        { name: 'AI Assistant', path: '/ai-assistant', icon: Bot, aiPowered: true },
        { name: 'Smart Suggestions', path: '/suggestions', icon: Lightbulb, aiPowered: true },
        { name: 'Content Generation', path: '/content-generation', icon: Sparkles, aiPowered: true },
        { name: 'Automation', path: '/automation', icon: Workflow, aiPowered: true }
      ]
    }
  ];

  // Settings and Integrations moved to bottom section
  const bottomItems = [
    { name: 'Integrations', path: '/integrations', icon: Settings, aiPowered: false },
    { name: 'Settings', path: '/settings', icon: Settings, aiPowered: false },
    { name: 'Help', path: '/help', icon: HelpCircle, aiPowered: false }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!sidebarOpen) return null;

  return (
    <div className="h-full w-64 bg-white border-r border-gray-200 flex flex-col sidebar lg:relative lg:z-auto z-50" data-testid="sidebar">
      {/* FlowState Header */}
      <div className="p-3 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
            <Brain className="text-white" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-medium">FlowState</p>
          </div>
          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" title="Flow Active"></div>
        </div>
      </div>

      {/* FLOW Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-2 px-2">
          {navigationItems.map((section) => (
            <div key={section.section} className="space-y-1">
              {/* Section Header with AI Indicator */}
              <button
                onClick={() => toggleSection(section.section)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm ${section.bgColor} ${section.color}`}
              >
                <div className="flex items-center space-x-2">
                  <section.icon size={16} className={section.color} />
                  <span className="font-semibold">{section.title}</span>
                  {section.items.some(item => item.aiPowered) && (
                    <div className="flex items-center space-x-1">
                      <Sparkles size={12} className="text-purple-500" />
                      <span className="text-xs text-purple-600 font-medium">AI</span>
                    </div>
                  )}
                </div>
                {expandedSections[section.section] ? (
                  <ChevronDown size={14} className={section.color} />
                ) : (
                  <ChevronRight size={14} className={section.color} />
                )}
              </button>

              {/* Section Items */}
              <AnimatePresence>
                {expandedSections[section.section] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 ml-4"
                  >
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        data-tour={
                          item.path === '/ai-assistant' ? 'voice-ai' :
                          item.path === '/tasks' ? 'task-management' :
                          item.path === '/projects' ? 'projects' :
                          item.path === '/areas' ? 'areas' :
                          item.path === '/resources' ? 'resources' :
                          item.path === '/archives' ? 'archives' :
                          item.path === '/calendar' ? 'calendar' :
                          item.path === '/analytics' ? 'analytics' :
                          item.path === '/settings' ? 'settings' :
                          item.path === '/voice-capture' ? 'voice-ai' :
                          item.path === '/quick-capture' ? 'voice-ai' :
                          item.path === '/inbox' ? 'voice-ai' :
                          null
                        }
                        className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon size={12} className="flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.aiPowered && (
                          <div className="flex items-center space-x-1">
                            <Sparkles size={10} className="text-purple-500" />
                            <span className="text-xs text-purple-600 font-medium">AI</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section - Settings & Integrations */}
      <div className="border-t border-gray-200/50 p-2">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
