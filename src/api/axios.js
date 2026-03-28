// src/api/axios.js
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('token');

// Call this to force logout when token is expired/invalid
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth:logout'));
};

const buildHeaders = (token, extra = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  ...extra,
});

const request = async (method, url, data = null, config = {}) => {
  try {
    const token = getToken();
    const headers = buildHeaders(token, config.headers || {});

    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(`${API_BASE_URL}${url}`, options);

    // Auto-logout on 401 - token is invalid/expired
    if (response.status === 401) {
      handleUnauthorized();
      throw { status: 401, message: 'Session expired. Please login again.', success: false };
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[API] Non-JSON response:', text);
      throw { status: response.status, message: 'Server error. Check Laravel logs.', success: false };
    }

    const result = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: result.message || 'Request failed', errors: result.errors || null, success: false };
    }

    return result;
  } catch (error) {
    console.error(`API ${method} error:`, error);
    if (error.status) throw error;
    throw { message: 'Network error. Please check your connection.', success: false, error };
  }
};

const api = {
  get:    (url, config = {})       => request('GET',    url, null, config),
  post:   (url, data = {}, config = {}) => request('POST',   url, data, config),
  delete: (url, config = {})       => request('DELETE', url, null, config),

  events: {
    getAll:    () => api.get('/events'),
    getBySlug: (slug) => api.get(`/event/${slug}`),
    getLatest:  () => api.get('/events-latest'),
    getFeatured: () => api.get('/events-featured'),
    getTrending: () => api.get('/events-trending'),
  },

  registrations: {
    register:           (eventId) => api.post('/event/register', { event_id: eventId }),
    getMyRegistrations: ()        => api.get('/event/my-registrations'),
    cancel:             (id)      => api.delete(`/event/cancel-registration/${id}`),
  },

  auth: {
    register: (userData)    => api.post('/register', userData),
    login:    (credentials) => api.post('/login', credentials),
    logout:   ()            => api.post('/logout'),
  }
};

export default api;