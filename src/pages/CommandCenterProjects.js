import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  Plus,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CommandCenterProjects = () => {
  const { projects, tasks, loading } = useData();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Filter and sort projects
  const filteredProjects = projects?.filter(project => {
    return filterStatus === 'all' || project.status === filterStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'due_date':
        return new Date(a.due_date || '9999-12-31') - new Date(b.due_date || '9999-12-31');
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  }) || [];

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks?.filter(task => task.project_id === projectId) || [];
    const completedTasks = projectTasks.filter(task => task.status === 'completed').length;
    return projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'on_hold': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <TrendingUp className="text-green-500" size={16} />;
      case 'completed': return <CheckCircle className="text-blue-500" size={16} />;
      case 'on_hold': return <Clock className="text-yellow-500" size={16} />;
      case 'cancelled': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Target className="text-gray-500" size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4" data-testid="command-center-projects">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" data-testid="command-center-projects">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="mr-2 text-blue-500" size={24} />
            Projects
          </h1>
          <p className="text-sm text-gray-600 mt-1">Manage your projects and track progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-1 inline" />
            New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Projects</p>
              <p className="text-xl font-bold text-gray-900">{projects?.length || 0}</p>
            </div>
            <FolderOpen className="text-blue-500" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">
                {projects?.filter(p => p.status === 'active').length || 0}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Completed</p>
              <p className="text-xl font-bold text-blue-600">
                {projects?.filter(p => p.status === 'completed').length || 0}
              </p>
            </div>
            <CheckCircle className="text-blue-500" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">On Hold</p>
              <p className="text-xl font-bold text-yellow-600">
                {projects?.filter(p => p.status === 'on_hold').length || 0}
              </p>
            </div>
            <Clock className="text-yellow-500" size={20} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="created_at">Sort by Created</option>
            <option value="due_date">Sort by Due Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredProjects.map((project) => {
            const progress = getProjectProgress(project.id);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(project.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-medium text-gray-900 mb-2">{project.title}</h3>
                {project.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                )}

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2 text-xs text-gray-500">
                  {project.due_date && (
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>Due: {new Date(project.due_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Users size={12} />
                    <span>Team: {project.team_size || 'Solo'}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-sm text-gray-600 mb-4">
            {filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first project'
            }
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-1 inline" />
            New Project
          </button>
        </div>
      )}
    </div>
  );
};

export default CommandCenterProjects;

