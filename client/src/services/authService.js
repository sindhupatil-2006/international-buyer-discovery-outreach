import API from './api';

export const authService = {
  register: async (userData) => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  }
};
