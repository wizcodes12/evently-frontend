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

      // Handle non-2xx responses
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
      
      // If error is already structured, throw it
      if (error.status) {
        throw error;
      }
      
      // Otherwise, wrap it
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
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(config.headers || {})
      };

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers
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
  }
};

export default api;