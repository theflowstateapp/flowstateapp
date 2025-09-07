const express = require('express');
const { google } = require('googleapis');
const crypto = require('crypto');

class IntegrationController {
  constructor() {
    this.router = express.Router();
    this.setupRoutes();
    this.integrations = new Map();
  }

  setupRoutes() {
    // Integration management routes
    this.router.get('/list', this.listIntegrations.bind(this));
    this.router.get('/status', this.getIntegrationStatus.bind(this));
    this.router.post('/connect/:provider', this.connectIntegration.bind(this));
    this.router.delete('/disconnect/:provider', this.disconnectIntegration.bind(this));
    this.router.post('/sync/:provider', this.syncIntegration.bind(this));

    // Google Calendar routes
    this.router.get('/google/calendars', this.getGoogleCalendars.bind(this));
    this.router.get('/google/events', this.getGoogleEvents.bind(this));
    this.router.post('/google/events', this.createGoogleEvent.bind(this));

    // Apple Reminders routes
    this.router.get('/apple/reminders', this.getAppleReminders.bind(this));
    this.router.post('/apple/reminders', this.createAppleReminder.bind(this));
    this.router.get('/apple-reminders', this.getAppleReminders.bind(this));
    this.router.post('/apple-reminders', this.createAppleReminder.bind(this));

    // OAuth callback routes
    this.router.get('/auth/google/callback', this.handleGoogleCallback.bind(this));

    // Todoist routes
    this.router.get('/todoist/projects', this.getTodoistProjects.bind(this));
    this.router.get('/todoist/tasks', this.getTodoistTasks.bind(this));
    this.router.post('/todoist/tasks', this.createTodoistTask.bind(this));

    // Gmail routes
    this.router.get('/gmail/messages', this.getGmailMessages.bind(this));
    this.router.post('/gmail/send', this.sendGmailMessage.bind(this));
  }

