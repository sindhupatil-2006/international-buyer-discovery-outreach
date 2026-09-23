import API from './api';

export const settingsService = {
  getSettings: async () => {
    const res = await API.get('/settings');
    return res.data;
  },

  updateSettings: async (settingsData) => {
    const res = await API.put('/settings', settingsData);
    return res.data;
  }
};
