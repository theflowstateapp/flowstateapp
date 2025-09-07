import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test data generation
const generateTestData = () => {
  return {
    stats: {
      tasks: { total: 8, completed: 3 },
      habits: { activeStreaks: 12 },
      projects: { active: 2 }
    },
    todayTasks: [
      { name: 'Complete project proposal', priority: 'High', dueDate: 'Today' },
      { name: 'Review team feedback', priority: 'Medium', dueDate: 'Tomorrow' },
      { name: 'Update documentation', priority: 'Low', dueDate: 'Next week' }
    ],
    nextSuggestion: 'Focus on high-priority tasks first. Consider breaking down the project proposal into smaller, manageable subtasks.',
    habits: [
      { name: 'Daily Exercise', currentStreak: 7, longestStreak: 15, frequency: 'Daily', last7Days: '●●●●●●●' },
      { name: 'Morning Meditation', currentStreak: 12, longestStreak: 25, frequency: 'Daily', last7Days: '●●●●●●●' },
      { name: 'Read Books', currentStreak: 5, longestStreak: 20, frequency: 'Daily', last7Days: '●●●●●○○' }
    ],
    journalEntries: [
      { title: 'Great Progress Today', mood: 'happy', content: 'Made significant progress on the Q4 product launch. The team is really coming together and the AI integration is looking promising.' },
      { title: 'Learning AI Development', mood: 'excited', content: 'Spent the morning learning about machine learning algorithms. It\'s challenging but exciting. The possibilities are endless.' }
    ],
    tasks: [
      { name: 'Complete project proposal', status: 'In Progress', priority: 'High', dueDate: 'Today' },
      { name: 'Review team feedback', status: 'Next', priority: 'Medium', dueDate: 'Tomorrow' },
      { name: 'Update documentation', status: 'Inbox', priority: 'Low', dueDate: 'Next week' },
      { name: 'Prepare presentation slides', status: 'In Progress', priority: 'High', dueDate: 'Friday' },
      { name: 'Call client for follow-up', status: 'Next', priority: 'Medium', dueDate: 'Monday' },
      { name: 'Weekly finance review', status: 'Done', priority: 'Low', dueDate: 'Completed' },
      { name: 'Book eye checkup', status: 'Inbox', priority: 'Low', dueDate: 'Next month' },
      { name: 'Deep work session', status: 'Next', priority: 'High', dueDate: 'This week' }
    ],
    weeklyReview: {
      completed: [
        'Completed weekly finance review',
        'Finished team feedback implementation',
        'Updated project documentation'
      ],
      carryOvers: [
        'Complete project proposal',
        'Prepare presentation slides',
        'Book eye checkup'
      ],
      highlights: [
        'Great team collaboration on Q4 launch',
        'Successful AI integration testing',
        'Improved work-life balance this week'
      ]
    }
  };
};

