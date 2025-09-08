import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, X, ArrowRight } from 'lucide-react';

const DailyShutdownBanner = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [status, setStatus] = useState(null);

  // Check if it's shutdown time and if review is needed
  useEffect(() => {
    const checkShutdownStatus = async () => {
      try {
        const response = await fetch('/api/day/status');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
          
          // Show banner if it's shutdown time and review doesn't exist
          const now = new Date();
          const hour = now.getHours();
          const isShutdownTime = hour >= 18 && hour <= 23;
          
          if (isShutdownTime && !data.todayReviewExists && !isDismissed) {
            setIsVisible(true);
          }
        }
      } catch (error) {
        console.error('Failed to check shutdown status:', error);
      }
    };

    checkShutdownStatus();
    
    // Check every 30 minutes
    const interval = setInterval(checkShutdownStatus, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isDismissed]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.shiftKey && e.key === 'S') {
        e.preventDefault();
        navigate('/shutdown');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const handleStart = () => {
    navigate('/shutdown');
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    
    // Snooze for 1 hour
    setTimeout(() => {
      setIsDismissed(false);
    }, 60 * 60 * 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5" />
            <div>
              <p className="font-medium">Daily Shutdown — 30 seconds to reset and plan tomorrow.</p>
              <p className="text-sm text-blue-100">
                Press <kbd className="px-1 py-0.5 bg-blue-500 rounded text-xs">Shift+S</kbd> to start
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleStart}
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Start
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-2 text-blue-200 hover:text-white transition-colors"
              title="Not now (snooze 1 hour)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyShutdownBanner;
