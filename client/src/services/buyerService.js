import API from './api';

export const buyerService = {
  searchBuyers: async (searchParams) => {
    const res = await API.post('/buyers/search', searchParams);
    return res.data;
  },

  getBuyers: async () => {
    const res = await API.get('/buyers');
    return res.data;
  },

  getBuyerById: async (id) => {
    const res = await API.get(`/buyers/${id}`);
    return res.data;
  },

  deleteBuyer: async (id) => {
    const res = await API.delete(`/buyers/${id}`);
    return res.data;
  }
};
