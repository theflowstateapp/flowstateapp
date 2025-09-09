const axios = require('axios');

class TodoistIntegration {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://api.todoist.com/rest/v2';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Get all projects
  async getProjects() {
    try {
      const response = await this.client.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching Todoist projects:', error);
      throw new Error('Failed to fetch Todoist projects');
    }
  }

  // Get all tasks
  async getTasks(projectId = null) {
    try {
      const params = {};
      if (projectId) {
        params.project_id = projectId;
      }

      const response = await this.client.get('/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching Todoist tasks:', error);
      throw new Error('Failed to fetch Todoist tasks');
    }
  }

  // Create a new task
  async createTask(taskData) {
    try {
      const task = {
        content: taskData.title,
        description: taskData.description,
        project_id: taskData.projectId,
        due_string: taskData.dueDate,
        priority: this.mapPriority(taskData.priority),
        labels: taskData.labels || [],
      };

      const response = await this.client.post('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Error creating Todoist task:', error);
      throw new Error('Failed to create Todoist task');
    }
  }

  // Update an existing task
  async updateTask(taskId, taskData) {
    try {
      const updates = {};
      
      if (taskData.title) updates.content = taskData.title;
      if (taskData.description) updates.description = taskData.description;
      if (taskData.projectId) updates.project_id = taskData.projectId;
      if (taskData.dueDate) updates.due_string = taskData.dueDate;
      if (taskData.priority) updates.priority = this.mapPriority(taskData.priority);
      if (taskData.labels) updates.labels = taskData.labels;

      const response = await this.client.post(`/tasks/${taskId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating Todoist task:', error);
      throw new Error('Failed to update Todoist task');
    }
  }

  // Close (complete) a task
  async closeTask(taskId) {
    try {
      await this.client.post(`/tasks/${taskId}/close`);
      return true;
    } catch (error) {
      console.error('Error closing Todoist task:', error);
      throw new Error('Failed to close Todoist task');
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    try {
      await this.client.delete(`/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting Todoist task:', error);
      throw new Error('Failed to delete Todoist task');
    }
  }

  // Get all labels
  async getLabels() {
    try {
      const response = await this.client.get('/labels');
      return response.data;
    } catch (error) {
      console.error('Error fetching Todoist labels:', error);
      throw new Error('Failed to fetch Todoist labels');
    }
  }

  // Create a new label
  async createLabel(labelData) {
    try {
      const label = {
        name: labelData.name,
        color: labelData.color,
        order: labelData.order,
      };

      const response = await this.client.post('/labels', label);
      return response.data;
    } catch (error) {
      console.error('Error creating Todoist label:', error);
      throw new Error('Failed to create Todoist label');
    }
  }

  // Sync tasks from Todoist to LifeOS
  async syncToLifeOS(userId, lastSyncTime = null) {
    try {
      const tasks = await this.getTasks();
      const projects = await this.getProjects();
      const labels = await this.getLabels();
      
      const syncedTasks = [];

      for (const task of tasks) {
        // Skip tasks that haven't been updated since last sync
        if (lastSyncTime && new Date(task.updated_at) <= new Date(lastSyncTime)) {
          continue;
        }

        const lifeOSTask = {
          id: task.id,
          title: task.content,
          description: task.description,
          status: task.is_completed ? 'completed' : 'pending',
          priority: this.unmapPriority(task.priority),
          dueDate: task.due?.date,
          projectId: task.project_id,
          projectName: projects.find(p => p.id === task.project_id)?.name,
          labels: task.labels,
          source: 'todoist',
          sourceId: task.id,
          userId: userId,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
        };

        // TODO: Save to LifeOS database
        syncedTasks.push(lifeOSTask);
      }

      return {
        success: true,
        tasksSynced: syncedTasks.length,
        tasks: syncedTasks,
        projects: projects,
        labels: labels,
      };
    } catch (error) {
      console.error('Error syncing to LifeOS:', error);
      throw new Error('Failed to sync Todoist to LifeOS');
    }
  }

  // Sync tasks from LifeOS to Todoist
  async syncFromLifeOS(userId, lifeOSTasks) {
    try {
      const syncedTasks = [];

      for (const task of lifeOSTasks) {
        if (task.source === 'todoist' && task.sourceId) {
          // Update existing task
          const updatedTask = await this.updateTask(task.sourceId, {
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            dueDate: task.dueDate,
            priority: task.priority,
            labels: task.labels,
          });
          syncedTasks.push(updatedTask);
        } else {
          // Create new task
          const newTask = await this.createTask({
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            dueDate: task.dueDate,
            priority: task.priority,
            labels: task.labels,
          });
          syncedTasks.push(newTask);
        }
      }

      return {
        success: true,
        tasksSynced: syncedTasks.length,
        tasks: syncedTasks,
      };
    } catch (error) {
      console.error('Error syncing from LifeOS:', error);
      throw new Error('Failed to sync from LifeOS to Todoist');
    }
  }

  // Map LifeOS priority to Todoist priority
  mapPriority(lifeOSPriority) {
    switch (lifeOSPriority) {
      case 'high':
        return 4;
      case 'medium':
        return 3;
      case 'low':
        return 2;
      default:
        return 1;
    }
  }

  // Map Todoist priority to LifeOS priority
  unmapPriority(todoistPriority) {
    switch (todoistPriority) {
      case 4:
        return 'high';
      case 3:
        return 'medium';
      case 2:
        return 'low';
      default:
        return 'low';
    }
  }

  // Get user information
  async getUserInfo() {
    try {
      const response = await this.client.get('/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching Todoist user info:', error);
      throw new Error('Failed to fetch Todoist user info');
    }
  }

  // Check if token is valid
  async validateToken() {
    try {
      await this.getUserInfo();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get task statistics
  async getTaskStats() {
    try {
      const tasks = await this.getTasks();
      const completedTasks = tasks.filter(task => task.is_completed);
      const pendingTasks = tasks.filter(task => !task.is_completed);
      
      return {
        total: tasks.length,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
      };
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw new Error('Failed to fetch task statistics');
    }
  }

  // Get project statistics
  async getProjectStats() {
    try {
      const projects = await this.getProjects();
      const tasks = await this.getTasks();
      
      const projectStats = projects.map(project => {
        const projectTasks = tasks.filter(task => task.project_id === project.id);
        const completedTasks = projectTasks.filter(task => task.is_completed);
        
        return {
          id: project.id,
          name: project.name,
          totalTasks: projectTasks.length,
          completedTasks: completedTasks.length,
          completionRate: projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0,
        };
      });

      return projectStats;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw new Error('Failed to fetch project statistics');
    }
  }
}

module.exports = TodoistIntegration;




