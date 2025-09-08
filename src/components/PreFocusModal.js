import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Target, CheckCircle } from 'lucide-react';

const PreFocusModal = ({ isOpen, onClose, onStart, task }) => {
  const [ritual, setRitual] = useState({
    tabsClosed: false,
    phoneSilent: false,
    materialsReady: false
  });
  const [intention, setIntention] = useState('');
  const [duration, setDuration] = useState('50');
  const [customDuration, setCustomDuration] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  
  const intentionRef = useRef(null);
  const modalRef = useRef(null);

  // Focus intention input when modal opens
  useEffect(() => {
    if (isOpen && intentionRef.current) {
      setTimeout(() => intentionRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleStart();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const handleRitualChange = (key) => {
    setRitual(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDurationChange = (value) => {
    if (value === 'custom') {
      setShowCustom(true);
      setCustomDuration('25');
    } else {
      setShowCustom(false);
      setDuration(value);
    }
  };

  const handleStart = () => {
    const plannedMinutes = showCustom ? parseInt(customDuration) || 25 : parseInt(duration);
    const trimmedIntention = intention.trim().slice(0, 200);
    
    onStart({
      plannedMinutes,
      intention: trimmedIntention,
      ritual: Object.keys(ritual).some(key => ritual[key]) ? ritual : null
    });
  };

  const getRitualCount = () => {
    return Object.values(ritual).filter(Boolean).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Get into flow (10 sec)
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Task context */}
        {task && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">{task.title}</p>
          </div>
        )}

        {/* Ritual checkboxes */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Preparation ({getRitualCount()}/3)
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ritual.tabsClosed}
                onChange={() => handleRitualChange('tabsClosed')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Close distracting tabs</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ritual.phoneSilent}
                onChange={() => handleRitualChange('phoneSilent')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Phone on silent</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ritual.materialsReady}
                onChange={() => handleRitualChange('materialsReady')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Materials ready</span>
            </label>
          </div>
        </div>

        {/* Intention input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intention
          </label>
          <input
            ref={intentionRef}
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="What will you finish in this session?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {intention.length}/200 characters
          </p>
        </div>

        {/* Duration selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {['25', '50', '90'].map((mins) => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  duration === mins && !showCustom
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
          <button
            onClick={() => handleDurationChange('custom')}
            className={`w-full px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showCustom
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Custom
          </button>
          {showCustom && (
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                min="5"
                max="180"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-500">minutes</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle size={16} />
            <span>Start Focus</span>
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Enter</kbd> to start, <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> to cancel
        </div>
      </div>
    </div>
  );
};

export default PreFocusModal;
