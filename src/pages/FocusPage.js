import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Focus,
  CheckCircle,
  Clock,
  Play,
  Pause,
  Square,
  Target,
  Zap,
  Brain,
  TrendingUp,
  Calendar,
  Timer,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FocusPage = () => {
  const { user } = useAuth();
  const [focusTime, setFocusTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRunning && focusTime > 0) {
      interval = setInterval(() => {
        setFocusTime(time => time - 1);
      }, 1000);
    } else if (focusTime === 0) {
      setIsRunning(false);
      if (!isBreak) {
        setCompletedSessions(sessions => sessions + 1);
        setIsBreak(true);
        setFocusTime(5 * 60); // 5 minute break
      } else {
        setIsBreak(false);
        setFocusTime(25 * 60); // Reset to 25 minutes
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, focusTime, isBreak]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setFocusTime(25 * 60);
  };

  const todayFocusItems = [
    { id: 1, title: 'Complete project proposal', priority: 'high', estimated: '2 hours', completed: false },
    { id: 2, title: 'Review team feedback', priority: 'medium', estimated: '30 mins', completed: true },
    { id: 3, title: 'Prepare presentation slides', priority: 'high', estimated: '1.5 hours', completed: false },
    { id: 4, title: 'Call client for follow-up', priority: 'medium', estimated: '15 mins', completed: false }
  ];

  const nextActions = [
    { id: 1, title: 'Email project status to team', context: 'Computer', energy: 'Low', time: '5 mins' },
    { id: 2, title: 'Research competitor analysis', context: 'Computer', energy: 'High', time: '45 mins' },
    { id: 3, title: 'Schedule team meeting', context: 'Phone', energy: 'Low', time: '10 mins' },
    { id: 4, title: 'Update project documentation', context: 'Computer', energy: 'Medium', time: '30 mins' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Focus</h1>
          <p className="text-gray-600">Stay focused and productive with AI-powered insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pomodoro Timer */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isBreak ? 'Break Time' : 'Focus Time'}
                  </h3>
                  <div className={`text-6xl font-bold mb-4 ${
                    isBreak ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {formatTime(focusTime)}
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                  <button
                    onClick={toggleTimer}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isRunning
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Sessions completed: <span className="font-semibold">{completedSessions}</span></p>
                  <p className="mt-1">
                    {isBreak ? 'Take a well-deserved break!' : 'Stay focused and productive'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Today's Focus Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Today's Focus Items</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span>AI-optimized priorities</span>
                </div>
              </div>

              <div className="space-y-4">
                {todayFocusItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      item.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            item.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {item.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <div>
                          <h4 className={`font-medium ${
                            item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                          }`}>
                            {item.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.priority}
                            </span>
                            <span>{item.estimated}</span>
                          </div>
                        </div>
                      </div>
                      {!item.completed && (
                        <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                          Start
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Next Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Next Actions</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Brain className="w-4 h-4" />
              <span>AI-suggested actions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <span className="text-sm text-gray-600">{action.time}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>{action.context}</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    action.energy === 'High' ? 'bg-green-100 text-green-700' :
                    action.energy === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {action.energy} Energy
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">Focus Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">4.2h</div>
              <div className="text-sm text-gray-600">Deep Work Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FocusPage;
