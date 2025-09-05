import supabase from '../lib/supabase';

// Centralized Data Management Service for LifeOS
// This ensures all components are properly interlinked and data updates propagate everywhere

class DataInterlinkingService {
  constructor() {
    this.subscribers = new Map();
    this.cache = new Map();
    this.isInitialized = false;
  }

  // Initialize the service
  async initialize(userId) {
    if (this.isInitialized) return;
    
    this.userId = userId;
    await this.loadAllData();
    this.setupRealtimeSubscriptions();
    this.isInitialized = true;
  }

  // Load all user data
  async loadAllData() {
    try {
      const [areas, projects, tasks, resources, archives, goals, habits] = await Promise.all([
        this.getAreas(),
        this.getProjects(),
        this.getTasks(),
        this.getResources(),
        this.getArchives(),
        this.getGoals(),
        this.getHabits()
      ]);

      this.cache.set('areas', areas.data || []);
      this.cache.set('projects', projects.data || []);
      this.cache.set('tasks', tasks.data || []);
      this.cache.set('resources', resources.data || []);
      this.cache.set('archives', archives.data || []);
      this.cache.set('goals', goals.data || []);
      this.cache.set('habits', habits.data || []);

      // Build relationship maps
      this.buildRelationshipMaps();
      
      // Notify all subscribers
      this.notifySubscribers('dataLoaded', {
        areas: this.cache.get('areas'),
        projects: this.cache.get('projects'),
        tasks: this.cache.get('tasks'),
        resources: this.cache.get('resources'),
        archives: this.cache.get('archives'),
        goals: this.cache.get('goals'),
        habits: this.cache.get('habits')
      });

    } catch (error) {
      // Error loading data - will be handled by components
    }
  }

  // Build relationship maps for quick lookups
  buildRelationshipMaps() {
    const projects = this.cache.get('projects') || [];
    const tasks = this.cache.get('tasks') || [];
    const areas = this.cache.get('areas') || [];
    const resources = this.cache.get('resources') || [];

    // Project -> Tasks mapping
    const projectTasksMap = new Map();
    tasks.forEach(task => {
      if (task.project_id) {
        if (!projectTasksMap.has(task.project_id)) {
          projectTasksMap.set(task.project_id, []);
        }
        projectTasksMap.get(task.project_id).push(task);
      }
    });

    // Area -> Projects mapping
    const areaProjectsMap = new Map();
    projects.forEach(project => {
      if (project.area_id) {
        if (!areaProjectsMap.has(project.area_id)) {
          areaProjectsMap.set(project.area_id, []);
        }
        areaProjectsMap.get(project.area_id).push(project);
      }
    });

    // Area -> Resources mapping
    const areaResourcesMap = new Map();
    resources.forEach(resource => {
      if (resource.area_id) {
        if (!areaResourcesMap.has(resource.area_id)) {
          areaResourcesMap.set(resource.area_id, []);
        }
        areaResourcesMap.get(resource.area_id).push(resource);
      }
    });

    this.cache.set('projectTasksMap', projectTasksMap);
    this.cache.set('areaProjectsMap', areaProjectsMap);
    this.cache.set('areaResourcesMap', areaResourcesMap);
  }

