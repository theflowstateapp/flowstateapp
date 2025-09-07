import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const TodayTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTodayTasks();
  }, []);

  const loadTodayTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks/today', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setTasks(result.tasks || []);
      }
    } catch (error) {
      console.error('Error loading today tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'LOW':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getContextColor = (context) => {
    switch (context) {
      case 'Deep Work':
        return 'bg-purple-100 text-purple-800';
      case 'Admin':
        return 'bg-gray-100 text-gray-800';
      case 'Errand':
        return 'bg-green-100 text-green-800';
      case 'Call':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-400 animate-pulse" />
          <span className="text-gray-500">Loading today's tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Today</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{tasks.length} tasks</span>
          </div>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-mono">
                      {task.timeWindow}
                    </span>
                    {task.context && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContextColor(task.context)}`}>
                        {task.context}
                      </span>
                    )}
                    {(task.projectName || task.areaName) && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {task.projectName || task.areaName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No tasks for today</p>
            <p className="text-sm">Great job! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayTasks;
