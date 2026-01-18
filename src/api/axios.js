// src/api/axios.js
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = {
  // POST Request
  post: async (url, data = {}, config = {}) => {
    try {
      const token = localStorage.getItem('token');

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(config.headers || {})
      };

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: result.message || 'Request failed',
          errors: result.errors || null,
          success: false
        };
      }

      return result;

    } catch (error) {
      console.error('API POST error:', error);
      
      if (error.status) {
        throw error;
      }
      
      throw {
        message: 'Network error. Please check your connection.',
        success: false,
        error
      };
    }
  },

  // GET Request
  get: async (url, config = {}) => {
    try {
      const token = localStorage.getItem('token');

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(config.headers || {})
      };

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers
      });

      // Log raw response for debugging
      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Content-Type:', contentType);

      // Check if response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw {
          status: response.status,
          message: 'Server returned non-JSON response. Check Laravel logs.',
          success: false
        };
      }

      const result = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: result.message || 'Request failed',
          errors: result.errors || null,
          success: false
        };
      }

      return result;

    } catch (error) {
      console.error('API GET error:', error);
      
      if (error.status) {
        throw error;
      }
      
      throw {
        message: 'Network error. Please check your connection.',
        success: false,
        error
      };
    }
  },

  // Event API Endpoints
  events: {
    // Get all events
    getAll: async () => {
      return await api.get('/events');
    },

    // Get event by slug
    getBySlug: async (slug) => {
      return await api.get(`/event/${slug}`);
    },

    // Get latest events
    getLatest: async () => {
      return await api.get('/events-latest');
    },

    // Get featured events
    getFeatured: async () => {
      return await api.get('/events-featured');
    },

    // Get trending events
    getTrending: async () => {
      return await api.get('/events-trending');
    }
  },

  // Auth API Endpoints
  auth: {
    register: async (userData) => {
      return await api.post('/register', userData);
    },

    login: async (credentials) => {
      return await api.post('/login', credentials);
    },

    logout: async () => {
      return await api.post('/logout');
    }
  }
};

export default api;