// Data Service Layer - Real Supabase Integration
// This replaces all localStorage operations with real database operations

import { supabase } from './supabase';

class DataService {
  constructor() {
    this.currentUser = null;
    this.isOnline = navigator.onLine;
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      console.log('Auth state changed:', event, this.currentUser?.email);
    });
    
    // Listen for online/offline changes
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Get current user ID
  getUserId() {
    return this.currentUser?.id || 'demo-user-1';
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Generic error handler
  handleError(error, operation) {
    console.error(`DataService ${operation} error:`, error);
    return {
      success: false,
      error: error.message || 'An error occurred',
      data: null
    };
  }

  // Generic success handler
  handleSuccess(data, message = 'Operation successful') {
    return {
      success: true,
      data,
      message
    };
  }

  // ==================== AREAS ====================
  
  async getAreas() {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('user_id', userId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, 'getAreas');
    }
  }

  async createArea(areaData) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('areas')
        .insert([{
          user_id: userId,
          name: areaData.name,
          description: areaData.description,
          color: areaData.color || '#3B82F6',
          icon: areaData.icon || 'folder',
          order_index: areaData.order_index || 0
        }])
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Area created successfully');
    } catch (error) {
      return this.handleError(error, 'createArea');
    }
  }

  async updateArea(id, updates) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('areas')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Area updated successfully');
    } catch (error) {
      return this.handleError(error, 'updateArea');
    }
  }

  async deleteArea(id) {
    try {
      const userId = this.getUserId();
      const { error } = await supabase
        .from('areas')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return this.handleSuccess(null, 'Area deleted successfully');
    } catch (error) {
      return this.handleError(error, 'deleteArea');
    }
  }

  // ==================== PROJECTS ====================
  
  async getProjects() {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          areas:area_id(name, color, icon)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, 'getProjects');
    }
  }

  async createProject(projectData) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: userId,
          area_id: projectData.area_id,
          title: projectData.title,
          description: projectData.description,
          status: projectData.status || 'active',
          priority: projectData.priority || 'medium',
          due_date: projectData.due_date,
          tags: projectData.tags || [],
          metadata: projectData.metadata || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Project created successfully');
    } catch (error) {
      return this.handleError(error, 'createProject');
    }
  }

  async updateProject(id, updates) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Project updated successfully');
    } catch (error) {
      return this.handleError(error, 'updateProject');
    }
  }

  async deleteProject(id) {
    try {
      const userId = this.getUserId();
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return this.handleSuccess(null, 'Project deleted successfully');
    } catch (error) {
      return this.handleError(error, 'deleteProject');
    }
  }

  // ==================== TASKS ====================
  
  async getTasks() {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:project_id(title, status),
          areas:area_id(name, color, icon)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, 'getTasks');
    }
  }

  async createTask(taskData) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: userId,
          project_id: taskData.project_id,
          area_id: taskData.area_id,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status || 'not_started',
          priority: taskData.priority || 'medium',
          due_date: taskData.due_date,
          estimated_duration: taskData.estimated_duration,
          tags: taskData.tags || [],
          metadata: taskData.metadata || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Task created successfully');
    } catch (error) {
      return this.handleError(error, 'createTask');
    }
  }

  async updateTask(id, updates) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Task updated successfully');
    } catch (error) {
      return this.handleError(error, 'updateTask');
    }
  }

  async deleteTask(id) {
    try {
      const userId = this.getUserId();
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return this.handleSuccess(null, 'Task deleted successfully');
    } catch (error) {
      return this.handleError(error, 'deleteTask');
    }
  }

  // ==================== INBOX ITEMS ====================
  
  async getInboxItems() {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('inbox_items')
        .select('*')
        .eq('user_id', userId)
        .eq('processed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, 'getInboxItems');
    }
  }

  async createInboxItem(itemData) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('inbox_items')
        .insert([{
          user_id: userId,
          content: itemData.content,
          type: itemData.type || 'task',
          priority: itemData.priority || 'medium',
          metadata: itemData.metadata || {}
        }])
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Inbox item created successfully');
    } catch (error) {
      return this.handleError(error, 'createInboxItem');
    }
  }

  async processInboxItem(id, processedData) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('inbox_items')
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          metadata: processedData.metadata || {}
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Inbox item processed successfully');
    } catch (error) {
      return this.handleError(error, 'processInboxItem');
    }
  }

  // ==================== HABITS ====================
  
  async getHabits() {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, 'getHabits');
    }
  }

  async createHabit(habitData) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('habits')
        .insert([{
          user_id: userId,
          title: habitData.title,
          description: habitData.description,
          frequency: habitData.frequency || 'daily',
          target_count: habitData.target_count || 1,
          color: habitData.color || '#10B981',
          icon: habitData.icon || 'target'
        }])
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Habit created successfully');
    } catch (error) {
      return this.handleError(error, 'createHabit');
    }
  }

  async trackHabit(habitId, date = new Date().toISOString().split('T')[0]) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('habit_entries')
        .upsert([{
          habit_id: habitId,
          user_id: userId,
          date: date,
          count: 1
        }], {
          onConflict: 'habit_id,date'
        })
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Habit tracked successfully');
    } catch (error) {
      return this.handleError(error, 'trackHabit');
    }
  }

  // ==================== JOURNAL ====================
  
  async getJournalEntries() {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return this.handleSuccess(data || []);
    } catch (error) {
      return this.handleError(error, 'getJournalEntries');
    }
  }

  async createJournalEntry(entryData) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: userId,
          title: entryData.title,
          content: entryData.content,
          mood: entryData.mood,
          tags: entryData.tags || [],
          is_private: entryData.is_private !== false
        }])
        .select()
        .single();

      if (error) throw error;
      return this.handleSuccess(data, 'Journal entry created successfully');
    } catch (error) {
      return this.handleError(error, 'createJournalEntry');
    }
  }

  // ==================== ANALYTICS ====================
  
  async trackEvent(eventType, eventData = {}) {
    try {
      const userId = this.getUserId();
      const { data, error } = await supabase
        .from('user_analytics')
        .insert([{
          user_id: userId,
          event_type: eventType,
          event_data: eventData,
          page_url: window.location.href,
          user_agent: navigator.userAgent
        }]);

      if (error) throw error;
      return this.handleSuccess(data, 'Event tracked successfully');
    } catch (error) {
      return this.handleError(error, 'trackEvent');
    }
  }

  // ==================== OFFLINE SUPPORT ====================
  
  async syncOfflineData() {
    if (!this.isOnline) return;
    
    try {
      // Get offline data from localStorage
      const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
      
      for (const item of offlineData) {
        // Process each offline item
        await this.processOfflineItem(item);
      }
      
      // Clear offline data after successful sync
      localStorage.removeItem('offlineData');
      console.log('Offline data synced successfully');
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  async processOfflineItem(item) {
    try {
      switch (item.type) {
        case 'task':
          await this.createTask(item.data);
          break;
        case 'project':
          await this.createProject(item.data);
          break;
        case 'habit':
          await this.trackHabit(item.data.habit_id, item.data.date);
          break;
        case 'journal':
          await this.createJournalEntry(item.data);
          break;
        default:
          console.warn('Unknown offline item type:', item.type);
      }
    } catch (error) {
      console.error('Failed to process offline item:', error);
    }
  }

  // Store data offline when not connected
  storeOffline(type, data) {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
      offlineData.push({
        type,
        data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('offlineData', JSON.stringify(offlineData));
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }

  // ==================== MIGRATION FROM LOCALSTORAGE ====================
  
  async migrateFromLocalStorage() {
    try {
      console.log('Starting migration from localStorage to Supabase...');
      
      // Migrate areas
      const areas = JSON.parse(localStorage.getItem('areas') || '[]');
      for (const area of areas) {
        await this.createArea(area);
      }
      
      // Migrate projects
      const projects = JSON.parse(localStorage.getItem('projects') || '[]');
      for (const project of projects) {
        await this.createProject(project);
      }
      
      // Migrate tasks
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      for (const task of tasks) {
        await this.createTask(task);
      }
      
      // Migrate habits
      const habits = JSON.parse(localStorage.getItem('habits') || '[]');
      for (const habit of habits) {
        await this.createHabit(habit);
      }
      
      // Clear localStorage after successful migration
      localStorage.removeItem('areas');
      localStorage.removeItem('projects');
      localStorage.removeItem('tasks');
      localStorage.removeItem('habits');
      
      console.log('Migration completed successfully');
      return this.handleSuccess(null, 'Migration completed successfully');
    } catch (error) {
      return this.handleError(error, 'migrateFromLocalStorage');
    }
  }
}

// Create singleton instance
const dataService = new DataService();

export default dataService;
