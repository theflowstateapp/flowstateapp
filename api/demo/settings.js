export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('X-Robots-Tag', 'index,follow');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings Demo - FlowState Demo</title>
    <meta name="description" content="FlowState workspace settings and subscription management">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #334155; line-height: 1.6; }
      .container { max-width: 960px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
      header { background-color: #1f2937; color: white; padding: 15px 20px; margin-bottom: 20px; border-radius: 8px; }
      header a { color: #60a5fa; text-decoration: none; margin: 0 8px; }
      h1 { color: #1F2937; margin-bottom: 20px; font-size: 2.5rem; }
      h2 { color: #1F2937; margin-top: 30px; margin-bottom: 15px; font-size: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
      h3 { color: #1F2937; margin-top: 20px; margin-bottom: 10px; font-size: 1.5rem; }
      .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
      th { background-color: #f1f5f9; font-weight: 600; color: #475569; }
      .cta-button { background-color: #0284c7; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; margin: 10px 5px; }
      .cta-secondary { background-color: #e0f2fe; color: #0284c7; border: 1px solid #0284c7; }
      footer { text-align: center; margin-top: 50px; padding: 20px; color: #6B7280; border-top: 1px solid #E5E7EB; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>FlowState Demo</h1>
            <div style="margin: 10px 0;">
                <a href="/demo">Overview</a> | 
                <a href="/demo/tasks">Tasks</a> | 
                <a href="/demo/habits">Habits</a> | 
                <a href="/demo/journal">Journal</a> | 
                <a href="/demo/review">Review</a> | 
                <a href="/demo/agenda">Week Agenda</a> | 
                <a href="/demo/settings">Settings</a> | 
                <a href="/api/demo/access">Open Interactive Demo →</a>
            </div>
            <p><small>Read-only snapshots. Data resets periodically.</small></p>
        </div>
    </header>
    
    <main class="container">
        <h1>Settings (Read-only Demo)</h1>
        <p>Configure your workspace preferences and manage your subscription.</p>

        <h2>⚙️ Workspace Preferences</h2>
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Setting</th>
                        <th scope="col">Value</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Timezone</strong></td>
                        <td>Asia/Kolkata</td>
                        <td>All times displayed in this timezone</td>
                    </tr>
                    <tr>
                        <td><strong>Weekday Start</strong></td>
                        <td>09:00</td>
                        <td>Work day begins at this time</td>
                    </tr>
                    <tr>
                        <td><strong>Weekday End</strong></td>
                        <td>18:00</td>
                        <td>Work day ends at this time</td>
                    </tr>
                    <tr>
                        <td><strong>Weekend Start</strong></td>
                        <td>10:00</td>
                        <td>Weekend work begins at this time</td>
                    </tr>
                    <tr>
                        <td><strong>Weekend End</strong></td>
                        <td>16:00</td>
                        <td>Weekend work ends at this time</td>
                    </tr>
                    <tr>
                        <td><strong>Reminder Channel</strong></td>
                        <td>Email + Push</td>
                        <td>How you receive notifications</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>💳 Subscription Summary</h2>
        <div class="card">
            <div class="grid">
                <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px;">
                    <h3 style="margin-top: 0;">Current Plan</h3>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #0284c7; margin-bottom: 8px;">Pro</div>
                    <p style="margin-bottom: 0; color: #64748b;">Full access to all features</p>
                </div>
                
                <div style="background-color: #f0fdf4; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px;">
                    <h3 style="margin-top: 0;">Billing Provider</h3>
                    <div style="font-size: 1.2rem; font-weight: 600; color: #059669; margin-bottom: 8px;">Razorpay</div>
                    <p style="margin-bottom: 0; color: #64748b;">Secure payment processing</p>
                </div>
                
                <div style="background-color: #fef3c7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 4px;">
                    <h3 style="margin-top: 0;">Current Period</h3>
                    <div style="font-size: 1.2rem; font-weight: 600; color: #D97706; margin-bottom: 8px;">Active</div>
                    <p style="margin-bottom: 0; color: #64748b;">Renews automatically</p>
                </div>
            </div>
        </div>

        <h2>🔒 Privacy & Data</h2>
        <div class="card">
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
                <h3 style="margin-top: 0;">Data Export & Privacy</h3>
                <ul style="margin-bottom: 20px;">
                    <li><strong>CSV Export:</strong> Download all your tasks, habits, and journal entries</li>
                    <li><strong>Markdown Export:</strong> Export journal entries in markdown format</li>
                    <li><strong>Data Portability:</strong> Easy migration to other productivity tools</li>
                    <li><strong>Account Deletion:</strong> Complete data removal upon request</li>
                    <li><strong>GDPR Compliance:</strong> Full compliance with data protection regulations</li>
                </ul>
                <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px;">
                    <p style="margin-bottom: 0; color: #64748b;">
                        <strong>Note:</strong> Interactive app supports CSV/Markdown export and account deletion.
                    </p>
                </div>
            </div>
        </div>

        <h2>🎨 Appearance & Accessibility</h2>
        <div class="card">
            <table>
                <thead>
                    <tr>
                        <th scope="col">Feature</th>
                        <th scope="col">Status</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Dark Mode</strong></td>
                        <td><span style="background-color: #d1fae5; color: #10B981; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Enabled</span></td>
                        <td>System preference-based theme switching</td>
                    </tr>
                    <tr>
                        <td><strong>High Contrast</strong></td>
                        <td><span style="background-color: #d1fae5; color: #10B981; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Enabled</span></td>
                        <td>Enhanced visibility for accessibility</td>
                    </tr>
                    <tr>
                        <td><strong>Keyboard Navigation</strong></td>
                        <td><span style="background-color: #d1fae5; color: #10B981; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Enabled</span></td>
                        <td>Full keyboard accessibility support</td>
                    </tr>
                    <tr>
                        <td><strong>Screen Reader</strong></td>
                        <td><span style="background-color: #d1fae5; color: #10B981; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">Supported</span></td>
                        <td>ARIA labels and semantic HTML</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>🔧 Advanced Settings</h2>
        <div class="card">
            <div class="grid">
                <div>
                    <h3>Notifications</h3>
                    <ul>
                        <li>Task reminders: <span style="color: #10B981;">✓ Enabled</span></li>
                        <li>Habit check-ins: <span style="color: #10B981;">✓ Enabled</span></li>
                        <li>Weekly reviews: <span style="color: #10B981;">✓ Enabled</span></li>
                        <li>Email digest: <span style="color: #10B981;">✓ Enabled</span></li>
                    </ul>
                </div>
                <div>
                    <h3>Integrations</h3>
                    <ul>
                        <li>Calendar sync: <span style="color: #10B981;">✓ Connected</span></li>
                        <li>Slack notifications: <span style="color: #10B981;">✓ Connected</span></li>
                        <li>Google Drive: <span style="color: #64748b;">○ Not connected</span></li>
                        <li>Zapier: <span style="color: #64748b;">○ Not connected</span></li>
                    </ul>
                </div>
            </div>
        </div>

        <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Note:</strong> All settings can be modified in the interactive app with real-time updates.</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
            <a href="/api/demo/access?utm_source=demo-settings" class="cta-button">Open Interactive Demo</a>
            <a href="/demo" class="cta-button cta-secondary">Back to Overview</a>
        </div>
    </main>
    
    <footer>
        <p>&copy; ${new Date().getFullYear()} FlowState. All rights reserved.</p>
        <p><a href="/privacy" style="color: #0284c7; text-decoration: none;">Privacy Policy</a> | 
           <a href="mailto:support@theflowstateapp.com" style="color: #0284c7; text-decoration: none;">Contact Us</a></p>
        <p><small>Data resets periodically. Demo only.</small></p>
    </footer>
</body>
</html>`;

    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('<html><body><h1>Demo temporarily unavailable</h1></body></html>');
  }
}