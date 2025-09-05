import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Send, Sparkles, Plus, Target, Calendar, BookOpen, Heart, DollarSign, Users, Globe, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const QuickCaptureModal = ({ isOpen, onClose, initialType = 'inbox' }) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState(initialType);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const captureTypes = [
    { value: 'inbox', label: 'Quick Drop', icon: Plus, color: 'text-blue-500' },
    { value: 'task', label: 'Task', icon: Target, color: 'text-green-500' },
    { value: 'event', label: 'Event', icon: Calendar, color: 'text-purple-500' },
    { value: 'note', label: 'Note', icon: BookOpen, color: 'text-orange-500' },
    { value: 'goal', label: 'Goal', icon: Target, color: 'text-red-500' },
    { value: 'habit', label: 'Habit', icon: Heart, color: 'text-pink-500' },
    { value: 'expense', label: 'Expense', icon: DollarSign, color: 'text-emerald-500' },
    { value: 'contact', label: 'Contact', icon: Users, color: 'text-indigo-500' },
    { value: 'project', label: 'Project', icon: Globe, color: 'text-cyan-500' },
  ];

  useEffect(() => {
    if (isOpen) {
      // Focus on input when modal opens
      const input = document.getElementById('quick-capture-input');
      if (input) {
        input.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && isOpen) {
        handleSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, content, type]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Here you would integrate with your backend to process the content
      // For now, we'll simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process content based on type
      const processedContent = await processWithAI(content, type);
      
      // Save to appropriate location
      await saveContent(processedContent, type);
      
      toast.success('Content captured successfully!');
      setContent('');
      onClose();
    } catch (error) {
      toast.error('Failed to capture content');
      console.error('Error capturing content:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processWithAI = async (text, captureType) => {
    // Simulate AI processing
    const aiSuggestions = {
      inbox: 'Added to inbox for processing',
      task: 'Task created with priority',
      event: 'Event scheduled',
      note: 'Note saved to knowledge base',
      goal: 'Goal added to your vision board',
      habit: 'Habit tracker updated',
      expense: 'Expense logged to finance tracker',
      contact: 'Contact added to relationships',
      project: 'Project created in portfolio'
    };

    return {
      original: text,
      processed: text,
      type: captureType,
      aiSuggestion: aiSuggestions[captureType] || 'Content processed',
      tags: extractTags(text),
      priority: extractPriority(text),
      dueDate: extractDate(text)
    };
  };

  const extractTags = (text) => {
    const tags = text.match(/#\w+/g) || [];
    return tags.map(tag => tag.slice(1));
  };

  const extractPriority = (text) => {
    const priorityKeywords = {
      high: ['urgent', 'asap', 'critical', 'important'],
      medium: ['normal', 'regular'],
      low: ['low', 'sometime', 'when possible']
    };

    const lowerText = text.toLowerCase();
    for (const [priority, keywords] of Object.entries(priorityKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return priority;
      }
    }
    return 'medium';
  };

  const extractDate = (text) => {
    // Simple date extraction - in real app, use a proper date parsing library
    const dateMatches = text.match(/(today|tomorrow|next week|next month)/i);
    if (dateMatches) {
      const date = new Date();
      switch (dateMatches[0].toLowerCase()) {
        case 'tomorrow':
          date.setDate(date.getDate() + 1);
          break;
        case 'next week':
          date.setDate(date.getDate() + 7);
          break;
        case 'next month':
          date.setMonth(date.getMonth() + 1);
          break;
      }
      return date.toISOString().split('T')[0];
    }
    return null;
  };

  const saveContent = async (processedContent, captureType) => {
    // In a real app, this would save to your database
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, this would start voice recording
    toast.success('Voice recording started. Speak now...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, this would stop recording and process speech
    toast.success('Voice recording stopped. Processing...');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Quick Capture</h2>
                <p className="text-sm text-gray-600">Capture anything with natural language</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Capture Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {captureTypes.map((captureType) => {
                  const Icon = captureType.icon;
                  return (
                    <button
                      key={captureType.value}
                      onClick={() => setType(captureType.value)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                        type === captureType.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon size={16} className={captureType.color} />
                      <span className="text-sm font-medium">{captureType.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="mb-6">
              <label htmlFor="quick-capture-input" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to capture?
              </label>
              <div className="relative">
                <textarea
                  id="quick-capture-input"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type or speak naturally... e.g., 'Meeting with John tomorrow at 2pm #work #important'"
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  disabled={isProcessing}
                />
                
                {/* Voice Recording Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
                    isRecording 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  disabled={isProcessing}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>
            </div>

            {/* AI Suggestions */}
            {content && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles size={16} className="text-blue-500" />
                  <span className="text-sm font-medium text-blue-700">AI Suggestions</span>
                </div>
                <div className="text-sm text-blue-600">
                  {extractTags(content).length > 0 && (
                    <div className="mb-2">
                      <strong>Tags:</strong> {extractTags(content).map(tag => `#${tag}`).join(', ')}
                    </div>
                  )}
                  {extractPriority(content) !== 'medium' && (
                    <div className="mb-2">
                      <strong>Priority:</strong> {extractPriority(content)}
                    </div>
                  )}
                  {extractDate(content) && (
                    <div>
                      <strong>Due Date:</strong> {extractDate(content)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to save
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isProcessing}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Capture</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickCaptureModal;
