import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  DollarSign,
  GraduationCap,
  Users,
  Home,
  Activity,
  BookOpen,
  Globe,
  Plus,
  MoreVertical,
  Edit,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const CommandCenterLifeAreas = () => {
  const { areas, projects, tasks, goals, habits, loading } = useData();
  const [selectedArea, setSelectedArea] = useState(null);

  const lifeAreas = [
    {
      id: 'health',
      name: 'Health & Fitness',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Physical and mental well-being'
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Money management and investments'
    },
    {
      id: 'career',
      name: 'Career',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Professional development and work'
    },
    {
      id: 'relationships',
      name: 'Relationships',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Family, friends, and social connections'
    },
    {
      id: 'learning',
      name: 'Learning',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Education and skill development'
    },
    {
      id: 'personal',
      name: 'Personal Growth',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Self-improvement and spirituality'
    },
    {
      id: 'home',
      name: 'Home & Family',
      icon: Home,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Home management and family life'
    },
    {
      id: 'travel',
      name: 'Travel & Adventure',
      icon: Globe,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'Exploration and experiences'
    }
  ];

  const getAreaStats = (areaId) => {
    const areaProjects = projects?.filter(p => p.area === areaId) || [];
    const areaTasks = tasks?.filter(t => t.area === areaId) || [];
    const areaGoals = goals?.filter(g => g.category === areaId) || [];
    const areaHabits = habits?.filter(h => h.category === areaId) || [];
    
    return {
      projects: areaProjects.length,
      tasks: areaTasks.length,
      completedTasks: areaTasks.filter(t => t.status === 'completed').length,
      goals: areaGoals.length,
      habits: areaHabits.length,
      progress: areaTasks.length > 0 ? Math.round((areaTasks.filter(t => t.status === 'completed').length / areaTasks.length) * 100) : 0
    };
  };

  const getAreaIcon = (areaId) => {
    const area = lifeAreas.find(a => a.id === areaId);
    return area ? area.icon : Target;
  };

  const getAreaColor = (areaId) => {
    const area = lifeAreas.find(a => a.id === areaId);
    return area ? area.color : 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4" data-testid="command-center-life-areas">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4" data-testid="command-center-life-areas">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Heart className="mr-2 text-pink-500" size={24} />
            Life Areas
          </h1>
          <p className="text-sm text-gray-600 mt-1">Organize your life across different areas and track progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors">
            <Plus size={16} className="mr-1 inline" />
            Add Area
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Areas</p>
              <p className="text-xl font-bold text-gray-900">{lifeAreas.length}</p>
            </div>
            <Heart className="text-pink-500" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active Projects</p>
              <p className="text-xl font-bold text-blue-600">{projects?.length || 0}</p>
            </div>
            <Target className="text-blue-500" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Tasks</p>
              <p className="text-xl font-bold text-green-600">{tasks?.length || 0}</p>
            </div>
            <CheckCircle className="text-green-500" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Goals Set</p>
              <p className="text-xl font-bold text-purple-600">{goals?.length || 0}</p>
            </div>
            <Calendar className="text-purple-500" size={20} />
          </div>
        </div>
      </div>

      {/* Life Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {lifeAreas.map((area) => {
            const stats = getAreaStats(area.id);
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${area.bgColor} rounded-lg flex items-center justify-center`}>
                    <area.icon className={`${area.color}`} size={20} />
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical size={14} />
                  </button>
                </div>

                <h3 className="text-sm font-medium text-gray-900 mb-1">{area.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{area.description}</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{stats.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${area.color.replace('text-', 'bg-')}`}
                      style={{ width: `${stats.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target size={12} />
                    <span>{stats.projects}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle size={12} />
                    <span>{stats.tasks}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{stats.goals}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity size={12} />
                    <span>{stats.habits}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Area Details Modal */}
      {selectedArea && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedArea(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {lifeAreas.find(a => a.id === selectedArea)?.name}
              </h3>
              <button
                onClick={() => setSelectedArea(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {lifeAreas.find(a => a.id === selectedArea)?.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Target className="mx-auto text-blue-500 mb-2" size={20} />
                  <p className="text-xs text-gray-600">Projects</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {getAreaStats(selectedArea).projects}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="mx-auto text-green-500 mb-2" size={20} />
                  <p className="text-xs text-gray-600">Tasks</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {getAreaStats(selectedArea).tasks}
                  </p>
                </div>
              </div>
              
              <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors">
                View Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CommandCenterLifeAreas;



