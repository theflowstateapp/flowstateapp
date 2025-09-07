import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { WeekAgendaProps } from '../../types/capture';

interface ScheduledTask {
  id: string;
  title: string;
  priority: string;
  context?: string;
  startAt: string;
  endAt: string;
  projectName?: string;
  areaName?: string;
}

interface DaySchedule {
  date: string;
  dayName: string;
  tasks: ScheduledTask[];
}

const WeekAgenda: React.FC<WeekAgendaProps> = ({ weekOffset = 0 }) => {
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(weekOffset);

  useEffect(() => {
    loadWeekSchedule();
  }, [currentWeekOffset]);

  const loadWeekSchedule = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/agenda/week?offset=${currentWeekOffset}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setWeekSchedule(result.schedule || []);
      }
    } catch (error) {
      console.error('Error loading week schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeekTitle = () => {
    if (weekSchedule.length === 0) return 'Week Agenda';
    
    const firstDay = weekSchedule[0];
    const lastDay = weekSchedule[weekSchedule.length - 1];
    
    if (firstDay && lastDay) {
      const startDate = new Date(firstDay.date);
      const endDate = new Date(lastDay.date);
      
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    
    return 'Week Agenda';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-400 animate-pulse" />
          <span className="text-gray-500">Loading week agenda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="space-y-4">
        {/* Header with navigation */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{getWeekTitle()}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 7)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              This week
            </button>
            <button
              onClick={() => setCurrentWeekOffset(7)}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Next week
            </button>
            <button
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 7)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">Priority:</span>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">URGENT</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">HIGH</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">MEDIUM</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">LOW</span>
          </div>
        </div>

        {/* Week schedule */}
        <div className="space-y-3">
          {weekSchedule.map((day) => (
            <div key={day.date} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{day.dayName}</h4>
                <span className="text-sm text-gray-500">{formatDate(day.date)}</span>
              </div>
              
              {day.tasks.length > 0 ? (
                <div className="space-y-2">
                  {day.tasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
                      <div className="text-sm font-mono text-gray-600 min-w-[80px]">
                        {formatTime(task.startAt)}–{formatTime(task.endAt)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 truncate">{task.title}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        {(task.projectName || task.areaName) && (
                          <div className="text-sm text-gray-500">
                            {task.projectName || task.areaName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  —
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekAgenda;
