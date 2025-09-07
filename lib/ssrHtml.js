// HTML escaping utility
export const escapeHtml = (s) => {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Format day time range
export const fmtDayTimeRange = (start, end, tz = 'Asia/Kolkata') => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const dayName = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: tz
  });
  
  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz
  });
  
  const endTime = endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz
  });
  
  return `${dayName}, ${startTime}–${endTime}`;
};

// Format due chip
export const fmtDueChip = (task) => {
  if (!task.do_date) return '';
  
  const dueDate = new Date(task.do_date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dueDateStr = dueDate.toDateString();
  const todayStr = today.toDateString();
  const tomorrowStr = tomorrow.toDateString();
  
  if (dueDateStr === todayStr) {
    if (dueDate.getHours() !== 0 || dueDate.getMinutes() !== 0) {
      return `due ${dueDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      })}`;
    }
    return 'Today';
  } else if (dueDateStr === tomorrowStr) {
    return 'Tomorrow';
  } else {
    return dueDate.toLocaleDateString('en-US', { 
      weekday: 'short',
      timeZone: 'Asia/Kolkata'
    });
  }
};

// Shared CSS styles
export const getSharedCSS = () => `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
    margin: 0; 
    padding: 0; 
    background-color: #f8fafc; 
    color: #334155; 
    line-height: 1.6; 
  }
  .container { 
    max-width: 960px; 
    margin: 0 auto; 
    padding: 20px; 
    background-color: #ffffff; 
    border-radius: 8px; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  }
  header { 
    background-color: #1f2937; 
    color: white; 
    padding: 15px 20px; 
    margin-bottom: 20px; 
    border-radius: 8px; 
  }
  header a { 
    color: #60a5fa; 
    text-decoration: none; 
    margin: 0 8px; 
  }
  header a:hover { 
    text-decoration: underline; 
  }
  h1 { 
    color: #1F2937; 
    margin-bottom: 20px; 
    font-size: 2.5rem; 
  }
  h2 { 
    color: #1F2937; 
    margin-top: 30px; 
    margin-bottom: 15px; 
    font-size: 2rem; 
    border-bottom: 1px solid #e2e8f0; 
    padding-bottom: 10px; 
  }
  h3 { 
    color: #1F2937; 
    margin-top: 20px; 
    margin-bottom: 10px; 
    font-size: 1.5rem; 
  }
  .grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
    gap: 20px; 
    margin-bottom: 30px; 
  }
  .card { 
    background-color: #f8fafc; 
    border: 1px solid #e2e8f0; 
    border-radius: 8px; 
    padding: 20px; 
  }
  .stat-grid { 
    display: flex; 
    justify-content: space-around; 
    text-align: center; 
    margin-bottom: 20px; 
  }
  .stat-item { 
    flex: 1; 
    padding: 10px; 
    border-right: 1px solid #e2e8f0; 
  }
  .stat-item:last-child { 
    border-right: none; 
  }
  .stat-number { 
    font-size: 2.2rem; 
    font-weight: 700; 
    color: #10B981; 
  }
  .stat-label { 
    font-size: 0.9rem; 
    color: #64748b; 
  }
  .task-item { 
    border-left: 4px solid; 
    padding-left: 10px; 
    margin-bottom: 10px; 
  }
  .task-item strong { 
    display: block; 
  }
  .task-item small { 
    color: #64748b; 
  }
  .task-item.high { 
    border-left-color: #EF4444; 
  }
  .task-item.medium { 
    border-left-color: #F59E0B; 
  }
  .task-item.low { 
    border-left-color: #10B981; 
  }
  .priority { 
    display: inline-block; 
    padding: 2px 8px; 
    border-radius: 4px; 
    font-size: 0.75rem; 
    font-weight: 600; 
    margin-left: 8px; 
  }
  .priority.urgent { 
    background-color: #fee2e2; 
    color: #EF4444; 
  }
  .priority.high { 
    background-color: #fef3c7; 
    color: #F59E0B; 
  }
  .priority.medium { 
    background-color: #dbeafe; 
    color: #3B82F6; 
  }
  .priority.low { 
    background-color: #d1fae5; 
    color: #10B981; 
  }
  .time-chip { 
    background-color: #DBEAFE; 
    color: #1E40AF; 
    padding: 2px 8px; 
    border-radius: 12px; 
    font-size: 0.75rem; 
    font-weight: 600; 
    font-family: monospace; 
    margin-left: 8px; 
  }
  .context-chip { 
    background-color: #F3E8FF; 
    color: #7C3AED; 
    padding: 2px 8px; 
    border-radius: 12px; 
    font-size: 0.75rem; 
    font-weight: 600; 
    margin-left: 8px; 
  }
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 15px; 
  }
  th, td { 
    border: 1px solid #e2e8f0; 
    padding: 10px; 
    text-align: left; 
  }
  th { 
    background-color: #f1f5f9; 
    font-weight: 600; 
    color: #475569; 
  }
  .habit-streak { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 10px; 
    padding: 8px 0; 
    border-bottom: 1px dashed #e2e8f0; 
  }
  .habit-streak:last-child { 
    border-bottom: none; 
  }
  .habit-pattern { 
    font-family: monospace; 
    font-size: 1.1rem; 
    margin-top: 5px; 
  }
  .streak-number { 
    font-size: 1.5rem; 
    font-weight: 700; 
    color: #0284c7; 
  }
  .cta-button { 
    background-color: #0284c7; 
    color: white; 
    padding: 12px 25px; 
    border-radius: 6px; 
    text-decoration: none; 
    font-weight: 600; 
    display: inline-block; 
    margin: 10px 5px; 
  }
  .cta-button:hover { 
    background-color: #0369a1; 
  }
  .cta-secondary { 
    background-color: #e0f2fe; 
    color: #0284c7; 
    border: 1px solid #0284c7; 
  }
  .cta-secondary:hover { 
    background-color: #0284c7; 
    color: white; 
  }
  footer { 
    text-align: center; 
    margin-top: 50px; 
    padding: 20px; 
    color: #6B7280; 
    border-top: 1px solid #E5E7EB; 
  }
  .nav-links { 
    margin: 10px 0; 
  }
  .nav-links a { 
    margin: 0 10px; 
  }
  @media (max-width: 768px) {
    .container { padding: 10px; }
    h1 { font-size: 2rem; }
    .grid { grid-template-columns: 1fr; }
    .stat-grid { flex-direction: column; }
    .stat-item { border-right: none; border-bottom: 1px solid #e2e8f0; }
  }
`;
