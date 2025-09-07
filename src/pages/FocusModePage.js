import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Focus,
  Play,
  Pause,
  Square,
  Settings,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Zap,
  Brain,
  Target,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FocusModePage = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes
  const [isBreak, setIsBreak] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [settings, setSettings] = useState({
    focusTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4,
    soundEnabled: true,
    darkMode: false,
    notifications: true
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      if (!isBreak) {
        setSessionsCompleted(sessions => sessions + 1);
        setIsBreak(true);
        setTimeRemaining(settings.breakTime * 60);
        if (settings.notifications) {
          // Play notification sound
          new Audio('/notification.mp3').play().catch(() => {});
        }
      } else {
        setIsBreak(false);
        setTimeRemaining(settings.focusTime * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining, isBreak, settings]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsBreak(false);
    setTimeRemaining(settings.focusTime * 60);
  };

  const skipBreak = () => {
    setIsBreak(false);
    setTimeRemaining(settings.focusTime * 60);
  };

  const currentTask = {
    title: 'Complete project proposal',
    description: 'Write the executive summary and technical requirements',
    estimatedTime: '2 hours',
    priority: 'high'
  };

  const distractions = [
    { id: 1, name: 'Email notifications', blocked: true },
    { id: 2, name: 'Social media', blocked: true },
    { id: 3, name: 'Phone calls', blocked: false },
    { id: 4, name: 'Slack messages', blocked: true }
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Focus Mode</h1>
            <p className="text-gray-600">Deep work session with AI-powered focus assistance</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl shadow-lg border-2 p-8 text-center ${
                isBreak 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
              }`}
            >
              <div className="mb-6">
                <h2 className={`text-2xl font-bold mb-2 ${
                  isBreak ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </h2>
                <div className={`text-8xl font-bold mb-4 ${
                  isBreak ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
                <p className={`text-lg ${
                  isBreak ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {isBreak ? 'Take a well-deserved break!' : 'Stay focused and productive'}
                </p>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                {!isActive ? (
                  <button
                    onClick={startSession}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-lg transition-colors flex items-center space-x-2"
                  >
                    <Play className="w-6 h-6" />
                    <span>Start Focus</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={pauseSession}
                      className={`px-6 py-3 rounded-xl font-semibold text-lg transition-colors flex items-center space-x-2 ${
                        isPaused 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      }`}
                    >
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>
                    <button
                      onClick={stopSession}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-lg transition-colors flex items-center space-x-2"
                    >
                      <Square className="w-5 h-5" />
                      <span>Stop</span>
                    </button>
                  </>
                )}
              </div>

              {isBreak && (
                <button
                  onClick={skipBreak}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Skip Break
                </button>
              )}

              <div className="text-sm text-gray-600">
                Sessions completed: <span className="font-semibold">{sessionsCompleted}</span>
              </div>
            </motion.div>
          </div>

          {/* Current Task & Distractions */}
          <div className="space-y-6">
            {/* Current Task */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Current Task</h3>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{currentTask.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{currentTask.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated:</span>
                  <span className="font-medium">{currentTask.estimatedTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentTask.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {currentTask.priority}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Distraction Blocker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Focus className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Distraction Blocker</h3>
              </div>
              <div className="space-y-3">
                {distractions.map((distraction) => (
                  <div key={distraction.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{distraction.name}</span>
                    <div className={`w-8 h-4 rounded-full transition-colors ${
                      distraction.blocked ? 'bg-red-500' : 'bg-gray-300'
                    }`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        distraction.blocked ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Focus Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Focus Tips</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Take deep breaths between tasks</p>
                <p>• Keep water nearby to stay hydrated</p>
                <p>• Use the 2-minute rule for quick tasks</p>
                <p>• Set specific goals for this session</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Focus Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Focus Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.focusTime}
                    onChange={(e) => setSettings({...settings, focusTime: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.breakTime}
                    onChange={(e) => setSettings({...settings, breakTime: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Sound Notifications</span>
                  <button
                    onClick={() => setSettings({...settings, soundEnabled: !settings.soundEnabled})}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                  <button
                    onClick={() => setSettings({...settings, darkMode: !settings.darkMode})}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTimeRemaining(settings.focusTime * 60);
                    setShowSettings(false);
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FocusModePage;
