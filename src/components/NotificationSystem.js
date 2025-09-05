import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, CheckCircle, AlertCircle, Clock, Calendar, Target,
  TrendingUp, Lightbulb, Star, Zap, Heart, DollarSign, BookOpen,
  Users, Settings, ArrowRight, Filter, Search, MoreHorizontal
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const { tasks, projects, goals, habits } = useData();

  // Generate smart notifications based on data
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications = [];

      // Overdue tasks
      const overdueTasks = tasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
      );
      overdueTasks.forEach(task => {
        newNotifications.push({
          id: `overdue-${task.id}`,
          type: 'urgent',
          icon: AlertCircle,
          title: 'Overdue Task',
          message: `"${task.title}" was due ${new Date(task.dueDate).toLocaleDateString()}`,
          action: 'Complete Task',
          timestamp: new Date(),
          priority: 'high'
        });
      });

      // Tasks due today
      const todayTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        return dueDate.toDateString() === today.toDateString() && task.status !== 'completed';
      });
      todayTasks.forEach(task => {
        newNotifications.push({
          id: `today-${task.id}`,
          type: 'reminder',
          icon: Clock,
          title: 'Due Today',
          message: `"${task.title}" is due today`,
          action: 'View Task',
          timestamp: new Date(),
          priority: 'medium'
        });
      });

      // Upcoming deadlines (next 3 days)
      const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 3 && task.status !== 'completed';
      });
      upcomingTasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        newNotifications.push({
          id: `upcoming-${task.id}`,
          type: 'reminder',
          icon: Calendar,
          title: 'Upcoming Deadline',
          message: `"${task.title}" due in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
          action: 'View Task',
          timestamp: new Date(),
          priority: 'medium'
        });
      });

      // Project milestones
      const activeProjects = projects.filter(project => project.status === 'active');
      activeProjects.forEach(project => {
        if (project.deadline) {
          const deadline = new Date(project.deadline);
          const today = new Date();
          const diffTime = deadline.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7 && diffDays > 0) {
            newNotifications.push({
              id: `project-${project.id}`,
              type: 'milestone',
              icon: Target,
              title: 'Project Milestone',
              message: `"${project.title}" deadline in ${diffDays} day${diffDays > 1 ? 's' : ''}`,
              action: 'View Project',
              timestamp: new Date(),
              priority: 'medium'
            });
          }
        }
      });

      // Habit streaks
      const activeHabits = habits.filter(habit => habit.status === 'active');
      activeHabits.forEach(habit => {
        if (habit.streak && habit.streak >= 7) {
          newNotifications.push({
            id: `streak-${habit.id}`,
            type: 'achievement',
            icon: Star,
            title: 'Habit Streak',
            message: `Great job! "${habit.name}" streak: ${habit.streak} days`,
            action: 'Keep Going',
            timestamp: new Date(),
            priority: 'low'
          });
        }
      });

      // Productivity tips
      const tips = [
        {
          id: 'tip-1',
          type: 'tip',
          icon: Lightbulb,
          title: 'Productivity Tip',
          message: 'Try the Pomodoro Technique: 25 minutes focused work, 5 minutes break',
          action: 'Learn More',
          timestamp: new Date(),
          priority: 'low'
        },
        {
          id: 'tip-2',
          type: 'tip',
          icon: Zap,
          title: 'Quick Win',
          message: 'Complete 3 small tasks to build momentum for bigger projects',
          action: 'Get Started',
          timestamp: new Date(),
          priority: 'low'
        }
      ];

      // Add tips occasionally
      if (Math.random() > 0.7) {
        newNotifications.push(tips[Math.floor(Math.random() * tips.length)]);
      }

      // Weekly review reminder
      const today = new Date();
      if (today.getDay() === 0) { // Sunday
        newNotifications.push({
          id: 'weekly-review',
          type: 'reminder',
          icon: TrendingUp,
          title: 'Weekly Review',
          message: 'Time for your weekly review! Reflect on progress and plan ahead',
          action: 'Start Review',
          timestamp: new Date(),
          priority: 'medium'
        });
      }

      // Sort by priority and timestamp
      newNotifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.timestamp - a.timestamp;
      });

      setNotifications(newNotifications);
    };

    generateNotifications();
    const interval = setInterval(generateNotifications, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [tasks, projects, goals, habits]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      urgent: AlertCircle,
      reminder: Clock,
      milestone: Target,
      achievement: Star,
      tip: Lightbulb
    };
    return iconMap[type] || Bell;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (priority === 'medium') return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        data-testid="notification-bell"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50"
                  >
                    <option value="all">All</option>
                    <option value="urgent">Urgent</option>
                    <option value="reminder">Reminders</option>
                    <option value="milestone">Milestones</option>
                    <option value="achievement">Achievements</option>
                    <option value="tip">Tips</option>
                  </select>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type, notification.priority);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 mb-2 rounded-lg border ${colorClass} hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <span className="text-xs text-gray-500">
                                {notification.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2 flex items-center space-x-1">
                              <span>{notification.action}</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
