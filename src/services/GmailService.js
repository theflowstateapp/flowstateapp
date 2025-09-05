// Gmail Integration Service
// This service handles integration with Gmail for task and email management
/* eslint-disable no-undef */

class GmailService {
  constructor() {
    this.isSupported = this.checkSupport();
    this.emails = [];
    this.syncStatus = 'disconnected';
    this.lastSyncTime = null;
    this.accessToken = null;
    
    // Restore connection status from localStorage
    this.restoreConnectionStatus();
  }

  // Restore connection status from localStorage
  restoreConnectionStatus() {
    if (typeof window !== 'undefined') {
      const connected = localStorage.getItem('gmailConnected');
      const lastSync = localStorage.getItem('gmailLastSync');
      const token = localStorage.getItem('gmailAccessToken');
      
      if (connected === 'true') {
        this.syncStatus = 'connected';
        if (lastSync) {
          this.lastSyncTime = new Date(lastSync);
        }
        if (token) {
          this.accessToken = token;
        }
      }
    }
  }

  // Check if Gmail API is supported
  checkSupport() {
    return typeof window !== 'undefined' && 
           typeof window.gapi !== 'undefined' && 
           typeof window.gapi.client !== 'undefined';
  }

  // Initialize Gmail API
  async initialize() {
    try {
      if (!this.isSupported) {
        throw new Error('Gmail API is not supported in this environment');
      }

      // In a real implementation, this would initialize the Gmail API
      // For now, we'll simulate the initialization
      await this.simulateGmailInit();
      
      return { success: true, message: 'Gmail API initialized successfully' };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gmail initialization failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Simulate Gmail API initialization
  simulateGmailInit() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  // Request permission to access Gmail
  async requestPermission() {
    try {
      if (!this.isSupported) {
        throw new Error('Gmail API is not supported on this device');
      }

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Gmail integration requires browser environment');
      }

      // In a real implementation, this would use Google OAuth2
      // For now, we'll simulate the permission request with a more realistic flow
      const permission = await this.simulatePermissionRequest();
      
      if (permission === 'granted') {
        this.syncStatus = 'connected';
        this.accessToken = 'mock_access_token_' + Date.now();
        this.lastSyncTime = new Date();
        
        // Store connection status in localStorage for persistence
        localStorage.setItem('gmailConnected', 'true');
        localStorage.setItem('gmailLastSync', this.lastSyncTime.toISOString());
        localStorage.setItem('gmailAccessToken', this.accessToken);
        
        return { success: true, status: 'granted' };
      } else {
        return { success: false, status: permission };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Permission request failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Simulate permission request (replace with real Google OAuth2)
  simulatePermissionRequest() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate user granting permission
        resolve('granted');
      }, 1500);
    });
  }

  // Fetch emails from Gmail
  async fetchEmails(options = {}) {
    try {
      if (this.syncStatus !== 'connected') {
        throw new Error('Not connected to Gmail');
      }

      // In a real implementation, this would use Gmail API to fetch emails
      // For now, we'll return mock data that represents typical Gmail emails
      const mockEmails = [
        {
          id: 'email_1',
          subject: 'Meeting with client tomorrow at 2 PM',
          from: 'client@company.com',
          to: 'me@flowstate.com',
          body: 'Hi, just confirming our meeting tomorrow at 2 PM. Please bring the project proposal.',
          date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          labels: ['INBOX', 'IMPORTANT'],
          hasAttachment: false,
          isRead: false,
          threadId: 'thread_1'
        },
        {
          id: 'email_2',
          subject: 'Invoice #12345 - Payment Due',
          from: 'billing@service.com',
          to: 'me@flowstate.com',
          body: 'Your invoice #12345 is due for payment. Amount: $299. Due date: Next Friday.',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          labels: ['INBOX', 'BILLING'],
          hasAttachment: true,
          isRead: true,
          threadId: 'thread_2'
        },
        {
          id: 'email_3',
          subject: 'Doctor appointment reminder',
          from: 'appointments@clinic.com',
          to: 'me@flowstate.com',
          body: 'Reminder: You have a doctor appointment on Friday at 10 AM. Please arrive 15 minutes early.',
          date: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          labels: ['INBOX', 'HEALTH'],
          hasAttachment: false,
          isRead: false,
          threadId: 'thread_3'
        },
        {
          id: 'email_4',
          subject: 'Flight confirmation - Trip to NYC',
          from: 'noreply@airline.com',
          to: 'me@flowstate.com',
          body: 'Your flight AA1234 is confirmed for departure on Monday at 8:30 AM. Gate: A12',
          date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          labels: ['INBOX', 'TRAVEL'],
          hasAttachment: true,
          isRead: true,
          threadId: 'thread_4'
        },
        {
          id: 'email_5',
          subject: 'Grocery list - Weekend shopping',
          from: 'family@home.com',
          to: 'me@flowstate.com',
          body: 'Don\'t forget to buy: milk, eggs, bread, chicken, vegetables, and fruits for the weekend.',
          date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
          labels: ['INBOX', 'PERSONAL'],
          hasAttachment: false,
          isRead: false,
          threadId: 'thread_5'
        },
        {
          id: 'email_6',
          subject: 'Project deadline extension request',
          from: 'manager@work.com',
          to: 'me@flowstate.com',
          body: 'The client has requested a 2-week extension for the project. Please update the timeline accordingly.',
          date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          labels: ['INBOX', 'WORK'],
          hasAttachment: false,
          isRead: true,
          threadId: 'thread_6'
        }
      ];

      // Filter emails based on options
      let filteredEmails = mockEmails;
      
      if (options.unreadOnly) {
        filteredEmails = filteredEmails.filter(email => !email.isRead);
      }
      
      if (options.label) {
        filteredEmails = filteredEmails.filter(email => 
          email.labels.includes(options.label)
        );
      }
      
      if (options.dateFrom) {
        filteredEmails = filteredEmails.filter(email => 
          email.date >= new Date(options.dateFrom)
        );
      }

      this.emails = filteredEmails;
      this.lastSyncTime = new Date();
      
      return {
        success: true,
        emails: this.emails,
        count: this.emails.length,
        lastSync: this.lastSyncTime
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch emails:', error);
      return { success: false, error: error.message };
    }
  }

  // Convert Gmail email to FlowState Task format
  convertEmailToTask(email) {
    return {
      id: `gmail_${email.id}`,
      title: this.extractTaskTitle(email),
      description: this.extractTaskDescription(email),
      dueDate: this.extractDueDate(email),
      priority: this.mapPriority(email),
      status: 'pending',
      tags: this.generateTags(email),
      source: 'gmail',
      originalId: email.id,
      createdAt: email.date,
      updatedAt: email.date,
      metadata: {
        from: email.from,
        subject: email.subject,
        labels: email.labels,
        hasAttachment: email.hasAttachment,
        threadId: email.threadId,
        originalEmail: email
      }
    };
  }

  // Extract task title from email
  extractTaskTitle(email) {
    const subject = email.subject.toLowerCase();
    
    // Extract meeting-related tasks
    if (subject.includes('meeting')) {
      return `Meeting: ${email.subject}`;
    }
    
    // Extract appointment tasks
    if (subject.includes('appointment') || subject.includes('appt')) {
      return `Appointment: ${email.subject}`;
    }
    
    // Extract payment tasks
    if (subject.includes('payment') || subject.includes('invoice') || subject.includes('bill')) {
      return `Payment: ${email.subject}`;
    }
    
    // Extract travel tasks
    if (subject.includes('flight') || subject.includes('travel') || subject.includes('trip')) {
      return `Travel: ${email.subject}`;
    }
    
    // Extract shopping tasks
    if (subject.includes('grocery') || subject.includes('shopping') || subject.includes('buy')) {
      return `Shopping: ${email.subject}`;
    }
    
    // Default to subject
    return email.subject;
  }

  // Extract task description from email
  extractTaskDescription(email) {
    const body = email.body;
    const from = `From: ${email.from}`;
    
    // Truncate body if too long
    const truncatedBody = body.length > 200 ? body.substring(0, 200) + '...' : body;
    
    return `${from}\n\n${truncatedBody}`;
  }

  // Extract due date from email content
  extractDueDate(email) {
    const content = (email.subject + ' ' + email.body).toLowerCase();
    
    // Look for time patterns
    const timePatterns = [
      { pattern: /tomorrow/i, offset: 24 * 60 * 60 * 1000 },
      { pattern: /next week/i, offset: 7 * 24 * 60 * 60 * 1000 },
      { pattern: /next friday/i, offset: this.getNextFridayOffset() },
      { pattern: /monday/i, offset: this.getNextMondayOffset() },
      { pattern: /friday/i, offset: this.getNextFridayOffset() },
      { pattern: /(\d+)\s*(am|pm)/i, extractTime: true }
    ];
    
    for (const { pattern, offset, extractTime } of timePatterns) {
      const match = content.match(pattern);
      if (match) {
        if (extractTime) {
          // Extract specific time
          const timeMatch = content.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)/i);
          if (timeMatch) {
            const hour = parseInt(timeMatch[1]);
            const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            const period = timeMatch[3].toLowerCase();
            
            let hour24 = hour;
            if (period === 'pm' && hour !== 12) hour24 += 12;
            if (period === 'am' && hour === 12) hour24 = 0;
            
            const dueDate = new Date();
            dueDate.setHours(hour24, minute, 0, 0);
            
            // If time has passed today, set for tomorrow
            if (dueDate < new Date()) {
              dueDate.setDate(dueDate.getDate() + 1);
            }
            
            return dueDate;
          }
        } else if (offset) {
          return new Date(Date.now() + offset);
        }
      }
    }
    
    return null;
  }

  // Helper methods for date calculations
  getNextFridayOffset() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    return daysUntilFriday * 24 * 60 * 60 * 1000;
  }

  getNextMondayOffset() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = (1 - dayOfWeek + 7) % 7;
    return daysUntilMonday * 24 * 60 * 60 * 1000;
  }

  // Map email priority to FlowState priority
  mapPriority(email) {
    const subject = email.subject.toLowerCase();
    const labels = email.labels.map(label => label.toLowerCase());
    
    // High priority indicators
    if (labels.includes('important') || 
        subject.includes('urgent') || 
        subject.includes('asap') ||
        subject.includes('deadline')) {
      return 'high';
    }
    
    // Low priority indicators
    if (labels.includes('personal') || 
        subject.includes('grocery') ||
        subject.includes('shopping')) {
      return 'low';
    }
    
    return 'medium';
  }

  // Generate tags based on email content and labels
  generateTags(email) {
    const tags = [];
    
    // Add label-based tags
    email.labels.forEach(label => {
      if (label !== 'INBOX') {
        tags.push(label.toLowerCase());
      }
    });
    
    // Add content-based tags
    const content = (email.subject + ' ' + email.body).toLowerCase();
    
    if (content.includes('meeting') || content.includes('call')) {
      tags.push('meeting');
    }
    if (content.includes('payment') || content.includes('invoice') || content.includes('bill')) {
      tags.push('payment');
    }
    if (content.includes('appointment') || content.includes('doctor') || content.includes('health')) {
      tags.push('health');
    }
    if (content.includes('flight') || content.includes('travel') || content.includes('trip')) {
      tags.push('travel');
    }
    if (content.includes('grocery') || content.includes('shopping') || content.includes('buy')) {
      tags.push('shopping');
    }
    if (content.includes('work') || content.includes('project') || content.includes('deadline')) {
      tags.push('work');
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  // Import emails as tasks
  async importEmails(options = {}) {
    try {
      const fetchResult = await this.fetchEmails(options);
      if (!fetchResult.success) {
        throw new Error(fetchResult.error);
      }

      const { emails } = fetchResult;
      const convertedTasks = emails.map(email => 
        this.convertEmailToTask(email)
      );

      // Filter based on import options
      let filteredTasks = convertedTasks;
      
      if (options.unreadOnly) {
        filteredTasks = filteredTasks.filter(task => 
          task.metadata.originalEmail.isRead === false
        );
      }
      
      if (options.label) {
        filteredTasks = filteredTasks.filter(task => 
          task.metadata.labels.includes(options.label)
        );
      }
      
      if (options.priority) {
        filteredTasks = filteredTasks.filter(task => 
          task.priority === options.priority
        );
      }

      return {
        success: true,
        tasks: filteredTasks,
        totalImported: filteredTasks.length,
        totalAvailable: emails.length
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Import failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync changes back to Gmail
  async syncToGmail(task) {
    try {
      if (this.syncStatus !== 'connected') {
        throw new Error('Not connected to Gmail');
      }

      // In a real implementation, this would update the original email
      // For now, we'll simulate the sync
      // eslint-disable-next-line no-console
      console.log('Syncing task to Gmail:', task);
      
      return {
        success: true,
        syncedAt: new Date()
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get available Gmail labels
  async getGmailLabels() {
    try {
      const fetchResult = await this.fetchEmails();
      if (!fetchResult.success) {
        throw new Error(fetchResult.error);
      }

      const allLabels = this.emails.flatMap(email => email.labels);
      const uniqueLabels = [...new Set(allLabels)];
      
      return {
        success: true,
        labels: uniqueLabels.map(label => ({
          name: label,
          count: this.emails.filter(email => email.labels.includes(label)).length
        }))
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get labels:', error);
      return { success: false, error: error.message };
    }
  }

  // Disconnect from Gmail
  disconnect() {
    this.syncStatus = 'disconnected';
    this.emails = [];
    this.lastSyncTime = null;
    this.accessToken = null;
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gmailConnected');
      localStorage.removeItem('gmailLastSync');
      localStorage.removeItem('gmailAccessToken');
    }
  }

  // Get sync status
  getStatus() {
    return {
      connected: this.syncStatus === 'connected',
      lastSync: this.lastSyncTime,
      emailCount: this.emails.length,
      supported: this.isSupported
    };
  }
}

export default new GmailService();
