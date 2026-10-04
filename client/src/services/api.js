const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to make HTTP requests with automatic JSON parsing and auth token header
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('ongo_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (networkError) {
    throw new Error('Unable to connect to OnGo server. Please check your connection.');
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.message || (data?.status === 'error' && data?.message) || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth API
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    request('/auth/me', {
      method: 'GET',
    }),

  // Events & Organizer API
  getPublicEvents: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.city && params.city !== 'All') query.append('city', params.city);
    if (params.timeframe) query.append('timeframe', params.timeframe);
    if (params.date) query.append('date', params.date);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/events${queryString}`, {
      method: 'GET',
    });
  },

  createEvent: (eventData) =>
    request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  getOrganizerEvents: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/events/organizer${queryString}`, {
      method: 'GET',
    });
  },

  getOrganizerStats: () =>
    request('/events/organizer/stats', {
      method: 'GET',
    }),

  getEventById: (id) =>
    request(`/events/${id}`, {
      method: 'GET',
    }),

  updateEvent: (id, eventData) =>
    request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (id) =>
    request(`/events/${id}`, {
      method: 'DELETE',
    }),
};

export default api;
