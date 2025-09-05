import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Palette,
  FolderOpen,
  Heart,
  DollarSign,
  Users,
  BookOpen,
  Star,
  Settings,
  X,
  Save,
  Loader
} from 'lucide-react';
import { useAreas } from '../hooks/useSupabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Areas = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'target'
  });
  const { user } = useAuth();
  const { areas, loading, addArea, updateArea, deleteArea } = useAreas();

  const iconOptions = [
    { value: 'target', label: 'Target', icon: Target },
    { value: 'folder', label: 'Folder', icon: FolderOpen },
    { value: 'heart', label: 'Heart', icon: Heart },
    { value: 'dollar', label: 'Dollar', icon: DollarSign },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'book', label: 'Book', icon: BookOpen },
    { value: 'star', label: 'Star', icon: Star },
    { value: 'settings', label: 'Settings', icon: Settings }
  ];

  const colorOptions = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter an area name');
      return;
    }

    try {
      if (editingArea) {
        await updateArea(editingArea.id, formData);
        toast.success('Area updated successfully!');
      } else {
        await addArea(formData);
        toast.success('Area created successfully!');
      }
      setShowAddModal(false);
      setEditingArea(null);
      setFormData({ name: '', description: '', color: '#3B82F6', icon: 'target' });
    } catch (error) {
      toast.error('Failed to save area');
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      description: area.description || '',
      color: area.color,
      icon: area.icon
    });
    setShowAddModal(true);
  };

  const handleDelete = async (areaId) => {
    if (window.confirm('Are you sure you want to delete this area?')) {
      try {
        await deleteArea(areaId);
        toast.success('Area deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete area');
      }
    }
  };

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(option => option.value === iconName);
    return iconOption ? iconOption.icon : Target;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Target className="mr-3 text-green-500" size={32} />
              Life Areas
            </h1>
            <p className="text-gray-600 mt-1">Ongoing responsibilities and areas of focus</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-primary-500" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Target className="mr-3 text-green-500" size={32} />
            Life Areas
          </h1>
          <p className="text-gray-600 mt-1">Ongoing responsibilities and areas of focus</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Area</span>
        </button>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => {
          const IconComponent = getIconComponent(area.icon);
          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: area.color + '20' }}
                >
                  <IconComponent 
                    size={24} 
                    style={{ color: area.color }}
                  />
                </div>
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
                  </button>
                  <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                    <button
                      onClick={() => handleEdit(area)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Edit size={14} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.name}</h3>
              {area.description && (
                <p className="text-gray-600 text-sm mb-4">{area.description}</p>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Active</span>
                <span className="font-medium text-green-600">✓</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {areas.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
        >
          <Target className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Life Areas Yet</h3>
          <p className="text-gray-600 mb-6">Create your first life area to start organizing your responsibilities.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Add Your First Area</span>
          </button>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingArea ? 'Edit Area' : 'Add New Area'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingArea(null);
                  setFormData({ name: '', description: '', color: '#3B82F6', icon: 'target' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Health & Fitness"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Brief description of this life area..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: option.value })}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          formData.icon === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent size={20} className="mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color
                          ? 'border-gray-800 scale-110'
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingArea(null);
                    setFormData({ name: '', description: '', color: '#3B82F6', icon: 'target' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{editingArea ? 'Update' : 'Create'} Area</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Areas;

