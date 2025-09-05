import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Target, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  User, 
  Flag,
  X,
  Plus,
  Calendar,
  Tag,
  Star
} from 'lucide-react';

const QuickCapture = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    tags: '',
    status: 'Not Started'
  });
  const [captureType, setCaptureType] = useState('general');

  useEffect(() => {
    // Determine capture type from URL
    const path = location.pathname;
    if (path.includes('/task')) {
      setCaptureType('task');
    } else if (path.includes('/project')) {
      setCaptureType('project');
    } else if (path.includes('/note')) {
      setCaptureType('note');
    } else if (path.includes('/meeting')) {
      setCaptureType('meeting');
    } else if (path.includes('/reference')) {
      setCaptureType('reference');
    } else if (path.includes('/contact')) {
      setCaptureType('contact');
    } else if (path.includes('/goal')) {
      setCaptureType('goal');
    }
  }, [location]);

  const captureTypes = [
    { type: 'task', icon: Target, label: 'Task', path: '/quick-capture/task' },
    { type: 'project', icon: Target, label: 'Project', path: '/quick-capture/project' },
    { type: 'note', icon: FileText, label: 'Note', path: '/quick-capture/note' },
    { type: 'meeting', icon: MessageSquare, label: 'Meeting Notes', path: '/quick-capture/meeting' },
    { type: 'reference', icon: BookOpen, label: 'Reference', path: '/quick-capture/reference' },
    { type: 'contact', icon: User, label: 'Contact', path: '/quick-capture/contact' },
    { type: 'goal', icon: Flag, label: 'Goal', path: '/quick-capture/goal' }
  ];

  const getCaptureTypeInfo = () => {
    return captureTypes.find(type => type.type === captureType) || captureTypes[0];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save to your database
    
    // Show success message and redirect
    alert(`${getCaptureTypeInfo().label} captured successfully!`);
    navigate('/');
  };

  const renderFormFields = () => {
    const baseFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {captureType === 'task' || captureType === 'project' ? 'Title' : 
             captureType === 'contact' ? 'Name' : 'Title'}
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={
              captureType === 'task' ? 'Enter task title...' :
              captureType === 'project' ? 'Enter project name...' :
              captureType === 'contact' ? 'Enter contact name...' :
              'Enter title...'
            }
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add description..."
          />
        </div>
      </>
    );

    const taskProjectFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter tags separated by commas..."
          />
        </div>
      </>
    );

    const contactFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter email..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter phone number..."
            />
          </div>
        </div>
      </>
    );

    const goalFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select category...</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Career">Career</option>
              <option value="Finance">Finance</option>
              <option value="Family">Family</option>
              <option value="Learning">Learning</option>
            </select>
          </div>
        </div>
      </>
    );

    return (
      <>
        {baseFields}
        {(captureType === 'task' || captureType === 'project') && taskProjectFields}
        {captureType === 'contact' && contactFields}
        {captureType === 'goal' && goalFields}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="mr-3 text-yellow-500" size={32} />
              Quick Capture
            </h1>
            <p className="text-gray-600 mt-1">Capture anything, anywhere, anytime</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Capture Type Selector */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What are you capturing?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {captureTypes.map((type) => (
              <button
                key={type.type}
                onClick={() => navigate(type.path)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  captureType === type.type
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <type.icon className="mx-auto mb-2" size={24} />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Capture Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center mb-6">
            {(() => {
              const IconComponent = getCaptureTypeInfo().icon;
              return <IconComponent className="mr-3 text-primary-600" size={24} />;
            })()}
            <h2 className="text-xl font-semibold text-gray-900">
              New {getCaptureTypeInfo().label}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderFormFields()}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Capture {getCaptureTypeInfo().label}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickCapture;
