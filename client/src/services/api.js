import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : 'https://agrivalue-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrivalue_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

export const farmAPI = {
  getMyFarms: () => api.get('/farms'),
  createFarm: (data) => api.post('/farms', data),
  deleteFarm: (id) => api.delete(`/farms/${id}`)
};

export const cropAPI = {
  getMyCrops: () => api.get('/crops'),
  createCrop: (data) => api.post('/crops', data),
  deleteCrop: (id) => api.delete(`/crops/${id}`)
};

export const wasteAPI = {
  getMyWaste: () => api.get('/waste'),
  getWasteById: (id) => api.get(`/waste/${id}`),
  createWaste: (formData) => api.post('/waste', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateStatus: (id, status) => api.patch(`/waste/${id}/status`, { status })
};

export const aiAPI = {
  classifyImage: (formData) => api.post('/ai/classify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  generateRecommendations: (data) => api.post('/recommendations/generate', data),
  getPathways: () => api.get('/recommendations/pathways')
};

export const marketplaceAPI = {
  getListings: (params) => api.get('/marketplace', { params }),
  getMyListings: () => api.get('/marketplace/my-listings'),
  getListingById: (id) => api.get(`/marketplace/${id}`),
  createListing: (formData) => api.post('/marketplace', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const processorAPI = {
  getAllProcessors: () => api.get('/processors'),
  getRequirements: () => api.get('/processors/requirements'),
  postRequirement: (data) => api.post('/processors/requirements', data),
  getMyProfile: () => api.get('/processors/profile')
};

export const matchAPI = {
  getMyMatches: () => api.get('/matches'),
  findMatchesForListing: (listingId) => api.post('/matches/find-matches', { listingId }),
  inquireMatch: (id) => api.post(`/matches/${id}/inquire`)
};

export const pickupAPI = {
  getMyPickups: () => api.get('/pickups'),
  createPickup: (data) => api.post('/pickups', data),
  updatePickupStatus: (id, statusData) => api.patch(`/pickups/${id}/status`, statusData)
};

export const analyticsAPI = {
  getDashboardAnalytics: () => api.get('/analytics/dashboard')
};

export default api;
