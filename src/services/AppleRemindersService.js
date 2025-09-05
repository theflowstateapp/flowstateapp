// Apple Reminders Integration Service
// This service handles integration with Apple Reminders for iOS/macOS users

class AppleRemindersService {
  constructor() {
    this.isSupported = this.checkSupport();
    this.reminders = [];
    this.syncStatus = 'disconnected';
    this.lastSyncTime = null;
    
    // Restore connection status from localStorage
    this.restoreConnectionStatus();
  }

  // Restore connection status from localStorage
  restoreConnectionStatus() {
    if (typeof window !== 'undefined') {
      const connected = localStorage.getItem('appleRemindersConnected');
      const lastSync = localStorage.getItem('appleRemindersLastSync');
      
      if (connected === 'true') {
        this.syncStatus = 'connected';
        if (lastSync) {
          this.lastSyncTime = new Date(lastSync);
        }
      }
    }
  }

  // Check if Apple Reminders API is supported
  checkSupport() {
    // In a real implementation, this would check for:
    // - iOS/macOS environment
    // - EventKit framework availability
    // - User permissions
    return typeof window !== 'undefined' && 
           (navigator.userAgent.includes('iPhone') || 
            navigator.userAgent.includes('iPad') || 
            navigator.userAgent.includes('Mac'));
  }

