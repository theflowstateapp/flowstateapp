import React, { useState } from 'react';
import NextSuggestedCard from '../components/dashboard/NextSuggestedCard.js';
import TodayTasks from '../components/dashboard/TodayTasks.js';
import CaptureBox from '../components/capture/CaptureBox.js';
import WeekAgenda from '../components/agenda/WeekAgenda.js';
import { ToastProvider } from '../components/ui/ToastProvider.js';

const Dashboard = () => {
  const [showCapture, setShowCapture] = useState(false);

  return (
    <ToastProvider>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setShowCapture(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>+</span>
            <span>Capture Task</span>
          </button>
        </div>

        {/* Next Suggested Task Card */}
        <NextSuggestedCard onCaptureOpen={() => setShowCapture(true)} />

        {/* Today Tasks */}
        <TodayTasks />

        {/* Capture Box */}
        {showCapture && (
          <div className="space-y-4">
            <CaptureBox />
            <button
              onClick={() => setShowCapture(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Week Agenda */}
        <WeekAgenda />

        {/* Existing dashboard content can go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tasks Today</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scheduled</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Completed "Review project proposal"</div>
              <div>• Scheduled "Team meeting" for 2:00 PM</div>
              <div>• Created "Update documentation"</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Habit Streaks</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Exercise</span>
                <span className="font-medium text-green-600">7 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Morning Meditation</span>
                <span className="font-medium text-green-600">12 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default Dashboard;
