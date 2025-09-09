// IST Helper Functions for Daily Shutdown
// Reuses existing IST utilities and adds new ones for daily planning

const { getISTNow, getISTDay, getISTTomorrowDay } = require('./time-ist');

// Additional IST helpers for daily shutdown
const getISTToday = () => {
  return getISTDay(new Date());
};

const getISTTomorrow = () => {
  return getISTTomorrowDay(new Date());
};

const isShutdownTime = () => {
  const now = getISTNow();
  const hour = now.getHours();
  return hour >= 18 && hour <= 23;
};

const formatISTTime = (date) => {
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const formatISTDate = (date) => {
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

const getMorningWindow = (date) => {
  const morningStart = new Date(date);
  morningStart.setHours(9, 30, 0, 0);
  
  const morningEnd = new Date(date);
  morningEnd.setHours(12, 30, 0, 0);
  
  return {
    start: morningStart,
    end: morningEnd
  };
};

const getBalancedWindow = (date) => {
  const dayStart = new Date(date);
  dayStart.setHours(9, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(17, 0, 0, 0);
  
  return {
    start: dayStart,
    end: dayEnd
  };
};

module.exports = {
  getISTNow,
  getISTDay,
  getISTTomorrowDay,
  getISTToday,
  getISTTomorrow,
  isShutdownTime,
  formatISTTime,
  formatISTDate,
  getMorningWindow,
  getBalancedWindow
};