  // Subscribe to data changes
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }
    this.subscribers.get(key).push(callback);
  }

  // Unsubscribe from data changes
  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      const callbacks = this.subscribers.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Notify subscribers of changes
  notifySubscribers(key, data) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // Error in subscriber callback - will be handled by components
        }
      });
    }
  }

  // Setup realtime subscriptions
  setupRealtimeSubscriptions() {
    // Subscribe to all table changes
    const tables = ['areas', 'projects', 'tasks', 'resources', 'archives', 'goals', 'habits'];
    
    tables.forEach(table => {
      supabase
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: table,
            filter: `user_id=eq.${this.userId}`
          }, 
          (payload) => {
            this.handleRealtimeChange(table, payload);
          }
        )
        .subscribe();
    });
  }

  // Handle realtime changes
  handleRealtimeChange(table, payload) {
    const currentData = this.cache.get(table) || [];
    let newData = [...currentData];

    switch (payload.eventType) {
      case 'INSERT':
        newData.unshift(payload.new);
        break;
      case 'UPDATE':
        newData = newData.map(item => 
          item.id === payload.new.id ? payload.new : item
        );
        break;
      case 'DELETE':
        newData = newData.filter(item => item.id !== payload.old.id);
        break;
      default:
        // Handle other event types if needed
        break;
    }

    this.cache.set(table, newData);
    this.buildRelationshipMaps();
    
    // Notify subscribers
    this.notifySubscribers(`${table}Changed`, newData);
    this.notifySubscribers('dataChanged', { table, data: newData });
  }

  // CRUD Operations with automatic interlinking

  // Areas
  async getAreas() {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async createArea(areaData) {
    const { data, error } = await supabase
      .from('areas')
      .insert([{ ...areaData, user_id: this.userId }])
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('areaCreated', data);
    }
    return { data, error };
  }

  async updateArea(id, updates) {
    const { data, error } = await supabase
      .from('areas')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('areaUpdated', data);
    }
    return { data, error };
  }

  async deleteArea(id) {
    const { data, error } = await supabase
      .from('areas')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (!error) {
      this.notifySubscribers('areaDeleted', { id });
    }
    return { data, error };
  }

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        areas:area_id(name, color, icon),
        tasks:tasks(id, name, status, priority, due_date)
      `)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...projectData, user_id: this.userId }])
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('projectCreated', data);
    }
    return { data, error };
  }

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('projectUpdated', data);
    }
    return { data, error };
  }

  async deleteProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (!error) {
      this.notifySubscribers('projectDeleted', { id });
    }
    return { data, error };
  }

  // Tasks
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        projects:project_id(title, status, area_id),
        areas:life_area_id(name, color, icon)
      `)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async createTask(taskData) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, user_id: this.userId }])
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('taskCreated', data);
    }
    return { data, error };
  }

  async updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('taskUpdated', data);
    }
    return { data, error };
  }

  async deleteTask(id) {
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (!error) {
      this.notifySubscribers('taskDeleted', { id });
    }
    return { data, error };
  }

  // Resources
  async getResources() {
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        areas:area_id(name, color, icon),
        projects:project_id(title, status)
      `)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async createResource(resourceData) {
    const { data, error } = await supabase
      .from('resources')
      .insert([{ ...resourceData, user_id: this.userId }])
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('resourceCreated', data);
    }
    return { data, error };
  }

  async updateResource(id, updates) {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('resourceUpdated', data);
    }
    return { data, error };
  }

  async deleteResource(id) {
    const { data, error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (!error) {
      this.notifySubscribers('resourceDeleted', { id });
    }
    return { data, error };
  }

  // Archives
  async getArchives() {
    const { data, error } = await supabase
      .from('archives')
      .select('*')
      .eq('user_id', this.userId)
      .order('archived_at', { ascending: false });
    return { data, error };
  }

  async archiveItem(itemId, itemType, reason = 'Completed') {
    // Get the original item
    let originalItem;
    switch (itemType) {
      case 'project':
        const { data: project } = await supabase
          .from('projects')
          .select('*')
          .eq('id', itemId)
          .single();
        originalItem = project;
        break;
      case 'task':
        const { data: task } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', itemId)
          .single();
        originalItem = task;
        break;
      case 'resource':
        const { data: resource } = await supabase
          .from('resources')
          .select('*')
          .eq('id', itemId)
          .single();
        originalItem = resource;
        break;
      default:
        // Handle other item types if needed
        break;
    }

    if (!originalItem) {
      return { data: null, error: { message: 'Item not found' } };
    }

    // Create archive entry
    const { data, error } = await supabase
      .from('archives')
      .insert([{
        user_id: this.userId,
        original_id: itemId,
        original_type: itemType,
        title: originalItem.title || originalItem.name,
        description: originalItem.description,
        archive_reason: reason
      }])
      .select()
      .single();

    if (!error) {
      // Delete the original item
      await supabase
        .from(itemType + 's')
        .delete()
        .eq('id', itemId);
      
      this.notifySubscribers('itemArchived', { itemId, itemType, data });
    }

    return { data, error };
  }

  // Goals
  async getGoals() {
    const { data, error } = await supabase
      .from('goals')
      .select(`
        *,
        areas:area_id(name, color, icon)
      `)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async createGoal(goalData) {
    const { data, error } = await supabase
      .from('goals')
      .insert([{ ...goalData, user_id: this.userId }])
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('goalCreated', data);
    }
    return { data, error };
  }

  async updateGoal(id, updates) {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('goalUpdated', data);
    }
    return { data, error };
  }

  async deleteGoal(id) {
    const { data, error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (!error) {
      this.notifySubscribers('goalDeleted', { id });
    }
    return { data, error };
  }

  // Habits
  async getHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select(`
        *,
        areas:area_id(name, color, icon)
      `)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async createHabit(habitData) {
    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...habitData, user_id: this.userId }])
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('habitCreated', data);
    }
    return { data, error };
  }

  async updateHabit(id, updates) {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (!error) {
      this.notifySubscribers('habitUpdated', data);
    }
    return { data, error };
  }

  async deleteHabit(id) {
    const { data, error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (!error) {
      this.notifySubscribers('habitDeleted', { id });
    }
    return { data, error };
  }

  // Get related data for any item
  getRelatedData(itemId, itemType) {
    const relatedData = {
      projects: [],
      tasks: [],
      resources: [],
      goals: [],
      habits: []
    };

    switch (itemType) {
      case 'area':
        const areaProjectsMap = this.cache.get('areaProjectsMap');
        const areaResourcesMap = this.cache.get('areaResourcesMap');
        
        if (areaProjectsMap && areaProjectsMap.has(itemId)) {
          relatedData.projects = areaProjectsMap.get(itemId);
        }
        if (areaResourcesMap && areaResourcesMap.has(itemId)) {
          relatedData.resources = areaResourcesMap.get(itemId);
        }
        break;
        
      case 'project':
        const projectTasksMap = this.cache.get('projectTasksMap');
        if (projectTasksMap && projectTasksMap.has(itemId)) {
          relatedData.tasks = projectTasksMap.get(itemId);
        }
        break;
        
      default:
        // Handle other item types if needed
        break;
    }

    return relatedData;
  }

  // Get cached data
  getCachedData(type) {
    return this.cache.get(type) || [];
  }

  // Get all data
  getAllData() {
    return {
      areas: this.cache.get('areas') || [],
      projects: this.cache.get('projects') || [],
      tasks: this.cache.get('tasks') || [],
      resources: this.cache.get('resources') || [],
      archives: this.cache.get('archives') || [],
      goals: this.cache.get('goals') || [],
      habits: this.cache.get('habits') || []
    };
  }
}

// Create singleton instance
const dataService = new DataInterlinkingService();

export default dataService;
