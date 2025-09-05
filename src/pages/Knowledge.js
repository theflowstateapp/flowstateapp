import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Tag,
  Calendar,
  Eye,
  Bookmark,
  Share,
  Save,
  X,
  Loader,
  CheckCircle,
  Circle,
  Star,
  FileText,
  Video,
  Link,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Knowledge = () => {
  const [showAddResource, setShowAddResource] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'article',
    url: '',
    tags: '',
    notes: '',
    status: 'to_read'
  });
  const { user } = useAuth();

  const categories = [
    { value: 'article', label: 'Article', icon: FileText, color: 'text-blue-500' },
    { value: 'video', label: 'Video', icon: Video, color: 'text-red-500' },
    { value: 'book', label: 'Book', icon: BookOpen, color: 'text-green-500' },
    { value: 'course', label: 'Course', icon: Bookmark, color: 'text-purple-500' },
    { value: 'podcast', label: 'Podcast', icon: Link, color: 'text-orange-500' },
    { value: 'other', label: 'Other', icon: Download, color: 'text-gray-500' }
  ];

  const statusOptions = [
    { value: 'to_read', label: 'To Read', icon: Circle },
    { value: 'reading', label: 'Reading', icon: Eye },
    { value: 'completed', label: 'Completed', icon: CheckCircle },
    { value: 'archived', label: 'Archived', icon: Bookmark }
  ];

  // Sample knowledge data (in real app, this would come from database)
  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'The Psychology of Money',
      description: 'Timeless lessons on wealth, greed, and happiness',
      category: 'book',
      url: 'https://example.com/book',
      tags: 'finance, psychology, wealth',
      notes: 'Great insights on behavioral finance',
      status: 'completed',
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      title: 'React Best Practices 2024',
      description: 'Modern React development patterns and techniques',
      category: 'article',
      url: 'https://example.com/react-article',
      tags: 'react, javascript, frontend',
      notes: 'Need to implement these patterns',
      status: 'reading',
      created_at: '2024-01-12T14:00:00Z'
    },
    {
      id: 3,
      title: 'Productivity Masterclass',
      description: 'Learn to manage time and increase productivity',
      category: 'course',
      url: 'https://example.com/course',
      tags: 'productivity, time-management, skills',
      notes: 'Highly recommended by colleagues',
      status: 'to_read',
      created_at: '2024-01-15T09:00:00Z'
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a resource title');
      return;
    }

    try {
      if (editingResource) {
        const updatedResources = resources.map(r => 
          r.id === editingResource.id ? { ...r, ...formData } : r
        );
        setResources(updatedResources);
        toast.success('Resource updated successfully!');
      } else {
        const newResource = {
          id: Date.now(),
          ...formData,
          created_at: new Date().toISOString()
        };
        setResources(prev => [newResource, ...prev]);
        toast.success('Resource added successfully!');
      }
      setShowAddResource(false);
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        category: 'article',
        url: '',
        tags: '',
        notes: '',
        status: 'to_read'
      });
    } catch (error) {
      toast.error('Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description || '',
      category: resource.category,
      url: resource.url || '',
      tags: resource.tags || '',
      notes: resource.notes || '',
      status: resource.status
    });
    setShowAddResource(true);
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        setResources(prev => prev.filter(r => r.id !== resourceId));
        toast.success('Resource deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete resource');
      }
    }
  };

  const getResourceStats = () => {
    const totalResources = resources.length;
    const completedResources = resources.filter(r => r.status === 'completed').length;
    const readingResources = resources.filter(r => r.status === 'reading').length;
    const toReadResources = resources.filter(r => r.status === 'to_read').length;

    return {
      total: totalResources,
      completed: completedResources,
      reading: readingResources,
      toRead: toReadResources
    };
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData ? categoryData.icon : FileText;
  };

  const getCategoryColor = (category) => {
    const categoryData = categories.find(c => c.value === category);
    return categoryData ? categoryData.color : 'text-gray-500';
  };

  const getStatusIcon = (status) => {
    const statusData = statusOptions.find(s => s.value === status);
    return statusData ? statusData.icon : Circle;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'reading': return 'text-blue-500';
      case 'to_read': return 'text-yellow-500';
      case 'archived': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = getResourceStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="mr-3 text-blue-500" size={32} />
            Knowledge Base
          </h1>
          <p className="text-gray-600 mt-1">Organize and track your learning resources</p>
        </div>
        <button
          onClick={() => setShowAddResource(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Resources</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <BookOpen className="text-blue-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Reading</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.reading}</p>
            </div>
            <Eye className="text-yellow-500" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">To Read</p>
              <p className="text-2xl font-bold text-purple-700">{stats.toRead}</p>
            </div>
            <Circle className="text-purple-500" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Resources ({filteredResources.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredResources.map((resource) => {
            const CategoryIcon = getCategoryIcon(resource.category);
            const categoryColor = getCategoryColor(resource.category);
            const StatusIcon = getStatusIcon(resource.status);
            const statusColor = getStatusColor(resource.status);
            
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${categoryColor.replace('text-', 'bg-')}20`}>
                      <CategoryIcon size={24} className={categoryColor} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-medium text-gray-900">{resource.title}</h4>
                        <StatusIcon size={16} className={statusColor} />
                      </div>
                      <p className="text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(resource.created_at), 'MMM d, yyyy')}
                        </span>
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700"
                          >
                            <Link size={14} className="mr-1" />
                            View Resource
                          </a>
                        )}
                      </div>
                      {resource.tags && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {resource.tags.split(',').map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {resource.notes && (
                        <p className="text-sm text-gray-600">{resource.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
        >
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No Resources Found' : 'No Resources Yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Start building your knowledge base by adding your first resource.'
            }
          </p>
          <button
            onClick={() => setShowAddResource(true)}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Plus size={20} />
            <span>Add Your First Resource</span>
          </button>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      {showAddResource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddResource(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button
                onClick={() => {
                  setShowAddResource(false);
                  setEditingResource(null);
                  setFormData({
                    title: '',
                    description: '',
                    category: 'article',
                    url: '',
                    tags: '',
                    notes: '',
                    status: 'to_read'
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., React Best Practices"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Brief description of the resource..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((category) => {
                      const CategoryIcon = category.icon;
                      return (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: category.value })}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            formData.category === category.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <CategoryIcon size={20} className={`mx-auto mb-1 ${category.color}`} />
                          <span className="text-xs text-gray-700">{category.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {statusOptions.map((status) => {
                      const StatusIcon = status.icon;
                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: status.value })}
                          className={`w-full p-2 rounded-lg border-2 transition-colors text-left ${
                            formData.status === status.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <StatusIcon size={16} />
                            <span className="text-sm">{status.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/resource"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="react, javascript, frontend"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Any notes about this resource..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddResource(false);
                    setEditingResource(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'article',
                      url: '',
                      tags: '',
                      notes: '',
                      status: 'to_read'
                    });
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
                  <span>{editingResource ? 'Update' : 'Add'} Resource</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Knowledge;