  // Request permission to access Apple Reminders
  async requestPermission() {
    try {
      if (!this.isSupported) {
        throw new Error('Apple Reminders is not supported on this device');
      }

      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Apple Reminders integration requires browser environment');
      }

      // In a real implementation, this would use EventKit framework
      // For now, we'll simulate the permission request with a more realistic flow
      const permission = await this.simulatePermissionRequest();
      
      if (permission === 'granted') {
        this.syncStatus = 'connected';
        this.lastSyncTime = new Date();
        
        // Store connection status in localStorage for persistence
        localStorage.setItem('appleRemindersConnected', 'true');
        localStorage.setItem('appleRemindersLastSync', this.lastSyncTime.toISOString());
        
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

  // Simulate permission request (replace with real EventKit API)
  simulatePermissionRequest() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate user granting permission
        resolve('granted');
      }, 1000);
    });
  }

  // Fetch reminders from Apple Reminders
  async fetchReminders() {
    try {
      if (this.syncStatus !== 'connected') {
        throw new Error('Not connected to Apple Reminders');
      }

      // In a real implementation, this would use EventKit to fetch reminders
      // For now, we'll return mock data that represents typical Apple Reminders
      const mockReminders = [
        {
          id: 'reminder_1',
          title: 'Buy groceries',
          notes: 'Milk, eggs, bread, and vegetables',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          priority: 'high',
          completed: false,
          list: 'Shopping',
          location: 'Whole Foods Market',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          modifiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'reminder_2',
          title: 'Call mom',
          notes: 'Check on her health and catch up',
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
          priority: 'medium',
          completed: false,
          list: 'Personal',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          modifiedAt: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 'reminder_3',
          title: 'Finish project proposal',
          notes: 'Review and submit final draft',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
          priority: 'high',
          completed: false,
          list: 'Work',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          modifiedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 'reminder_4',
          title: 'Doctor appointment',
          notes: 'Annual checkup at 2 PM',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          priority: 'medium',
          completed: false,
          list: 'Health',
          location: 'City Medical Center',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          modifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'reminder_5',
          title: 'Gym workout',
          notes: 'Upper body strength training',
          dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // In 4 hours
          priority: 'low',
          completed: false,
          list: 'Fitness',
          location: 'Local Gym',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          modifiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ];

      this.reminders = mockReminders;
      this.lastSyncTime = new Date();
      
      return {
        success: true,
        reminders: this.reminders,
        count: this.reminders.length,
        lastSync: this.lastSyncTime
      };
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      return { success: false, error: error.message };
    }
  }

  // Convert Apple Reminder to FlowState Task format
  convertReminderToTask(reminder) {
    return {
      id: `imported_${reminder.id}`,
      title: reminder.title,
      description: reminder.notes || '',
      dueDate: reminder.dueDate,
      priority: this.mapPriority(reminder.priority),
      status: reminder.completed ? 'completed' : 'pending',
      tags: this.generateTags(reminder),
      source: 'apple_reminders',
      originalId: reminder.id,
      createdAt: reminder.createdAt,
      updatedAt: reminder.modifiedAt,
      metadata: {
        list: reminder.list,
        location: reminder.location,
        originalReminder: reminder
      }
    };
  }

  // Map Apple Reminders priority to FlowState priority
  mapPriority(applePriority) {
    const priorityMap = {
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };
    return priorityMap[applePriority] || 'medium';
  }

  // Generate tags based on reminder content and list
  generateTags(reminder) {
    const tags = [];
    
    // Add list as a tag
    if (reminder.list) {
      tags.push(reminder.list.toLowerCase());
    }
    
    // Add location-based tags
    if (reminder.location) {
      tags.push('location');
    }
    
    // Add priority-based tags
    if (reminder.priority === 'high') {
      tags.push('urgent');
    }
    
    // Add content-based tags
    const content = (reminder.title + ' ' + (reminder.notes || '')).toLowerCase();
    if (content.includes('call') || content.includes('phone')) {
      tags.push('call');
    }
    if (content.includes('buy') || content.includes('shop')) {
      tags.push('shopping');
    }
    if (content.includes('work') || content.includes('meeting')) {
      tags.push('work');
    }
    if (content.includes('doctor') || content.includes('health')) {
      tags.push('health');
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  // Import reminders as tasks
  async importReminders(options = {}) {
    try {
      const fetchResult = await this.fetchReminders();
      if (!fetchResult.success) {
        throw new Error(fetchResult.error);
      }

      const { reminders } = fetchResult;
      const convertedTasks = reminders.map(reminder => 
        this.convertReminderToTask(reminder)
      );

      // Filter based on import options
      let filteredTasks = convertedTasks;
      
      if (options.completed === false) {
        filteredTasks = filteredTasks.filter(task => task.status !== 'completed');
      }
      
      if (options.list) {
        filteredTasks = filteredTasks.filter(task => 
          task.metadata.list === options.list
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
        totalAvailable: reminders.length
      };
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync changes back to Apple Reminders
  async syncToAppleReminders(task) {
    try {
      if (this.syncStatus !== 'connected') {
        throw new Error('Not connected to Apple Reminders');
      }

      // In a real implementation, this would update the original reminder
      // For now, we'll simulate the sync
      console.log('Syncing task to Apple Reminders:', task);
      
      return {
        success: true,
        syncedAt: new Date()
      };
    } catch (error) {
      console.error('Sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get available reminder lists
  async getReminderLists() {
    try {
      const fetchResult = await this.fetchReminders();
      if (!fetchResult.success) {
        throw new Error(fetchResult.error);
      }

      const lists = [...new Set(this.reminders.map(r => r.list))];
      return {
        success: true,
        lists: lists.map(list => ({
          name: list,
          count: this.reminders.filter(r => r.list === list).length
        }))
      };
    } catch (error) {
      console.error('Failed to get lists:', error);
      return { success: false, error: error.message };
    }
  }

  // Disconnect from Apple Reminders
  disconnect() {
    this.syncStatus = 'disconnected';
    this.reminders = [];
    this.lastSyncTime = null;
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('appleRemindersConnected');
      localStorage.removeItem('appleRemindersLastSync');
    }
  }

  // Get sync status
  getStatus() {
    return {
      connected: this.syncStatus === 'connected',
      lastSync: this.lastSyncTime,
      reminderCount: this.reminders.length,
      supported: this.isSupported
    };
  }
}

export default new AppleRemindersService();