// Generate static demo HTML
const generateStaticDemoHTML = (data) => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowState Demo - AI-Powered Productivity Platform</title>
    <meta name="description" content="Experience FlowState's AI-powered productivity platform with GTD methodology, task management, habit tracking, and intelligent automation.">
    <meta name="robots" content="index,follow">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="FlowState Demo - AI-Powered Productivity Platform">
    <meta property="og:description" content="Experience FlowState's AI-powered productivity platform with GTD methodology, task management, habit tracking, and intelligent automation.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://theflowstateapp.com/demo/static">
    <meta property="og:image" content="https://theflowstateapp.com/og-image.png">
    <meta property="og:site_name" content="FlowState">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="FlowState Demo - AI-Powered Productivity Platform">
    <meta name="twitter:description" content="Experience FlowState's AI-powered productivity platform with GTD methodology, task management, habit tracking, and intelligent automation.">
    <meta name="twitter:image" content="https://theflowstateapp.com/og-image.png">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            background: #f9fafb;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .banner { 
            background: linear-gradient(135deg, #3B82F6, #8B5CF6); 
            color: white; 
            padding: 15px; 
            text-align: center; 
            margin-bottom: 30px;
            border-radius: 8px;
        }
        .banner a { 
            color: white; 
            text-decoration: none; 
            font-weight: 600; 
            background: rgba(255,255,255,0.2); 
            padding: 8px 16px; 
            border-radius: 6px; 
            display: inline-block;
            margin-top: 10px;
        }
        .banner a:hover { background: rgba(255,255,255,0.3); }
        h1 { color: #1F2937; margin-bottom: 20px; font-size: 2.5rem; }
        h2 { color: #374151; margin: 30px 0 15px 0; font-size: 1.5rem; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; }
        h3 { color: #4B5563; margin: 20px 0 10px 0; font-size: 1.2rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            border: 1px solid #E5E7EB;
        }
        .task-item { 
            padding: 12px; 
            margin: 8px 0; 
            border-left: 4px solid #E5E7EB; 
            background: #F9FAFB; 
            border-radius: 4px;
        }
        .task-item.high { border-left-color: #EF4444; }
        .task-item.medium { border-left-color: #F59E0B; }
        .task-item.low { border-left-color: #10B981; }
        .priority { 
            display: inline-block; 
            padding: 2px 8px; 
            border-radius: 12px; 
            font-size: 0.8rem; 
            font-weight: 600; 
            margin-left: 8px;
        }
        .priority.high { background: #FEE2E2; color: #DC2626; }
        .priority.medium { background: #FEF3C7; color: #D97706; }
        .priority.low { background: #D1FAE5; color: #059669; }
        .status { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 16px; 
            font-size: 0.9rem; 
            font-weight: 500; 
            margin-right: 8px;
        }
        .status.inbox { background: #F3F4F6; color: #374151; }
        .status.next { background: #DBEAFE; color: #1D4ED8; }
        .status.in-progress { background: #FEF3C7; color: #D97706; }
        .status.done { background: #D1FAE5; color: #059669; }
        .habit-streak { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 12px; 
            margin: 8px 0; 
            background: #F0F9FF; 
            border-radius: 6px; 
            border: 1px solid #BAE6FD;
        }
        .streak-number { 
            font-size: 1.5rem; 
            font-weight: bold; 
            color: #0369A1; 
        }
        .journal-entry { 
            padding: 15px; 
            background: #FEF7FF; 
            border-radius: 6px; 
            border: 1px solid #E9D5FF; 
            margin: 10px 0;
        }
        .mood { 
            display: inline-block; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 0.8rem; 
            font-weight: 500; 
            margin-bottom: 8px;
        }
        .mood.happy { background: #D1FAE5; color: #059669; }
        .mood.excited { background: #FEF3C7; color: #D97706; }
        .mood.thoughtful { background: #E0E7FF; color: #3730A3; }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
            gap: 15px; 
            margin: 20px 0;
        }
        .stat { 
            text-align: center; 
            padding: 15px; 
            background: #F8FAFC; 
            border-radius: 6px; 
            border: 1px solid #E2E8F0;
        }
        .stat-number { 
            font-size: 2rem; 
            font-weight: bold; 
            color: #1E40AF; 
        }
        .stat-label { 
            font-size: 0.9rem; 
            color: #64748B; 
            margin-top: 4px;
        }
        .ai-suggestion { 
            background: linear-gradient(135deg, #F0F9FF, #E0F2FE); 
            border: 1px solid #BAE6FD; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 15px 0;
        }
        .ai-suggestion::before { 
            content: "🤖 AI Suggestion: "; 
            font-weight: 600; 
            color: #0369A1; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0; 
            background: white; 
            border-radius: 6px; 
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #E5E7EB; 
        }
        th { 
            background: #F9FAFB; 
            font-weight: 600; 
            color: #374151; 
        }
        .footer { 
            text-align: center; 
            margin-top: 50px; 
            padding: 20px; 
            color: #6B7280; 
            border-top: 1px solid #E5E7EB;
        }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            h1 { font-size: 2rem; }
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="banner">
            <h1>🚀 FlowState Demo</h1>
            <p>AI-Powered Productivity Platform - ${today}</p>
            <a href="/api/demo/access">Open Interactive Demo →</a>
        </div>

        <h2>📊 Dashboard Snapshot</h2>
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${data.stats.tasks.total}</div>
                <div class="stat-label">Total Tasks</div>
            </div>
            <div class="stat">
                <div class="stat-number">${data.stats.tasks.completed}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat">
                <div class="stat-number">${data.stats.habits.activeStreaks}</div>
                <div class="stat-label">Active Streaks</div>
            </div>
            <div class="stat">
                <div class="stat-number">${data.stats.projects.active}</div>
                <div class="stat-label">Active Projects</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>📋 Today's Tasks</h3>
                ${data.todayTasks.map(task => `
                    <div class="task-item ${task.priority.toLowerCase()}">
                        <strong>${task.name}</strong>
                        <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
                        ${task.dueDate ? `<br><small>Due: ${task.dueDate}</small>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="card">
                <h3>🎯 Next Suggested Task</h3>
                <div class="ai-suggestion">
                    ${data.nextSuggestion}
                </div>
            </div>

            <div class="card">
                <h3>🔥 Habit Streaks</h3>
                ${data.habits.map(habit => `
                    <div class="habit-streak">
                        <div>
                            <strong>${habit.name}</strong><br>
                            <small>${habit.frequency}</small>
                        </div>
                        <div class="streak-number">${habit.currentStreak}</div>
                    </div>
                `).join('')}
            </div>

            <div class="card">
                <h3>📝 Today's Journal</h3>
                ${data.journalEntries.map(entry => `
                    <div class="journal-entry">
                        <span class="mood ${entry.mood}">${entry.mood}</span>
                        <h4>${entry.title}</h4>
                        <p>${entry.content}</p>
                    </div>
                `).join('')}
            </div>
        </div>

        <h2>📋 Tasks Overview</h2>
        <div class="grid">
            <div class="card">
                <h3>📝 Task List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.tasks.slice(0, 10).map(task => `
                            <tr>
                                <td><strong>${task.name}</strong></td>
                                <td><span class="status ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
                                <td><span class="priority ${task.priority.toLowerCase()}">${task.priority}</span></td>
                                <td>${task.dueDate || 'No due date'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h3>📊 Board View</h3>
                <div class="grid">
                    <div>
                        <h4>📥 Inbox</h4>
                        ${data.tasks.filter(t => t.status === 'Inbox').slice(0, 3).map(task => `
                            <div class="task-item ${task.priority.toLowerCase()}">
                                <strong>${task.name}</strong>
                                <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h4>⏭️ Next</h4>
                        ${data.tasks.filter(t => t.status === 'Next').slice(0, 3).map(task => `
                            <div class="task-item ${task.priority.toLowerCase()}">
                                <strong>${task.name}</strong>
                                <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h4>🔄 In Progress</h4>
                        ${data.tasks.filter(t => t.status === 'In Progress').slice(0, 3).map(task => `
                            <div class="task-item ${task.priority.toLowerCase()}">
                                <strong>${task.name}</strong>
                                <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h4>✅ Done</h4>
                        ${data.tasks.filter(t => t.status === 'Done').slice(0, 3).map(task => `
                            <div class="task-item ${task.priority.toLowerCase()}">
                                <strong>${task.name}</strong>
                                <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <h2>🔥 Habits & Streaks</h2>
        <div class="card">
            <h3>7-Day Check-ins</h3>
            <table>
                <thead>
                    <tr>
                        <th>Habit</th>
                        <th>Current Streak</th>
                        <th>Longest Streak</th>
                        <th>Frequency</th>
                        <th>Last 7 Days</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.habits.map(habit => `
                        <tr>
                            <td><strong>${habit.name}</strong></td>
                            <td><span class="streak-number">${habit.currentStreak}</span></td>
                            <td>${habit.longestStreak}</td>
                            <td>${habit.frequency}</td>
                            <td>${habit.last7Days}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <h2>📈 Weekly Review Preview</h2>
        <div class="grid">
            <div class="card">
                <h3>✅ Completed This Week</h3>
                <ul>
                    ${data.weeklyReview.completed.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="card">
                <h3>⏳ Carry-overs</h3>
                <ul>
                    ${data.weeklyReview.carryOvers.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="card">
                <h3>🌟 Highlights</h3>
                <ul>
                    ${data.weeklyReview.highlights.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>FlowState - AI-Powered Productivity Platform</p>
            <p>Experience the full interactive demo: <a href="/api/demo/access">Open Demo →</a></p>
        </div>
    </div>
</body>
</html>`;
};

export default async function handler(req, res) {
  try {
    console.log('STATIC_DEMO: Generating static demo page');
    
    // Use test data for consistent testing
    const demoData = generateTestData();
    
    // Generate HTML
    const html = generateStaticDemoHTML(demoData);
    
    // Set headers for static content
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.setHeader('X-Robots-Tag', 'index,follow');
    
    res.status(200).send(html);
    
  } catch (error) {
    console.error('STATIC_DEMO: Error generating static demo:', error);
    res.status(500).send(`
      <html>
        <head><title>FlowState Demo - Error</title></head>
        <body>
          <h1>Demo temporarily unavailable</h1>
          <p>Please try the interactive demo: <a href="/api/demo/access">Open Demo →</a></p>
        </body>
      </html>
    `);
  }
}
