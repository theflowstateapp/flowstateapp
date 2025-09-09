import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [captureInput, setCaptureInput] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const navigate = useNavigate();
  
  const handleCapture = async (e) => {
    e.preventDefault();
    if (!captureInput.trim() || isCapturing) return;
    
    setIsCapturing(true);
    
    try {
      // Step 1: Capture the input
      const captureResponse = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: captureInput.trim() })
      });
      
      if (!captureResponse.ok) {
        throw new Error('Capture failed');
      }
      
      const captureData = await captureResponse.json();
      
      // Step 2: Propose scheduling
      const proposeResponse = await fetch('/api/schedule/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId: captureData.taskId,
          strategy: 'mornings'
        })
      });
      
      if (!proposeResponse.ok) {
        throw new Error('Proposal failed');
      }
      
      const proposeData = await proposeResponse.json();
      
      // Step 3: Create task
      const createResponse = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: captureData.parsed.title,
          priority: captureData.parsed.priority,
          estimateMins: captureData.parsed.estimateMins,
          context: captureData.parsed.context,
          dueAt: captureData.parsed.dueAt,
          proposal: proposeData.proposal
        })
      });
      
      if (!createResponse.ok) {
        throw new Error('Task creation failed');
      }
      
      const taskData = await createResponse.json();
      
      // Clear input and show success
      setCaptureInput('');
      
      // Navigate to tasks page to show the new task
      navigate('/app/tasks');
      
    } catch (error) {
      console.error('Global capture failed:', error);
      // You could show a toast notification here
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
