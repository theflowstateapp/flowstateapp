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

      if (!isAppleDevice) {
        return res.status(400).json({
          success: false,
          error: 'Apple Reminders integration is only available on Apple devices'
        });
      }

      // Mock connection - in real implementation, this would request permissions
      res.json({
        success: true,
        message: 'Apple Reminders connected successfully',
        mockData: {
          remindersCount: 5,
          lastSync: new Date().toISOString()
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
      // Mock data for now
      const calendars = [
        {
          id: 'primary',
          summary: 'Primary Calendar',
          description: 'Your main calendar',
          timeZone: 'America/New_York',
          accessRole: 'owner'
        }
      ];

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
      // Mock data for now
      const events = [
        {
          id: 'event1',
          summary: 'Team Meeting',
          start: { dateTime: '2025-01-15T10:00:00Z' },
          end: { dateTime: '2025-01-15T11:00:00Z' },
          description: 'Weekly team sync'
        }
      ];

      res.json({
        success: true,
        events
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
      const { summary, start, end, description } = req.body;

      // Mock event creation
      const event = {
        id: `event_${Date.now()}`,
        summary,
        start,
        end,
        description,
        created: new Date().toISOString()
      };

      res.json({
        success: true,
        event,
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

  // Apple Reminders methods
  async getAppleReminders(req, res) {
    try {
      const mockReminders = [
        {
          id: 'reminder1',
          title: 'Buy groceries',
          notes: 'Milk, bread, eggs',
          dueDate: '2025-01-15T18:00:00Z',
          priority: 'medium',
          completed: false,
          list: 'Personal'
        },
        {
          id: 'reminder2',
          title: 'Call dentist',
          notes: 'Schedule checkup',
          dueDate: '2025-01-16T14:00:00Z',
          priority: 'high',
          completed: false,
          list: 'Health'
        }
      ];

      res.json({
        success: true,
        reminders: mockReminders
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

      // Mock sync process
      res.json({
        success: true,
        message: `${provider} sync completed`,
        syncTime: new Date().toISOString(),
        itemsSynced: Math.floor(Math.random() * 50) + 10
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
