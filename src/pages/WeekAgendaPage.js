import React from 'react';
import WeekAgenda from '../components/agenda/WeekAgenda';
import { ToastProvider } from '../components/ui/ToastProvider';

const WeekAgendaPage = () => {
  return (
    <ToastProvider>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Week Agenda</h1>
          <p className="text-gray-600 mt-2">Your scheduled tasks for the week</p>
        </div>
        
        <WeekAgenda />
      </div>
    </ToastProvider>
  );
};

export default WeekAgendaPage;
