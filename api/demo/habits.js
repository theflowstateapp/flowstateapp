import DemoLayout from '../../lib/DemoLayout.js';
import { escapeHtml } from '../../lib/ssrHtml.js';
import { getDemoWorkspace } from '../../lib/demoData.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { withDbRetry } from '../../lib/retry.js';

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Get demo workspace
    const workspace = await getDemoWorkspace();
    if (!workspace) {
      const html = DemoLayout({
        children: `
          <div style="text-align: center; padding: 40px;">
            <h1>Demo Temporarily Unavailable</h1>
            <p>No demo workspace found. Please try the interactive demo:</p>
            <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          </div>
        `,
        title: 'Habits Demo',
        description: 'FlowState habits demo - temporarily unavailable'
      });
      return res.status(200).send(html);
    }

    // Fetch habits data
    const sb = supabaseAdmin();
    const { data: habits } = await withDbRetry(async () => {
      const result = await sb
        .from('habits')
        .select('id, name, target_per_week, color')
        .eq('workspace_id', workspace.id)
        .limit(5);
      
      if (result.error) throw result.error;
      return result.data;
    });

    // Generate 90-day heatmap data (last 90 days)
    const generateHeatmapData = () => {
      const data = [];
      const today = new Date();
      
      for (let i = 89; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Simulate some completed days (70% completion rate)
        const isCompleted = Math.random() > 0.3;
        
        data.push({
          date: date.toISOString().split('T')[0],
          completed: isCompleted,
          dayOfWeek: date.getDay(), // 0 = Sunday, 1 = Monday, etc.
          weekNumber: Math.floor(i / 7)
        });
      }
      
      return data;
    };

    const heatmapData = generateHeatmapData();
    
    // Group by weeks (13 weeks = 91 days, we'll use 13 weeks)
    const weeks = [];
    for (let week = 0; week < 13; week++) {
      const weekData = heatmapData.filter(d => d.weekNumber === week);
      weeks.push(weekData);
    }

    const children = `
      <h1>Habits (Read-only Demo)</h1>
      <p>Track your daily habits with visual progress and intelligent insights.</p>

      <h2>🔥 Daily Exercise</h2>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">90-Day Heatmap</h3>
          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 8px 12px;">
            <strong>This week: 4/5</strong>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(13, 1fr); gap: 2px; margin-bottom: 10px;">
          ${weeks.map(week => `
            <div style="display: grid; grid-template-rows: repeat(7, 1fr); gap: 1px;">
              ${week.map(day => `
                <div style="
                  width: 12px; 
                  height: 12px; 
                  background-color: ${day.completed ? '#10B981' : '#e2e8f0'}; 
                  border-radius: 2px;
                  cursor: pointer;
                " title="${day.date} - ${day.completed ? 'Completed' : 'Not completed'}"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #64748b;">
          <span>Less</span>
          <div style="display: flex; gap: 2px;">
            <div style="width: 12px; height: 12px; background-color: #e2e8f0; border-radius: 2px;"></div>
            <div style="width: 12px; height: 12px; background-color: #10B981; border-radius: 2px;"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <h2>🧘 Morning Meditation</h2>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">90-Day Heatmap</h3>
          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 8px 12px;">
            <strong>This week: 3/3</strong>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(13, 1fr); gap: 2px; margin-bottom: 10px;">
          ${weeks.map(week => `
            <div style="display: grid; grid-template-rows: repeat(7, 1fr); gap: 1px;">
              ${week.map(day => `
                <div style="
                  width: 12px; 
                  height: 12px; 
                  background-color: ${day.completed ? '#7c3aed' : '#e2e8f0'}; 
                  border-radius: 2px;
                  cursor: pointer;
                " title="${day.date} - ${day.completed ? 'Completed' : 'Not completed'}"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #64748b;">
          <span>Less</span>
          <div style="display: flex; gap: 2px;">
            <div style="width: 12px; height: 12px; background-color: #e2e8f0; border-radius: 2px;"></div>
            <div style="width: 12px; height: 12px; background-color: #7c3aed; border-radius: 2px;"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <h2>📚 Read Books</h2>
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">90-Day Heatmap</h3>
          <div style="background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 6px; padding: 8px 12px;">
            <strong>This week: 2/4</strong>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(13, 1fr); gap: 2px; margin-bottom: 10px;">
          ${weeks.map(week => `
            <div style="display: grid; grid-template-rows: repeat(7, 1fr); gap: 1px;">
              ${week.map(day => `
                <div style="
                  width: 12px; 
                  height: 12px; 
                  background-color: ${day.completed ? '#f59e0b' : '#e2e8f0'}; 
                  border-radius: 2px;
                  cursor: pointer;
                " title="${day.date} - ${day.completed ? 'Completed' : 'Not completed'}"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #64748b;">
          <span>Less</span>
          <div style="display: flex; gap: 2px;">
            <div style="width: 12px; height: 12px; background-color: #e2e8f0; border-radius: 2px;"></div>
            <div style="width: 12px; height: 12px; background-color: #f59e0b; border-radius: 2px;"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <h2>📊 Habit Insights</h2>
      <div class="card">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h3 style="margin-top: 0;">Weekly Performance</h3>
          <ul style="margin-bottom: 15px;">
            <li><strong>Daily Exercise:</strong> 4/5 days this week (80% completion)</li>
            <li><strong>Morning Meditation:</strong> 3/3 days this week (100% completion)</li>
            <li><strong>Read Books:</strong> 2/4 days this week (50% completion)</li>
          </ul>
          <p style="font-style: italic; color: #475569; margin-bottom: 0;">
            "Your meditation habit is performing excellently! Consider increasing the reading target or adjusting the timing."
          </p>
        </div>
      </div>

      <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Note:</strong> Interactive heatmaps with hover tooltips, habit editing, and streak tracking available in the live app.</p>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="/api/demo/access?utm_source=demo-habits" class="cta-button">Open Interactive Demo</a>
        <a href="/demo" class="cta-button cta-secondary">Back to Overview</a>
      </div>
    `;

    const html = DemoLayout({
      children,
      title: 'Habits Demo',
      description: 'FlowState habits tracking with 90-day heatmaps and weekly targets'
    });

    res.status(200).send(html);

  } catch (error) {
    console.error('DEMO_HABITS: Error generating habits page:', error);
    
    // Robust HTML fallback
    const fallbackHtml = DemoLayout({
      children: `
        <div style="text-align: center; padding: 40px;">
          <h1>Demo Temporarily Unavailable</h1>
          <p>We're experiencing technical difficulties. Please try the interactive demo:</p>
          <a href="/api/demo/access" class="cta-button">Open Interactive Demo →</a>
          <p style="margin-top: 20px; color: #64748b; font-size: 0.9rem;">
            Error: ${escapeHtml(String(error?.message || error))}
          </p>
        </div>
      `,
      title: 'Habits Demo - Error',
      description: 'FlowState habits demo - temporarily unavailable'
    });
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).send(fallbackHtml);
  }
}