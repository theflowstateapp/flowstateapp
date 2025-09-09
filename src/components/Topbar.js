import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import dataService from '../services/dataService';

const Topbar = () => {
  const [captureInput, setCaptureInput] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const navigate = useNavigate();
  
  const handleCapture = async (e) => {
    e.preventDefault();
    if (!captureInput.trim() || isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      // Use the new data service to create an inbox item
      const result = await dataService.createInboxItem({
        content: captureInput.trim(),
        type: 'task',
        priority: 'medium'
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Capture failed');
      }
      
      // Track the event
      await dataService.trackEvent('task_captured', {
        content: captureInput.trim(),
        method: 'global_capture'
      });
      
      // Clear input and show success
      setCaptureInput('');
      
      toast.success('Task captured successfully!', {
        icon: '✅',
        duration: 3000,
      });
      
      // Navigate to tasks page to show the new task
      navigate('/app/tasks');
      
    } catch (error) {
      console.error('Global capture failed:', error);
      toast.error('Failed to capture task. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };
  
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* App Title */}
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">FlowState</h2>
          <span className="text-sm text-gray-500">Workspace</span>
        </div>
        
        {/* Global Capture */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleCapture} className="relative">
            <input
              type="text"
              value={captureInput}
              onChange={(e) => setCaptureInput(e.target.value)}
              placeholder="Capture anything... (e.g., 'Call dentist 30m next week @Health #high')"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCapturing}
            />
            <button
              type="submit"
              disabled={!captureInput.trim() || isCapturing}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isCapturing ? '...' : 'Capture'}
            </button>
          </form>
        </div>
        
        {/* Right Side Badges */}
        <div className="flex items-center space-x-3">
          {/* Plan Badge */}
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Free
          </span>
          
          {/* Flow Badge */}
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Flow: 68
          </span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
