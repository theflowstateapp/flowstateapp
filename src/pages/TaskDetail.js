import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  User,
  Target,
  Flag,
  Heart,
  ArrowUpRight,
  Download,
  Info,
  Star,
  AlertCircle,
  FileText,
  MessageSquare,
  BookOpen,
  Phone,
  MapPin,
  Settings,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Copy,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    relations: true,
    taskManagement: true,
    reports: true,
    system: true
  });
  const [isEditing, setIsEditing] = useState(false);

  // Mock task data based on the Notion template
  const mockTask = {
    id: taskId || '1',
    title: 'New Task',
    status: 'Inbox',
    doDate: '2025-02-09',
    isImportant: false,
    isUrgent: false,
    priorityMatrix: 'Priority 4. Low',
    assignee: 'Abhishek John',
    deadlineDate: null,
    dailyPriority: 0,
    blockedBy: null,
    blocking: null,
    dependencyReport: 'Actionable',
    project: 'Light the World',
    goal: 'Become a better writer',
    lifeArea: 'Personal Growth',
    timeTracker: 'Click Start',
    taskReport: 'Assigned To: @Abhishek John, Do Today: 02-Sep-2025'
  };

  useEffect(() => {
    // In a real app, fetch task data from API
    setTask(mockTask);
  }, [taskId]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Inbox': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Priority 1. Urgent': return 'bg-red-100 text-red-800';
      case 'Priority 2. High': return 'bg-orange-100 text-orange-800';
      case 'Priority 3. Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Priority 4. Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CollapsibleSection = ({ title, icon: Icon, expanded, onToggle, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to view task details.</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Notion Life OS</span>
              <span>/</span>
              <span>...</span>
              <span>/</span>
              <span>Tasks Database</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{task.title}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Share2 size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Copy size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              Get Notion free
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Main Task Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Task Icon and Title */}
          <div className="p-8 text-center border-b border-gray-200">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{task.title}</h1>
          </div>

          {/* Core Properties */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Do Dates:</span>
                <span className="text-sm text-gray-900">{task.doDate}</span>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
                  Start
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
                  Start
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">
                  Complete
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button className="py-4 px-2 border-b-2 border-blue-600 text-blue-600 font-medium flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>Task Info</span>
              </button>
              <button className="py-4 px-2 text-gray-500 hover:text-gray-700 flex items-center space-x-2">
                <Target size={16} />
                <span>Related Life Area</span>
              </button>
              <button className="py-4 px-2 text-gray-500 hover:text-gray-700 flex items-center space-x-2">
                <Target size={16} />
                <span>Related Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Relations Section */}
        <CollapsibleSection
          title="Relations"
          icon={Target}
          expanded={expandedSections.relations}
          onToggle={() => toggleSection('relations')}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium">Add Sub-Tasks</span>
                <ArrowUpRight size={16} />
              </button>
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium">Add Goal</span>
                <ArrowUpRight size={16} />
              </button>
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium">Add Project</span>
                <ArrowUpRight size={16} />
              </button>
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium">Add Parent Task</span>
                <ArrowUpRight size={16} />
              </button>
              <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium">Add Life Area</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Task Management Section */}
        <CollapsibleSection
          title="Task Management"
          icon={Settings}
          expanded={expandedSections.taskManagement}
          onToggle={() => toggleSection('taskManagement')}
        >
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.isImportant}
                    className="rounded border-gray-300"
                  />
                  <span className="font-medium">Important</span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={task.isUrgent}
                    className="rounded border-gray-300"
                  />
                  <span className="font-medium">Urgent</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Priority Matrix:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(task.priorityMatrix)}`}>
                    {task.priorityMatrix}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Assignee:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">A</span>
                    </div>
                    <span className="text-sm">{task.assignee}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Deadline Date:</span>
                  <span className="text-sm text-gray-500">Empty</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Daily Priority:</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Blocked by:</span>
                  <span className="text-sm text-gray-500">Empty</span>
                  <ArrowUpRight size={16} className="text-gray-400" />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Blocking:</span>
                  <span className="text-sm text-gray-500">Empty</span>
                  <ArrowUpRight size={16} className="text-gray-400" />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Dependency Report:</span>
                  <span className="text-sm text-green-600 font-medium">{task.dependencyReport}</span>
                  <AlertCircle size={16} className="text-gray-400" />
                </div>
                <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
                  <Download size={16} />
                  <span>Add To System</span>
                </button>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Reports Section */}
        <CollapsibleSection
          title="Reports"
          icon={FileText}
          expanded={expandedSections.reports}
          onToggle={() => toggleSection('reports')}
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Task Report:</span>
              <span className="text-sm text-gray-900">{task.taskReport}</span>
              <Info size={16} className="text-gray-400" />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Time Tracker:</span>
              <span className="text-sm text-green-600 font-medium">{task.timeTracker}</span>
              <Clock size={16} className="text-gray-400" />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">1 more property</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </CollapsibleSection>

        {/* System Section */}
        <CollapsibleSection
          title="System"
          icon={Settings}
          expanded={expandedSections.system}
          onToggle={() => toggleSection('system')}
        >
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">19 more properties</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default TaskDetail;
