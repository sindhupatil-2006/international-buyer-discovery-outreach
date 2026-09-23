import API from './api';

export const outreachService = {
  sendOutreach: async (formData) => {
    const res = await API.post('/outreach/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  generateAiPitch: async (pitchData) => {
    const res = await API.post('/outreach/generate', pitchData);
    return res.data;
  },

  getOutreachHistory: async () => {
    const res = await API.get('/outreach');
    return res.data;
  },

  getOutreachById: async (id) => {
    const res = await API.get(`/outreach/${id}`);
    return res.data;
  },

  deleteOutreach: async (id) => {
    const res = await API.delete(`/outreach/${id}`);
    return res.data;
  }
};
