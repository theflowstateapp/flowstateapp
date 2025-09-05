// Advanced Search and Filtering System
export const AdvancedSearch = {
  // Search across multiple entities
  searchAll: (query, entities = ['tasks', 'projects', 'notes']) => {
    const results = {
      tasks: [],
      projects: [],
      notes: [],
      total: 0
    };

    if (entities.includes('tasks')) {
      results.tasks = AdvancedSearch.searchTasks(query);
    }

    if (entities.includes('projects')) {
      results.projects = AdvancedSearch.searchProjects(query);
    }

    if (entities.includes('notes')) {
      results.notes = AdvancedSearch.searchNotes(query);
    }

    results.total = results.tasks.length + results.projects.length + results.notes.length;
    return results;
  },

  // Search tasks
  searchTasks: (query) => {
    try {
      const savedTasks = localStorage.getItem('tasks') || '[]';
      const tasks = JSON.parse(savedTasks);
      const lowerQuery = query.toLowerCase();

      return tasks.filter(task => {
        return (
          task.title?.toLowerCase().includes(lowerQuery) ||
          task.description?.toLowerCase().includes(lowerQuery) ||
          task.type?.toLowerCase().includes(lowerQuery) ||
          task.priority?.toLowerCase().includes(lowerQuery) ||
          task.context?.toLowerCase().includes(lowerQuery) ||
          task.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          task.assignee?.toLowerCase().includes(lowerQuery)
        );
      });
    } catch (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
  },

  // Search projects
  searchProjects: (query) => {
    try {
      const savedProjects = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(savedProjects);
      const lowerQuery = query.toLowerCase();

      return projects.filter(project => {
        return (
          project.title?.toLowerCase().includes(lowerQuery) ||
          project.description?.toLowerCase().includes(lowerQuery) ||
          project.type?.toLowerCase().includes(lowerQuery) ||
          project.category?.toLowerCase().includes(lowerQuery) ||
          project.area?.toLowerCase().includes(lowerQuery) ||
          project.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          project.owner?.toLowerCase().includes(lowerQuery) ||
          project.team_members?.some(member => member.toLowerCase().includes(lowerQuery))
        );
      });
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
  },

  // Search notes
  searchNotes: (query) => {
    try {
      const savedNotes = localStorage.getItem('notes') || '[]';
      const notes = JSON.parse(savedNotes);
      const lowerQuery = query.toLowerCase();

      return notes.filter(note => {
        return (
          note.title?.toLowerCase().includes(lowerQuery) ||
          note.content?.toLowerCase().includes(lowerQuery) ||
          note.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          note.category?.toLowerCase().includes(lowerQuery)
        );
      });
    } catch (error) {
      console.error('Error searching notes:', error);
      return [];
    }
  },

  // Advanced filtering with multiple criteria
  filterTasks: (filters) => {
    try {
      const savedTasks = localStorage.getItem('tasks') || '[]';
      let tasks = JSON.parse(savedTasks);

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        tasks = tasks.filter(task => task.status === filters.status);
      }

      if (filters.priority && filters.priority !== 'all') {
        tasks = tasks.filter(task => task.priority === filters.priority);
      }

      if (filters.type && filters.type !== 'all') {
        tasks = tasks.filter(task => task.type === filters.type);
      }

      if (filters.context && filters.context !== 'all') {
        tasks = tasks.filter(task => task.context === filters.context);
      }

      if (filters.assignee && filters.assignee !== 'all') {
        tasks = tasks.filter(task => task.assignee === filters.assignee);
      }

      if (filters.dateRange) {
        const { startDate, endDate } = filters.dateRange;
        if (startDate && endDate) {
          tasks = tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate >= new Date(startDate) && taskDate <= new Date(endDate);
          });
        }
      }

      if (filters.tags && filters.tags.length > 0) {
        tasks = tasks.filter(task => 
          task.tags && filters.tags.some(tag => task.tags.includes(tag))
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        tasks = tasks.filter(task => 
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
        );
      }

      return tasks;
    } catch (error) {
      console.error('Error filtering tasks:', error);
      return [];
    }
  },

  // Advanced filtering for projects
  filterProjects: (filters) => {
    try {
      const savedProjects = localStorage.getItem('projects') || '[]';
      let projects = JSON.parse(savedProjects);

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        projects = projects.filter(project => project.status === filters.status);
      }

      if (filters.category && filters.category !== 'all') {
        projects = projects.filter(project => project.category === filters.category);
      }

      if (filters.type && filters.type !== 'all') {
        projects = projects.filter(project => project.type === filters.type);
      }

      if (filters.area && filters.area !== 'all') {
        projects = projects.filter(project => project.area === filters.area);
      }

      if (filters.owner && filters.owner !== 'all') {
        projects = projects.filter(project => project.owner === filters.owner);
      }

      if (filters.dateRange) {
        const { startDate, endDate } = filters.dateRange;
        if (startDate && endDate) {
          projects = projects.filter(project => {
            const projectDate = new Date(project.due_date);
            return projectDate >= new Date(startDate) && projectDate <= new Date(endDate);
          });
        }
      }

      if (filters.budgetRange) {
        const { minBudget, maxBudget } = filters.budgetRange;
        projects = projects.filter(project => {
          const budget = parseFloat(project.budget) || 0;
          return budget >= minBudget && budget <= maxBudget;
        });
      }

      if (filters.tags && filters.tags.length > 0) {
        projects = projects.filter(project => 
          project.tags && filters.tags.some(tag => project.tags.includes(tag))
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        projects = projects.filter(project => 
          project.title?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query)
        );
      }

      return projects;
    } catch (error) {
      console.error('Error filtering projects:', error);
      return [];
    }
  },

  // Get available filter options
  getFilterOptions: (entityType) => {
    try {
      let items = [];
      
      if (entityType === 'tasks') {
        const savedTasks = localStorage.getItem('tasks') || '[]';
        items = JSON.parse(savedTasks);
      } else if (entityType === 'projects') {
        const savedProjects = localStorage.getItem('projects') || '[]';
        items = JSON.parse(savedProjects);
      }

      const options = {
        statuses: [...new Set(items.map(item => item.status).filter(Boolean))],
        priorities: [...new Set(items.map(item => item.priority).filter(Boolean))],
        types: [...new Set(items.map(item => item.type).filter(Boolean))],
        contexts: [...new Set(items.map(item => item.context).filter(Boolean))],
        assignees: [...new Set(items.map(item => item.assignee).filter(Boolean))],
        owners: [...new Set(items.map(item => item.owner).filter(Boolean))],
        categories: [...new Set(items.map(item => item.category).filter(Boolean))],
        areas: [...new Set(items.map(item => item.area).filter(Boolean))],
        tags: [...new Set(items.flatMap(item => item.tags || []))]
      };

      return options;
    } catch (error) {
      console.error('Error getting filter options:', error);
      return {
        statuses: [],
        priorities: [],
        types: [],
        contexts: [],
        assignees: [],
        owners: [],
        categories: [],
        areas: [],
        tags: []
      };
    }
  },

  // Save search history
  saveSearchHistory: (query, results) => {
    try {
      const history = AdvancedSearch.getSearchHistory();
      const searchRecord = {
        query,
        results: results.total,
        timestamp: new Date().toISOString()
      };

      history.unshift(searchRecord);
      
      // Keep only last 50 searches
      if (history.length > 50) {
        history.splice(50);
      }

      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  },

  // Get search history
  getSearchHistory: () => {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  },

  // Clear search history
  clearSearchHistory: () => {
    try {
      localStorage.removeItem('searchHistory');
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  },

  // Get popular searches
  getPopularSearches: () => {
    try {
      const history = AdvancedSearch.getSearchHistory();
      const searchCounts = {};

      history.forEach(record => {
        const query = record.query.toLowerCase();
        searchCounts[query] = (searchCounts[query] || 0) + 1;
      });

      return Object.entries(searchCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([query, count]) => ({ query, count }));
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return [];
    }
  },

  // Smart search suggestions
  getSearchSuggestions: (partialQuery) => {
    if (!partialQuery || partialQuery.length < 2) return [];

    try {
      const suggestions = [];
      const lowerQuery = partialQuery.toLowerCase();

      // Get recent searches
      const history = AdvancedSearch.getSearchHistory();
      const recentSearches = history
        .filter(record => record.query.toLowerCase().includes(lowerQuery))
        .slice(0, 5)
        .map(record => ({ text: record.query, type: 'recent' }));

      // Get popular searches
      const popularSearches = AdvancedSearch.getPopularSearches()
        .filter(item => item.query.includes(lowerQuery))
        .slice(0, 3)
        .map(item => ({ text: item.query, type: 'popular' }));

      // Get tag suggestions
      const allTags = AdvancedSearch.getFilterOptions('tasks').tags
        .concat(AdvancedSearch.getFilterOptions('projects').tags)
        .filter(tag => tag.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
        .map(tag => ({ text: `#${tag}`, type: 'tag' }));

      suggestions.push(...recentSearches, ...popularSearches, ...allTags);
      
      return suggestions.slice(0, 10);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }
};
