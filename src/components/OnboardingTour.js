import React, { useState, useEffect } from 'react';
import Joyride, { STATUS, EVENTS } from 'react-joyride';
import { motion } from 'framer-motion';
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
  Heart
} from 'lucide-react';

const OnboardingTour = ({ isFirstTime, onComplete }) => {
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Tour steps configuration
  const steps = [
    {
      target: '[data-tour="welcome"]',
      content: (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-blue-500" />
            </motion.div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Welcome to Flow State! 🎉
          </h3>
          <p className="text-gray-600 mb-4">
            Your AI-powered productivity platform that helps you achieve peak performance in every area of life.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Quick Tip:</strong> This tour will show you the key features. You can skip it anytime!
            </p>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      hideCloseButton: false,
    },
    {
      target: '[data-tour="voice-ai"]',
      content: (
        <div>
          <div className="flex items-center mb-3">
            <Mic className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Voice-First AI Assistant</h3>
          </div>
          <p className="text-gray-600 mb-3">
            The heart of Flow State! Use voice commands to capture tasks, ideas, and thoughts instantly.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-3">
            <p className="text-sm text-gray-700">
              <strong>Try saying:</strong> "Schedule a meeting with John tomorrow at 2 PM"
            </p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Voice recording with waveform visualization</li>
            <li>• AI-powered task extraction and categorization</li>
            <li>• Smart inbox management with drag-and-drop</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="task-management"]',
      content: (
        <div>
          <div className="flex items-center mb-3">
            <CheckSquare className="w-6 h-6 text-green-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Task Management</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Organize your tasks with powerful features and AI assistance.
          </p>
          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <p className="text-sm text-green-800">
              <strong>Features:</strong> Priority levels, due dates, life areas, and smart categorization
            </p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Create tasks with rich metadata</li>
            <li>• Drag-and-drop reordering</li>
            <li>• Bulk operations and filtering</li>
            <li>• One-task-at-a-time processing</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="projects"]',
      content: (
        <div>
          <div className="flex items-center mb-3">
            <Target className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Project Management</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Break down big goals into manageable projects with milestones and team collaboration.
          </p>
          <div className="bg-purple-50 p-3 rounded-lg mb-3">
            <p className="text-sm text-purple-800">
              <strong>Perfect for:</strong> Work projects, personal goals, and life planning
            </p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Project templates and milestones</li>
            <li>• Team member assignments</li>
            <li>• Progress tracking and analytics</li>
            <li>• Integration with tasks and calendar</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="calendar"]',
      content: (
        <div>
          <div className="flex items-center mb-3">
            <Calendar className="w-6 h-6 text-orange-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Calendar Integration</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Seamlessly integrate your tasks and projects with your calendar for perfect time management.
          </p>
          <div className="bg-orange-50 p-3 rounded-lg mb-3">
            <p className="text-sm text-orange-800">
              <strong>Smart Features:</strong> Auto-scheduling, time blocking, and conflict detection
            </p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Drag tasks to calendar for scheduling</li>
            <li>• Time blocking and focus sessions</li>
            <li>• Meeting integration and reminders</li>
            <li>• Work-life balance insights</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="life-areas"]',
      content: (
        <div>
          <div className="flex items-center mb-3">
            <Heart className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Life Areas</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Organize your life across different areas: Health, Learning, Relationships, Finance, and more.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-red-50 p-2 rounded text-center">
              <Heart className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <p className="text-xs text-red-800">Health</p>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <BookOpen className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-blue-800">Learning</p>
            </div>
            <div className="bg-green-50 p-2 rounded text-center">
              <Users className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-green-800">Relationships</p>
            </div>
            <div className="bg-yellow-50 p-2 rounded text-center">
              <Zap className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
              <p className="text-xs text-yellow-800">Finance</p>
            </div>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Track progress across life areas</li>
            <li>• Balance work and personal life</li>
            <li>• Set area-specific goals</li>
            <li>• Get insights and recommendations</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="analytics"]',
      content: (
        <div>
          <div className="flex items-center mb-3">
            <BarChart3 className="w-6 h-6 text-indigo-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Analytics & Insights</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Get powerful insights into your productivity patterns and life balance.
          </p>
          <div className="bg-indigo-50 p-3 rounded-lg mb-3">
            <p className="text-sm text-indigo-800">
              <strong>Track:</strong> Task completion, time usage, productivity trends, and life balance
            </p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Productivity metrics and trends</li>
            <li>• Time allocation across life areas</li>
            <li>• Goal progress and achievements</li>
            <li>• Personalized recommendations</li>
          </ul>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="settings"]',
      content: (
        <div>
          <div className="flex items-center mb-3">
            <Settings className="w-6 h-6 text-gray-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-900">Settings & Customization</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Customize your Flow State experience to match your preferences and workflow.
          </p>
          <div className="bg-gray-50 p-3 rounded-lg mb-3">
            <p className="text-sm text-gray-800">
              <strong>Personalize:</strong> Themes, notifications, AI preferences, and integrations
            </p>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Dark/light theme options</li>
            <li>• Notification preferences</li>
            <li>• AI learning and suggestions</li>
            <li>• Data export and backup</li>
          </ul>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="completion"]',
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            You're All Set! 🚀
          </h3>
          <p className="text-gray-600 mb-4">
            You now know the key features of Flow State. Start by capturing your first task with voice!
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Next Steps:</strong>
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <Mic className="w-4 h-4 text-blue-500 mr-1" />
                <span>Try voice capture</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center">
                <CheckSquare className="w-4 h-4 text-green-500 mr-1" />
                <span>Create your first task</span>
              </div>
            </div>
          </div>
        </div>
      ),
      placement: 'center',
    },
  ];

  // Tour options
  const tourOptions = {
    steps,
    continuous: true,
    showProgress: true,
    showSkipButton: true,
    hideCloseButton: false,
    disableOverlayClose: true,
    spotlightClicks: false,
    styles: {
      options: {
        primaryColor: '#3B82F6',
        textColor: '#374151',
        backgroundColor: '#FFFFFF',
        overlayColor: 'rgba(0, 0, 0, 0.4)',
        spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
        beaconSize: 36,
        zIndex: 1000,
      },
      tooltip: {
        borderRadius: 8,
        fontSize: 14,
        padding: 20,
      },
      tooltipContainer: {
        textAlign: 'left',
      },
      tooltipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      tooltipContent: {
        padding: 0,
      },
      buttonNext: {
        backgroundColor: '#3B82F6',
        borderRadius: 6,
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
        padding: '8px 16px',
      },
      buttonBack: {
        color: '#6B7280',
        fontSize: 14,
        marginRight: 8,
      },
      buttonSkip: {
        color: '#6B7280',
        fontSize: 14,
      },
      beacon: {
        inner: '#3B82F6',
        outer: '#3B82F6',
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

  // Handle tour events
  const handleJoyrideCallback = (data) => {
    const { status, type, index } = data;
    
    console.log('Tour callback:', { status, type, index, stepIndex });
    
    if (type === EVENTS.TOUR_END || status === STATUS.SKIPPED || status === STATUS.FINISHED) {
      // Tour ended
      setRunTour(false);
      setStepIndex(0);
      localStorage.setItem('flowstate-tour-completed', 'true');
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Start tour for first-time users
  useEffect(() => {
    if (isFirstTime && !localStorage.getItem('flowstate-tour-completed')) {
      // Small delay to ensure the page is fully loaded
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);

  // Manual tour trigger (for testing or re-running)
  const startTour = () => {
    setRunTour(true);
    setStepIndex(0);
  };

  return (
    <>
      <Joyride
        {...tourOptions}
        callback={handleJoyrideCallback}
        run={runTour}
      />
      
      {/* Tour trigger button (hidden by default, can be shown for testing) */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={startTour}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-600 transition-colors"
          title="Start Tour (Dev Only)"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default OnboardingTour;