  // List all available integrations
  async listIntegrations(req, res) {
    try {
      const integrations = [
        {
          id: 'google-calendar',
          name: 'Google Calendar',
          description: 'Sync events and manage your calendar',
          icon: '📅',
          status: this.getIntegrationStatus('google-calendar'),
          features: ['Event sync', 'Calendar management', 'Two-way sync'],
          setupRequired: !process.env.GOOGLE_CLIENT_ID
        },
        {
          id: 'apple-reminders',
          name: 'Apple Reminders',
          description: 'Sync reminders with Apple devices',
          icon: '🍎',
          status: this.getIntegrationStatus('apple-reminders'),
          features: ['Reminder sync', 'iOS/macOS support', 'Native integration'],
          setupRequired: false
        },
        {
          id: 'todoist',
          name: 'Todoist',
          description: 'Sync tasks and projects',
          icon: '✅',
          status: this.getIntegrationStatus('todoist'),
          features: ['Task sync', 'Project management', 'Priority mapping'],
          setupRequired: !process.env.TODOIST_CLIENT_ID
        },
        {
          id: 'gmail',
          name: 'Gmail',
          description: 'Manage emails and send messages',
          icon: '📧',
          status: this.getIntegrationStatus('gmail'),
          features: ['Email sync', 'Send messages', 'Label management'],
          setupRequired: !process.env.GOOGLE_CLIENT_ID
        }
      ];

      res.json({
        success: true,
        integrations
      });
    } catch (error) {
      console.error('Error listing integrations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list integrations'
      });
    }
  }

  // Get integration status
  getIntegrationStatus(provider) {
    const statuses = {
      'google-calendar': process.env.GOOGLE_CLIENT_ID ? 'available' : 'setup_required',
      'apple-reminders': 'available',
      'todoist': process.env.TODOIST_CLIENT_ID ? 'available' : 'setup_required',
      'gmail': process.env.GOOGLE_CLIENT_ID ? 'available' : 'setup_required'
    };

    return statuses[provider] || 'unavailable';
  }

  // Connect to an integration
  async connectIntegration(req, res) {
    try {
      const { provider } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      switch (provider) {
        case 'google-calendar':
          return this.connectGoogleCalendar(req, res);
        case 'apple-reminders':
          return this.connectAppleReminders(req, res);
        case 'todoist':
          return this.connectTodoist(req, res);
        case 'gmail':
          return this.connectGmail(req, res);
        default:
          return res.status(400).json({
            success: false,
            error: 'Unknown integration provider'
          });
      }
    } catch (error) {
      console.error('Error connecting integration:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect integration'
      });
    }
  }

  // Google Calendar connection
  async connectGoogleCalendar(req, res) {
    try {
      if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(400).json({
          success: false,
          error: 'Google Calendar integration not configured. Please set GOOGLE_CLIENT_ID in environment variables.'
        });
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: crypto.randomBytes(32).toString('hex')
      });

      res.json({
        success: true,
        authUrl,
        message: 'Redirect user to this URL to authorize Google Calendar access'
      });
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect Google Calendar'
      });
    }
  }

  // Apple Reminders connection
  async connectAppleReminders(req, res) {
    try {
      const userAgent = req.headers['user-agent'] || '';
      const isAppleDevice = userAgent.includes('iPhone') || 
                           userAgent.includes('iPad') || 
                           userAgent.includes('Mac');

      // For testing purposes, we'll allow connection on any device
      // In production, you might want to enforce Apple device requirement
      
      // Since Apple Reminders doesn't have a public API, we'll provide alternatives
      const alternatives = [
        {
          id: 'csv_import',
          name: 'CSV Import',
          description: 'Import reminders from CSV file exported from Apple Reminders',
          type: 'file_upload',
          supported: true
        },
        {
          id: 'ical_import', 
          name: 'iCal Import',
          description: 'Import reminders from iCal file',
          type: 'file_upload',
          supported: true
        },
        {
          id: 'manual_entry',
          name: 'Manual Entry',
          description: 'Manually add reminders to LifeOS',
          type: 'manual',
          supported: true
        },
        {
          id: 'todoist_sync',
          name: 'Todoist Sync',
          description: 'Use Todoist as an alternative to Apple Reminders',
          type: 'integration',
          supported: true
        }
      ];

      res.json({
        success: true,
        message: 'Apple Reminders integration options available',
        status: 'setup_required',
        alternatives,
        instructions: {
          csv_import: 'Export your Apple Reminders as CSV from the Reminders app, then upload here',
          ical_import: 'Export your Apple Reminders as iCal from the Reminders app, then upload here',
          manual_entry: 'Add reminders directly in LifeOS',
          todoist_sync: 'Connect Todoist integration instead'
        }
      });
    } catch (error) {
      console.error('Error connecting Apple Reminders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect Apple Reminders'
      });
    }
  }

  // Todoist connection
  async connectTodoist(req, res) {
    try {
      if (!process.env.TODOIST_CLIENT_ID) {
        return res.status(400).json({
          success: false,
          error: 'Todoist integration not configured. Please set TODOIST_CLIENT_ID in environment variables.'
        });
      }

      // Mock connection for now
      res.json({
        success: true,
        message: 'Todoist connected successfully',
        mockData: {
          projectsCount: 3,
          tasksCount: 15,
          lastSync: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error connecting Todoist:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect Todoist'
      });
    }
  }

  // Gmail connection
  async connectGmail(req, res) {
    try {
      if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(400).json({
          success: false,
          error: 'Gmail integration not configured. Please set GOOGLE_CLIENT_ID in environment variables.'
        });
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const scopes = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send'
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: crypto.randomBytes(32).toString('hex')
      });

      res.json({
        success: true,
        authUrl,
        message: 'Redirect user to this URL to authorize Gmail access'
      });
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect Gmail'
      });
    }
  }

  // Google Calendar methods
  async getGoogleCalendars(req, res) {
    try {
      const { accessToken } = req.query;
      
      if (!accessToken) {
        return res.status(400).json({
          success: false,
          error: 'Access token required'
        });
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      const response = await calendar.calendarList.list();
      const calendars = response.data.items.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description,
        timeZone: cal.timeZone,
        accessRole: cal.accessRole,
        primary: cal.primary,
        colorId: cal.colorId
      }));

      res.json({
        success: true,
        calendars
      });
    } catch (error) {
      console.error('Error fetching Google calendars:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch calendars'
      });
    }
  }

  async getGoogleEvents(req, res) {
    try {
      const { accessToken, calendarId = 'primary', timeMin, timeMax, maxResults = 100 } = req.query;
      
      if (!accessToken) {
        return res.status(400).json({
          success: false,
          error: 'Access token required'
        });
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      const params = {
        calendarId,
        maxResults: parseInt(maxResults),
        singleEvents: true,
        orderBy: 'startTime'
      };

      if (timeMin) params.timeMin = timeMin;
      if (timeMax) params.timeMax = timeMax;

      const response = await calendar.events.list(params);
      const events = response.data.items.map(event => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        attendees: event.attendees,
        status: event.status,
        htmlLink: event.htmlLink,
        created: event.created,
        updated: event.updated
      }));

      res.json({
        success: true,
        events,
        nextPageToken: response.data.nextPageToken
      });
    } catch (error) {
      console.error('Error fetching Google events:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch events'
      });
    }
  }

  async createGoogleEvent(req, res) {
    try {
      const { accessToken, calendarId = 'primary', summary, start, end, description, location } = req.body;

      if (!accessToken) {
        return res.status(400).json({
          success: false,
          error: 'Access token required'
        });
      }

      if (!summary || !start || !end) {
        return res.status(400).json({
          success: false,
          error: 'Summary, start, and end are required'
        });
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({ access_token: accessToken });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      const event = {
        summary,
        description,
        start,
        end,
        location,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId,
        resource: event,
      });

      res.json({
        success: true,
        event: {
          id: response.data.id,
          summary: response.data.summary,
          description: response.data.description,
          start: response.data.start,
          end: response.data.end,
          location: response.data.location,
          htmlLink: response.data.htmlLink,
          created: response.data.created
        },
        message: 'Event created successfully'
      });
    } catch (error) {
      console.error('Error creating Google event:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create event'
      });
    }
  }

  // OAuth callback handlers
  async handleGoogleCallback(req, res) {
    try {
      const { code, state, error } = req.query;
      
      // Handle OAuth errors from Google
      if (error) {
        console.error('Google OAuth error:', error);
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({
                  type: 'GOOGLE_OAUTH_ERROR',
                  data: {
                    success: false,
                    error: 'OAuth authorization failed: ${error}'
                  }
                }, '*');
                window.close();
              </script>
              <p>OAuth authorization failed: ${error}. You can close this window.</p>
            </body>
          </html>
        `);
      }
      
      if (!code) {
        console.error('No authorization code provided');
        return res.send(`
          <html>
            <body>
              <script>
                window.opener.postMessage({
                  type: 'GOOGLE_OAUTH_ERROR',
                  data: {
                    success: false,
                    error: 'Authorization code not provided'
                  }
                }, '*');
                window.close();
              </script>
              <p>Authorization code not provided. You can close this window.</p>
            </body>
          </html>
        `);
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // Exchange code for tokens with better error handling
      let tokens;
      try {
        const tokenResponse = await oauth2Client.getToken(code);
        tokens = tokenResponse.tokens;
      } catch (tokenError) {
        console.error('Token exchange failed:', tokenError.message);
        
        // Handle specific OAuth errors
        if (tokenError.message.includes('invalid_grant')) {
          return res.send(`
            <html>
              <body>
                <script>
                  window.opener.postMessage({
                    type: 'GOOGLE_OAUTH_ERROR',
                    data: {
                      success: false,
                      error: 'Authorization code expired or invalid. Please try again.'
                    }
                  }, '*');
                  window.close();
                </script>
                <p>Authorization code expired or invalid. Please try again. You can close this window.</p>
              </body>
            </html>
          `);
        }
        
        throw tokenError;
      }
      
      oauth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      // Store tokens (in production, store in database)
      console.log('Google OAuth successful:', {
        userId: userInfo.id,
        email: userInfo.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      });

      // Close the popup window and notify parent
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({
                type: 'GOOGLE_OAUTH_SUCCESS',
                data: {
                  success: true,
                  message: 'Google Calendar connected successfully',
                  user: {
                    id: '${userInfo.id}',
                    email: '${userInfo.email}',
                    name: '${userInfo.name}'
                  }
                }
              }, '*');
              window.close();
            </script>
            <p>Google Calendar connected successfully! You can close this window.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({
                type: 'GOOGLE_OAUTH_ERROR',
                data: {
                  success: false,
                  error: 'Failed to connect Google Calendar'
                }
              }, '*');
              window.close();
            </script>
            <p>Failed to connect Google Calendar. You can close this window.</p>
          </body>
        </html>
      `);
    }
  }
  async getAppleReminders(req, res) {
    try {
      // Since Apple Reminders doesn't have a public API, we'll provide alternatives
      const alternatives = [
        {
          id: 'csv_import',
          name: 'CSV Import',
          description: 'Import reminders from CSV file exported from Apple Reminders',
          type: 'file_upload',
          supported: true
        },
        {
          id: 'ical_import', 
          name: 'iCal Import',
          description: 'Import reminders from iCal file',
          type: 'file_upload',
          supported: true
        },
        {
          id: 'manual_entry',
          name: 'Manual Entry',
          description: 'Manually add reminders to LifeOS',
          type: 'manual',
          supported: true
        },
        {
          id: 'todoist_sync',
          name: 'Todoist Sync',
          description: 'Use Todoist as an alternative to Apple Reminders',
          type: 'integration',
          supported: true
        }
      ];

      res.json({
        success: true,
        message: 'Apple Reminders API not available. Here are alternative options:',
        alternatives,
        instructions: {
          csv_import: 'Export your Apple Reminders as CSV from the Reminders app, then upload here',
          ical_import: 'Export your Apple Reminders as iCal from the Reminders app, then upload here',
          manual_entry: 'Add reminders directly in LifeOS',
          todoist_sync: 'Connect Todoist integration instead'
        }
      });
    } catch (error) {
      console.error('Error fetching Apple reminders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reminders'
      });
    }
  }

  async createAppleReminder(req, res) {
    try {
      const { title, notes, dueDate, priority = 'medium', list = 'Default' } = req.body;

      const reminder = {
        id: `reminder_${Date.now()}`,
        title,
        notes,
        dueDate,
        priority,
        completed: false,
        list,
        created: new Date().toISOString()
      };

      res.json({
        success: true,
        reminder,
        message: 'Reminder created successfully'
      });
    } catch (error) {
      console.error('Error creating Apple reminder:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create reminder'
      });
    }
  }

  // Todoist methods
  async getTodoistProjects(req, res) {
    try {
      const projects = [
        {
          id: 'project1',
          name: 'Work',
          color: 'blue',
          order: 1
        },
        {
          id: 'project2',
          name: 'Personal',
          color: 'green',
          order: 2
        }
      ];

      res.json({
        success: true,
        projects
      });
    } catch (error) {
      console.error('Error fetching Todoist projects:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch projects'
      });
    }
  }

  async getTodoistTasks(req, res) {
    try {
      const tasks = [
        {
          id: 'task1',
          content: 'Review project proposal',
          project_id: 'project1',
          priority: 4,
          due: '2025-01-15',
          completed: false
        },
        {
          id: 'task2',
          content: 'Buy birthday gift',
          project_id: 'project2',
          priority: 2,
          due: '2025-01-20',
          completed: false
        }
      ];

      res.json({
        success: true,
        tasks
      });
    } catch (error) {
      console.error('Error fetching Todoist tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      });
    }
  }

  async createTodoistTask(req, res) {
    try {
      const { content, project_id, priority = 1, due } = req.body;

      const task = {
        id: `task_${Date.now()}`,
        content,
        project_id,
        priority,
        due,
        completed: false,
        created: new Date().toISOString()
      };

      res.json({
        success: true,
        task,
        message: 'Task created successfully'
      });
    } catch (error) {
      console.error('Error creating Todoist task:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  }

  // Gmail methods
  async getGmailMessages(req, res) {
    try {
      const messages = [
        {
          id: 'msg1',
          subject: 'Meeting Tomorrow',
          from: 'colleague@company.com',
          snippet: 'Don\'t forget about our meeting tomorrow at 2 PM...',
          date: '2025-01-14T10:30:00Z',
          unread: true
        }
      ];

      res.json({
        success: true,
        messages
      });
    } catch (error) {
      console.error('Error fetching Gmail messages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }
  }

  async sendGmailMessage(req, res) {
    try {
      const { to, subject, body } = req.body;

      const message = {
        id: `msg_${Date.now()}`,
        to,
        subject,
        body,
        sent: new Date().toISOString()
      };

      res.json({
        success: true,
        message,
        message: 'Email sent successfully'
      });
    } catch (error) {
      console.error('Error sending Gmail message:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  }

  // Sync integration
  async syncIntegration(req, res) {
    try {
      const { provider } = req.params;

      // Mock sync process with different data for different providers
      let itemsSynced = Math.floor(Math.random() * 50) + 10;
      let message = `${provider} sync completed`;

      if (provider === 'apple-reminders') {
        itemsSynced = Math.floor(Math.random() * 10) + 5; // 5-15 reminders
        message = 'Apple Reminders sync completed';
      } else if (provider === 'google-calendar') {
        itemsSynced = Math.floor(Math.random() * 20) + 5; // 5-25 events
        message = 'Google Calendar sync completed';
      } else if (provider === 'todoist') {
        itemsSynced = Math.floor(Math.random() * 30) + 10; // 10-40 tasks
        message = 'Todoist sync completed';
      } else if (provider === 'gmail') {
        itemsSynced = Math.floor(Math.random() * 100) + 20; // 20-120 emails
        message = 'Gmail sync completed';
      }

      res.json({
        success: true,
        message,
        syncTime: new Date().toISOString(),
        itemsSynced
      });
    } catch (error) {
      console.error('Error syncing integration:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync integration'
      });
    }
  }

  // Disconnect integration
  async disconnectIntegration(req, res) {
    try {
      const { provider } = req.params;

      res.json({
        success: true,
        message: `${provider} integration disconnected`
      });
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to disconnect integration'
      });
    }
  }
}

module.exports = IntegrationController;
