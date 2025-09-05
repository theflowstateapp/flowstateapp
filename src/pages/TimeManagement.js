import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Play,
  Pause,
  StopCircle,
  Plus,
  TrendingUp,
  Target,
  Zap,
  Coffee,
  BookOpen,
  Dumbbell,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Star,
  Timer,
  CalendarDays,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const TimeManagement = () => {
  const [timeData, setTimeData] = useState({
    todayHours: 6.5,
    weeklyHours: 42.3,
    monthlyHours: 168.7,
    productivityScore: 87,
    focusTime: 4.2,
    breakTime: 1.8,
    meetings: 2.1,
    deepWork: 3.4,
    tasks: [
      {
        id: 1,
        title: 'Project Planning',
        category: 'Work',
        duration: 120,
        completed: true,
        priority: 'high',
        startTime: '09:00',
        endTime: '11:00'
      },
      {
        id: 2,
        title: 'Client Meeting',
        category: 'Meeting',
        duration: 60,
        completed: true,
        priority: 'high',
        startTime: '11:30',
        endTime: '12:30'
      },
      {
        id: 3,
        title: 'Code Review',
        category: 'Work',
        duration: 90,
        completed: false,
        priority: 'medium',
        startTime: '14:00',
        endTime: '15:30'
      },
      {
        id: 4,
        title: 'Learning Session',
        category: 'Learning',
        duration: 60,
        completed: false,
        priority: 'medium',
        startTime: '16:00',
        endTime: '17:00'
      }
    ],
    timeBlocks: [
      { id: 1, name: 'Deep Work', hours: 4, color: 'bg-primary-500' },
      { id: 2, name: 'Meetings', hours: 2, color: 'bg-warning-500' },
      { id: 3, name: 'Breaks', hours: 1.5, color: 'bg-success-500' },
      { id: 4, name: 'Planning', hours: 1, color: 'bg-danger-500' }
    ],
    productivityTrends: [
      { day: 'Mon', hours: 8.2, score: 92 },
      { day: 'Tue', hours: 7.8, score: 88 },
      { day: 'Wed', hours: 8.5, score: 95 },
      { day: 'Thu', hours: 7.2, score: 85 },
      { day: 'Fri', hours: 6.8, score: 82 },
      { day: 'Sat', hours: 4.1, score: 78 },
      { day: 'Sun', hours: 2.5, score: 75 }
    ]
  });

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddTimeBlock, setShowAddTimeBlock] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Work',
    duration: 60,
    priority: 'medium',
    startTime: '09:00',
    endTime: '10:00'
  });

  const [newTimeBlock, setNewTimeBlock] = useState({
    name: '',
    hours: 1,
    color: 'bg-primary-500'
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) {
      toast.error('Please enter a task title');
      return;
    }

    const task = {
      id: Date.now(),
      ...newTask,
      completed: false
    };

    setTimeData({
      ...timeData,
      tasks: [...timeData.tasks, task]
    });

    setNewTask({
      title: '',
      category: 'Work',
      duration: 60,
      priority: 'medium',
      startTime: '09:00',
      endTime: '10:00'
    });
    setShowAddTask(false);
    toast.success('Task added successfully!');
  };

  const handleAddTimeBlock = (e) => {
    e.preventDefault();
    if (!newTimeBlock.name) {
      toast.error('Please enter a time block name');
      return;
    }

    const timeBlock = {
      id: Date.now(),
      ...newTimeBlock
    };

    setTimeData({
      ...timeData,
      timeBlocks: [...timeData.timeBlocks, timeBlock]
    });

    setNewTimeBlock({
      name: '',
      hours: 1,
      color: 'bg-primary-500'
    });
    setShowAddTimeBlock(false);
    toast.success('Time block added successfully!');
  };

  const handleToggleTask = (taskId) => {
    setTimeData({
      ...timeData,
      tasks: timeData.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    });
  };

  const handleStartTimer = (task) => {
    setCurrentTask(task);
    setIsTimerRunning(true);
    toast.success(`Started timer for: ${task.title}`);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setCurrentTask(null);
    toast.success('Timer stopped');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work': return 'bg-primary-100 text-primary-700';
      case 'Meeting': return 'bg-warning-100 text-warning-700';
      case 'Learning': return 'bg-success-100 text-success-700';
      case 'Break': return 'bg-danger-100 text-danger-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-700';
      case 'medium': return 'bg-warning-100 text-warning-700';
      case 'low': return 'bg-success-100 text-success-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Work': return <Target size={16} />;
      case 'Meeting': return <Calendar size={16} />;
      case 'Learning': return <BookOpen size={16} />;
      case 'Break': return <Coffee size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredTasks = timeData.tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    if (filter === 'work') return task.category === 'Work';
    if (filter === 'meeting') return task.category === 'Meeting';
    return true;
  });

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle, unit }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {change && (
          <div className="flex items-center space-x-1">
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-success-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-danger-600" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}{unit}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  const TaskCard = ({ task }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            {task.priority === 'high' && <Star size={16} className="text-danger-500 fill-current" />}
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{task.duration} min</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Time Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Start Time</span>
          <span className="text-gray-900">{task.startTime}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">End Time</span>
          <span className="text-gray-900">{task.endTime}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleToggleTask(task.id)}
            className={`flex items-center space-x-2 text-sm font-medium ${
              task.completed ? 'text-success-600' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {task.completed ? (
              <CheckCircle size={16} className="text-success-600" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded" />
            )}
            <span>{task.completed ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {currentTask?.id === task.id && isTimerRunning ? (
            <button
              onClick={handleStopTimer}
              className="p-2 text-danger-600 hover:text-danger-700"
            >
              <StopCircle size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleStartTimer(task)}
              className="p-2 text-primary-600 hover:text-primary-700"
            >
              <Play size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Management</h1>
          <p className="text-gray-600 mt-1">Optimize your time and boost productivity</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddTimeBlock(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Time Block</span>
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Hours"
          value={timeData.todayHours}
          change={5.2}
          icon={Clock}
          color="bg-primary-500"
          subtitle="Productive time"
          unit="h"
        />
        <MetricCard
          title="Weekly Hours"
          value={timeData.weeklyHours}
          change={12.8}
          icon={CalendarDays}
          color="bg-success-500"
          subtitle="This week"
          unit="h"
        />
        <MetricCard
          title="Productivity Score"
          value={timeData.productivityScore}
          change={8.5}
          icon={TrendingUp}
          color="bg-warning-500"
          subtitle="vs last week"
          unit="%"
        />
        <MetricCard
          title="Deep Work"
          value={timeData.deepWork}
          change={15.3}
          icon={Zap}
          color="bg-danger-500"
          subtitle="Focused time"
          unit="h"
        />
      </div>

      {/* Current Timer */}
      {isTimerRunning && currentTask && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Timer</h2>
              <p className="text-gray-600 mt-1">{currentTask.title}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">25:30</div>
                <div className="text-sm text-gray-500">minutes remaining</div>
              </div>
              <button
                onClick={handleStopTimer}
                className="btn-secondary flex items-center space-x-2"
              >
                <StopCircle size={20} />
                <span>Stop Timer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Time Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeData.timeBlocks.map((block) => (
            <div key={block.id} className="text-center">
              <div className={`w-16 h-16 rounded-full ${block.color} mx-auto mb-3 flex items-center justify-center`}>
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{block.name}</h3>
              <p className="text-2xl font-bold text-gray-900">{block.hours}h</p>
              <p className="text-sm text-gray-500">
                {((block.hours / timeData.todayHours) * 100).toFixed(1)}% of day
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="work">Work</option>
              <option value="meeting">Meetings</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Productivity Trends */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Productivity Trends</h2>
        <div className="grid grid-cols-7 gap-4">
          {timeData.productivityTrends.map((day) => (
            <div key={day.day} className="text-center">
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-600">{day.day}</div>
                <div className="text-lg font-bold text-gray-900">{day.hours}h</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${day.score}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{day.score}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Work">Work</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Learning">Learning</option>
                    <option value="Break">Break</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={newTask.duration}
                    onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                    className="input-field"
                    min="15"
                    step="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newTask.endTime}
                    onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Time Block Modal */}
      {showAddTimeBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Time Block</h2>
            <form onSubmit={handleAddTimeBlock} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Block Name</label>
                <input
                  type="text"
                  value={newTimeBlock.name}
                  onChange={(e) => setNewTimeBlock({ ...newTimeBlock, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Deep Work, Meetings"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                  <input
                    type="number"
                    value={newTimeBlock.hours}
                    onChange={(e) => setNewTimeBlock({ ...newTimeBlock, hours: parseFloat(e.target.value) })}
                    className="input-field"
                    min="0.5"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    value={newTimeBlock.color}
                    onChange={(e) => setNewTimeBlock({ ...newTimeBlock, color: e.target.value })}
                    className="input-field"
                  >
                    <option value="bg-primary-500">Blue</option>
                    <option value="bg-success-500">Green</option>
                    <option value="bg-warning-500">Yellow</option>
                    <option value="bg-danger-500">Red</option>
                    <option value="bg-purple-500">Purple</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary flex-1">
                  Add Time Block
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTimeBlock(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeManagement;
