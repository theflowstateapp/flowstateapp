import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Sparkles, CheckCircle, Clock, AlertCircle, Target, TrendingUp
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const DailyBriefing = () => {
  const { user } = useAuth();
  const { tasks, projects, goals, habits, areas } = useData();
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [briefingData, setBriefingData] = useState({});
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Calculate briefing data
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const completedToday = tasks.filter(task => 
      task.status === 'completed' && 
      new Date(task.updatedAt).toDateString() === today.toDateString()
    ).length;

    const overdueTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate) < today && task.status !== 'completed'
    ).length;

    const todayTasks = tasks.filter(task => 
      task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString() && task.status !== 'completed'
    ).length;

    const activeProjects = projects.filter(project => project.status === 'active').length;
    const habitStreaks = habits.filter(habit => habit.streak >= 7).length;

    setBriefingData({
      completedToday,
      overdueTasks,
      todayTasks,
      activeProjects,
      habitStreaks
    });

    // Simulate typing effect
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [tasks, projects, goals, habits]);

  const generateBriefingMessage = () => {
    const { completedToday, overdueTasks, todayTasks, activeProjects, habitStreaks } = briefingData;
    
    let message = `Good ${timeOfDay}, ${user?.firstName || 'there'}! `;
    
    if (completedToday > 0) {
      message += `Great work completing ${completedToday} task${completedToday > 1 ? 's' : ''} today. `;
    }
    
    if (overdueTasks > 0) {
      message += `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''} that need attention. `;
    }
    
    if (todayTasks > 0) {
      message += `You have ${todayTasks} task${todayTasks > 1 ? 's' : ''} due today. `;
    }
    
    if (activeProjects > 0) {
      message += `You're actively working on ${activeProjects} project${activeProjects > 1 ? 's' : ''}. `;
    }
    
    if (habitStreaks > 0) {
      message += `Impressive! You have ${habitStreaks} habit streak${habitStreaks > 1 ? 's' : ''} going strong. `;
    }
    
    message += `Let's make today productive!`;
    
    return message;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      {/* AI Assistant Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Daily Briefing</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">AI Assistant</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* AI Message */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed">
              {isTyping ? (
                <span className="inline-flex items-center">
                  <span className="animate-pulse">Generating your briefing...</span>
                </span>
              ) : (
                generateBriefingMessage()
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/tasks')}
          className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-blue-600 mb-1">{briefingData.completedToday || 0}</div>
          <div className="text-xs text-gray-600">Completed Today</div>
        </button>
        
        <button
          onClick={() => navigate('/tasks')}
          className="text-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-orange-600 mb-1">{briefingData.todayTasks || 0}</div>
          <div className="text-xs text-gray-600">Due Today</div>
        </button>
        
        <button
          onClick={() => navigate('/tasks')}
          className="text-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-red-600 mb-1">{briefingData.overdueTasks || 0}</div>
          <div className="text-xs text-gray-600">Overdue</div>
        </button>
        
        <button
          onClick={() => navigate('/habits')}
          className="text-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-green-600 mb-1">{briefingData.habitStreaks || 0}</div>
          <div className="text-xs text-gray-600">Active Streaks</div>
        </button>
      </div>
    </motion.div>
  );
};

export default DailyBriefing;