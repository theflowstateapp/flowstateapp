import React, { useState, useEffect, useCallback } from 'react';
import Joyride, { STATUS, EVENTS, ACTIONS } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Zap,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  BookOpen,
  Heart,
  X,
  Play,
  SkipForward
} from 'lucide-react';

const OnboardingTour = ({ isFirstTime, onComplete }) => {
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced tour steps with better UX
  const steps = [
    {
      target: 'body',
      content: (
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <Sparkles className="w-16 h-16 text-blue-500" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✨</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome to FlowState! 🎉
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your AI-powered productivity platform that helps you achieve peak performance using the proven P.A.R.A. method.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-800">What you'll learn:</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• How to use voice capture for instant task creation</li>
              <li>• Organize your life with P.A.R.A. method</li>
              <li>• Navigate the dashboard and key features</li>
              <li>• Create your first task and project</li>
            </ul>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Step 1 of 8</span>
            </div>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      hideCloseButton: true,
      hideFooter: false,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
    {
      target: '[data-tour="voice-ai"]',
      content: (
        <div className="max-w-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Mic className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Voice-First AI Assistant</h3>
              <p className="text-sm text-gray-500">The heart of FlowState</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Capture tasks, ideas, and thoughts instantly using natural speech. Our AI understands context and automatically organizes everything.
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-700 font-medium mb-2">Try saying:</p>
            <div className="bg-white p-2 rounded border-l-4 border-blue-400">
              <p className="text-sm italic text-gray-600">
                "Schedule a meeting with John tomorrow at 2 PM"
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              <span>Voice recording with waveform</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              <span>AI-powered categorization</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              <span>Smart inbox management</span>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      hideCloseButton: true,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
    {
      target: '[data-tour="task-management"]',
      content: (
        <div className="max-w-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Task Management</h3>
              <p className="text-sm text-gray-500">Organize with power</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Create, organize, and track your tasks with intelligent features. Set priorities, due dates, and connect tasks to life areas.
          </p>
          
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-green-800 font-medium mb-2">Key Features:</p>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                <span>Priority levels & due dates</span>
              </div>
              <div className="flex items-center text-sm text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                <span>Drag-and-drop reordering</span>
              </div>
              <div className="flex items-center text-sm text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                <span>Smart categorization</span>
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      hideCloseButton: true,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
    {
      target: '[data-tour="projects"]',
      content: (
        <div className="max-w-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Projects</h3>
              <p className="text-sm text-gray-500">Break down big goals</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Transform big goals into manageable projects with milestones, team collaboration, and progress tracking.
          </p>
          
          <div className="bg-purple-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-purple-800 font-medium mb-2">Perfect for:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
              <div className="bg-white p-2 rounded text-center">Work Projects</div>
              <div className="bg-white p-2 rounded text-center">Personal Goals</div>
              <div className="bg-white p-2 rounded text-center">Life Planning</div>
              <div className="bg-white p-2 rounded text-center">Team Goals</div>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      hideCloseButton: true,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
    {
      target: '[data-tour="areas"]',
      content: (
        <div className="max-w-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Life Areas</h3>
              <p className="text-sm text-gray-500">Organize your life</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Organize your life across different areas: Health, Learning, Relationships, Finance, and more. Each area has its own goals and tracking.
          </p>
          
          <div className="bg-red-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-red-800 font-medium mb-2">Life Areas:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-red-700">
              <div className="bg-white p-2 rounded text-center">Health</div>
              <div className="bg-white p-2 rounded text-center">Learning</div>
              <div className="bg-white p-2 rounded text-center">Relationships</div>
              <div className="bg-white p-2 rounded text-center">Finance</div>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      hideCloseButton: true,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
    {
      target: '[data-tour="resources"]',
      content: (
        <div className="max-w-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Resources</h3>
              <p className="text-sm text-gray-500">Store & organize</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Store and organize your reference materials, documents, links, and notes with AI-powered tagging and intelligent search.
          </p>
          
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-yellow-800 font-medium mb-2">Store:</p>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-yellow-700">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                <span>Articles & documents</span>
              </div>
              <div className="flex items-center text-sm text-yellow-700">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                <span>Links & bookmarks</span>
              </div>
              <div className="flex items-center text-sm text-yellow-700">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                <span>Notes & ideas</span>
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      hideCloseButton: true,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
    {
      target: '[data-tour="archives"]',
      content: (
        <div className="max-w-sm">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Archives</h3>
              <p className="text-sm text-gray-500">Completed & inactive</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Archive completed projects and inactive resources. Keep your workspace clean while maintaining easy access to historical data.
          </p>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-800 font-medium mb-2">Archive:</p>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></div>
                <span>Completed projects</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></div>
                <span>Inactive resources</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></div>
                <span>Historical data</span>
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
      hideCloseButton: true,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
    {
      target: 'body',
      content: (
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <CheckSquare className="w-8 h-8 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            You're All Set! 🎉
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            You now know the basics of FlowState. Start by creating your first task or exploring the voice capture feature.
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-100 mb-6">
            <p className="text-sm text-gray-700 font-medium mb-3">Next Steps:</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <Mic className="w-4 h-4 text-blue-500 mr-2" />
                <span>Try voice capture for instant task creation</span>
              </div>
              <div className="flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-500 mr-2" />
                <span>Create your first project</span>
              </div>
              <div className="flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500 mr-2" />
                <span>Set up your life areas</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Tour Complete!</span>
            </div>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      hideCloseButton: true,
      spotlightClicks: false,
      disableOverlayClose: true,
    },
  ];

  // Enhanced tour options with better UX
  const tourOptions = {
    steps,
    continuous: true,
    showProgress: true,
    showSkipButton: true,
    hideCloseButton: true,
    disableOverlayClose: true,
    spotlightClicks: false,
    disableScrolling: false,
    scrollOffset: 100,
    scrollDuration: 300,
    locale: {
      back: 'Back',
      close: 'Close',
      last: 'Finish',
      next: 'Next',
      skip: 'Skip Tour'
    },
    styles: {
      options: {
        primaryColor: '#3B82F6',
        textColor: '#374151',
        backgroundColor: '#FFFFFF',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        spotlightShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
        beaconSize: 40,
        zIndex: 10000,
        arrowColor: '#FFFFFF',
      },
      tooltip: {
        borderRadius: 12,
        fontSize: 14,
        padding: 24,
        maxWidth: 400,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
      },
      tooltipContainer: {
        textAlign: 'left',
      },
      tooltipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1F2937',
      },
      tooltipContent: {
        padding: 0,
        lineHeight: 1.6,
      },
      buttonNext: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        padding: '10px 20px',
        border: 'none',
        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
        transition: 'all 0.2s ease',
      },
      buttonBack: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
        marginRight: 12,
        padding: '10px 16px',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        transition: 'all 0.2s ease',
      },
      buttonSkip: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '500',
        padding: '10px 16px',
        borderRadius: 8,
        transition: 'all 0.2s ease',
      },
      beacon: {
        inner: '#3B82F6',
        outer: '#3B82F6',
      },
      spotlight: {
        borderRadius: 8,
      },
    },
    locale: {
      back: 'Back',
      close: 'Close',
      last: 'Finish Tour',
      next: 'Next',
      skip: 'Skip Tour',
    },
  };

  // Enhanced tour event handling
  const handleJoyrideCallback = useCallback((data) => {
    const { status, type, index, action } = data;
    
    console.log('Tour callback:', { status, type, index, action, stepIndex });
    
    // Handle different tour events
    if (type === EVENTS.TOUR_END || status === STATUS.SKIPPED || status === STATUS.FINISHED) {
      // Tour ended
      setRunTour(false);
      setStepIndex(0);
      localStorage.setItem('flowstate-tour-completed', 'true');
      
      // Track completion
      if (status === STATUS.FINISHED) {
        console.log('Tour completed successfully');
        // Track analytics here if needed
      } else if (status === STATUS.SKIPPED) {
        console.log('Tour skipped');
        // Track skip analytics here if needed
      }
      
      if (onComplete) {
        onComplete();
      }
    } else if (type === EVENTS.STEP_AFTER) {
      // Step completed - update step index
      setStepIndex(index);
      console.log(`Completed step ${index}`);
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      // Target element not found
      console.warn(`Target not found for step ${index}`);
      // Continue to next step
      setStepIndex(index + 1);
    } else if (action === ACTIONS.NEXT) {
      // Next button clicked
      setStepIndex(index + 1);
      console.log(`Moving to step ${index + 1}`);
    } else if (action === ACTIONS.PREV) {
      // Previous button clicked
      setStepIndex(index - 1);
      console.log(`Moving to step ${index - 1}`);
    }
  }, [onComplete]);

  // Start tour for first-time users with better timing
  useEffect(() => {
    if (isFirstTime && !localStorage.getItem('flowstate-tour-completed')) {
      setIsLoading(true);
      
      // Wait for page to be fully loaded and elements to be rendered
      const timer = setTimeout(() => {
        // Check if all required elements exist
        const requiredElements = [
          '[data-tour="voice-ai"]',
          '[data-tour="task-management"]',
          '[data-tour="projects"]',
          '[data-tour="areas"]',
          '[data-tour="resources"]',
          '[data-tour="archives"]'
        ];
        
        const missingElements = requiredElements.filter(selector => 
          !document.querySelector(selector)
        );
        
        if (missingElements.length === 0) {
          setRunTour(true);
          setIsLoading(false);
        } else {
          console.warn('Missing tour elements:', missingElements);
          // Retry after a longer delay
          setTimeout(() => {
            setRunTour(true);
            setIsLoading(false);
          }, 2000);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);

  // Manual tour trigger for testing
  const startTour = () => {
    setRunTour(true);
    setStepIndex(0);
  };

  // Skip tour
  const skipTour = () => {
    setRunTour(false);
    localStorage.setItem('flowstate-tour-completed', 'true');
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <>
      <Joyride
        {...tourOptions}
        callback={handleJoyrideCallback}
        run={runTour}
        stepIndex={stepIndex}
      />
      
      {/* Loading overlay for tour initialization */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </motion.div>
                <span className="text-gray-700 font-medium">Preparing your tour...</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tour trigger button for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          <button
            onClick={startTour}
            className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            title="Start Tour (Dev Only)"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Start Tour</span>
          </button>
          <button
            onClick={skipTour}
            className="bg-gray-500 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            title="Skip Tour (Dev Only)"
          >
            <SkipForward className="w-4 h-4" />
            <span className="text-sm font-medium">Skip</span>
          </button>
        </div>
      )}
    </>
  );
};

export default OnboardingTour;