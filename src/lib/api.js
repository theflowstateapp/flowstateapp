const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const MOCK_MODE = false; // Disabled for real data testing

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    if (MOCK_MODE) {
      return {
        user: {
          id: '1',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          avatar: null,
          preferences: {
            theme: 'light',
            notifications: true,
            emailUpdates: true,
            language: 'en'
          }
        },
        token: 'mock-token'
      };
    }
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    if (MOCK_MODE) {
      return {
        user: {
          id: '1',
          email: credentials.email,
          firstName: 'Demo',
          lastName: 'User',
          avatar: null,
          preferences: {
            theme: 'light',
            notifications: true,
            emailUpdates: true,
            language: 'en'
          }
        },
        token: 'mock-token'
      };
    }
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    if (MOCK_MODE) {
      return { success: true };
    }
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    if (MOCK_MODE) {
      // Return mock user data for development
      return {
        user: {
          id: '1',
          email: 'demo@lifeos.com',
          firstName: 'Demo',
          lastName: 'User',
          avatar: null,
          preferences: {
            theme: 'light',
            notifications: true,
            emailUpdates: true,
            language: 'en'
          }
        }
      };
    }
    return this.request('/auth/me');
  }

  // AI methods
  async getAIFeatures() {
    if (MOCK_MODE) {
      return {
        features: [
          'task_creation',
          'project_planning',
          'goal_setting',
          'habit_tracking',
          'time_management',
          'productivity_insights'
        ]
      };
    }
    return this.request('/ai/features');
  }

  async callAI(featureType, prompt, context = {}) {
    if (MOCK_MODE) {
      return {
        response: `Mock AI response for ${featureType}: ${prompt}`,
        suggestions: ['Mock suggestion 1', 'Mock suggestion 2'],
        confidence: 0.85
      };
    }
    return this.request('/openai', {
      method: 'POST',
      body: JSON.stringify({
        featureType,
        prompt,
        context,
      }),
    });
  }

  // Health check
  async healthCheck() {
    if (MOCK_MODE) {
      return { status: 'ok', mock: true };
    }
    return this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
