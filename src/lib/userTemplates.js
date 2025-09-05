// User-Defined Templates System
export const UserTemplates = {
  // Template storage key
  STORAGE_KEY: 'userTemplates',
  
  // Get all user templates
  getAllTemplates: () => {
    try {
      const saved = localStorage.getItem(UserTemplates.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load user templates:', error);
      return [];
    }
  },

  // Save all templates
  saveAllTemplates: (templates) => {
    try {
      localStorage.setItem(UserTemplates.STORAGE_KEY, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save user templates:', error);
    }
  },

  // Create a new template
  createTemplate: (templateData) => {
    const templates = UserTemplates.getAllTemplates();
    const newTemplate = {
      id: Date.now().toString(),
      name: templateData.name,
      description: templateData.description,
      category: templateData.category,
      icon: templateData.icon,
      fields: templateData.fields,
      patterns: templateData.patterns,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };
    
    templates.push(newTemplate);
    UserTemplates.saveAllTemplates(templates);
    return newTemplate;
  },

  // Update a template
  updateTemplate: (id, updates) => {
    const templates = UserTemplates.getAllTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index !== -1) {
      templates[index] = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      UserTemplates.saveAllTemplates(templates);
      return templates[index];
    }
    
    return null;
  },

  // Delete a template
  deleteTemplate: (id) => {
    const templates = UserTemplates.getAllTemplates();
    const filtered = templates.filter(t => t.id !== id);
    UserTemplates.saveAllTemplates(filtered);
    return filtered;
  },

  // Get template by ID
  getTemplateById: (id) => {
    const templates = UserTemplates.getAllTemplates();
    return templates.find(t => t.id === id);
  },

  // Increment usage count
  incrementUsage: (id) => {
    const templates = UserTemplates.getAllTemplates();
    const template = templates.find(t => t.id === id);
    
    if (template) {
      template.usageCount++;
      template.updatedAt = new Date().toISOString();
      UserTemplates.saveAllTemplates(templates);
    }
  },

  // Get templates by category
  getTemplatesByCategory: (category) => {
    const templates = UserTemplates.getAllTemplates();
    return templates.filter(t => t.category === category);
  },

  // Search templates
  searchTemplates: (query) => {
    const templates = UserTemplates.getAllTemplates();
    const lowerQuery = query.toLowerCase();
    
    return templates.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery) ||
      t.patterns.some(p => p.toLowerCase().includes(lowerQuery))
    );
  },

  // Get most used templates
  getMostUsedTemplates: (limit = 5) => {
    const templates = UserTemplates.getAllTemplates();
    return templates
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  },

  // Get recent templates
  getRecentTemplates: (limit = 5) => {
    const templates = UserTemplates.getAllTemplates();
    return templates
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  // Validate template data
  validateTemplate: (templateData) => {
    const errors = [];
    
    if (!templateData.name || templateData.name.trim().length === 0) {
      errors.push('Template name is required');
    }
    
    if (!templateData.category || templateData.category.trim().length === 0) {
      errors.push('Template category is required');
    }
    
    if (!templateData.fields || Object.keys(templateData.fields).length === 0) {
      errors.push('At least one field is required');
    }
    
    if (!templateData.patterns || templateData.patterns.length === 0) {
      errors.push('At least one pattern is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get template suggestions based on input
  getSuggestions: (input) => {
    const templates = UserTemplates.getAllTemplates();
    const lowerInput = input.toLowerCase();
    const suggestions = [];
    
    templates.forEach(template => {
      const matchScore = template.patterns.reduce((score, pattern) => {
        if (lowerInput.includes(pattern.toLowerCase())) {
          return score + 1;
        }
        return score;
      }, 0);
      
      if (matchScore > 0) {
        suggestions.push({
          ...template,
          matchScore,
          confidence: Math.min(matchScore / template.patterns.length, 1)
        });
      }
    });
    
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  },

  // Apply template to form data
  applyTemplate: (template, currentFormData) => {
    const updatedData = { ...currentFormData };
    
    for (const [field, value] of Object.entries(template.fields)) {
      // Only apply if field is empty or template has higher priority
      if (!updatedData[field] || updatedData[field] === '' || 
          (field === 'priority' && template.fields.priority === 'Critical')) {
        updatedData[field] = value;
      }
    }
    
    // Increment usage count
    UserTemplates.incrementUsage(template.id);
    
    return updatedData;
  },

  // Get template categories
  getCategories: () => {
    const templates = UserTemplates.getAllTemplates();
    const categories = [...new Set(templates.map(t => t.category))];
    return categories.sort();
  },

  // Export templates
  exportTemplates: () => {
    const templates = UserTemplates.getAllTemplates();
    const dataStr = JSON.stringify(templates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `lifeos-templates-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  // Import templates
  importTemplates: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const templates = JSON.parse(e.target.result);
          
          if (!Array.isArray(templates)) {
            reject(new Error('Invalid template file format'));
            return;
          }
          
          // Validate each template
          const validTemplates = templates.filter(template => {
            const validation = UserTemplates.validateTemplate(template);
            return validation.isValid;
          });
          
          // Merge with existing templates
          const existingTemplates = UserTemplates.getAllTemplates();
          const mergedTemplates = [...existingTemplates, ...validTemplates];
          
          UserTemplates.saveAllTemplates(mergedTemplates);
          resolve(validTemplates.length);
        } catch (error) {
          reject(new Error('Failed to parse template file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read template file'));
      };
      
      reader.readAsText(file);
    });
  }
};
