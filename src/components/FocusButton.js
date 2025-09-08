import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PreFocusModal from './PreFocusModal';

const FocusButton = ({ task, className = '', onStartFocus }) => {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [showPreFocusModal, setShowPreFocusModal] = useState(false);
  
  const startFocus = async (focusData) => {
    if (isStarting) return;
    
    setIsStarting(true);
    
    try {
      const response = await fetch('/api/focus/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          plannedMinutes: focusData.plannedMinutes,
          intention: focusData.intention,
          ritual: focusData.ritual
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (onStartFocus) {
          onStartFocus(result);
        } else {
          navigate(`/focus?sid=${result.sessionId}`);
        }
      } else {
        const error = await response.json();
        alert(`Failed to start focus session: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to start focus:', error);
      alert('Failed to start focus session. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handlePreFocusStart = (focusData) => {
    setShowPreFocusModal(false);
    startFocus(focusData);
  };

  const handleButtonClick = () => {
    if (showPreFocusModal) return; // Prevent duplicate modals
    setShowPreFocusModal(true);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      handleButtonClick();
    }
  };
  
  return (
    <>
      <button
        onClick={handleButtonClick}
        onKeyDown={handleKeyPress}
        disabled={isStarting}
        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          isStarting
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
        } ${className}`}
        title="Start Focus Session (F)"
      >
        {isStarting ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
            Starting...
          </>
        ) : (
          <>
            🎯 Start Focus
          </>
        )}
      </button>

      <PreFocusModal
        isOpen={showPreFocusModal}
        onClose={() => setShowPreFocusModal(false)}
        onStart={handlePreFocusStart}
        task={task}
      />
    </>
  );
};

export default FocusButton;
