import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const api = axios.create({
  baseURL: process.env.GATSBY_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/users/reset-password/${token}`, { password }),
};

// Farm API
export const farmAPI = {
  getFarms: (params) => api.get('/farms', { params }),
  getFarm: (id) => api.get(`/farms/${id}`),
  createFarm: (farmData) => api.post('/farms', farmData),
  updateFarm: (id, farmData) => api.put(`/farms/${id}`, farmData),
  deleteFarm: (id) => api.delete(`/farms/${id}`),
  addManager: (id, managerId) => api.post(`/farms/${id}/managers`, { managerId }),
  removeManager: (id, managerId) => api.delete(`/farms/${id}/managers/${managerId}`),
  getFarmsInRadius: (zipcode, distance, params) => api.get(`/farms/radius/${zipcode}/${distance}`, { params }),
};

// Crop API
export const cropAPI = {
  getCrops: (params) => api.get('/crops', { params }),
  getCrop: (id) => api.get(`/crops/${id}`),
  createCrop: (cropData) => api.post('/crops', cropData),
  updateCrop: (id, cropData) => api.put(`/crops/${id}`, cropData),
  deleteCrop: (id) => api.delete(`/crops/${id}`),
  updateCropStatus: (id, status) => api.patch(`/crops/${id}/status`, { status }),
  addGrowthStage: (id, stageData) => api.post(`/crops/${id}/growth-stages`, stageData),
  addIrrigationRecord: (id, irrigationData) => api.post(`/crops/${id}/irrigation`, irrigationData),
  getCropStats: (params) => api.get('/crops/stats', { params }),
};

// Livestock API
export const livestockAPI = {
  getLivestock: (params) => api.get('/livestock', { params }),
  getLivestockById: (id) => api.get(`/livestock/${id}`),
  createLivestock: (livestockData) => api.post('/livestock', livestockData),
  updateLivestock: (id, livestockData) => api.put(`/livestock/${id}`, livestockData),
  deleteLivestock: (id) => api.delete(`/livestock/${id}`),
  addHealthRecord: (id, healthData) => api.post(`/livestock/${id}/health-records`, healthData),
  addProductionRecord: (id, productionData) => api.post(`/livestock/${id}/production`, productionData),
  getLivestockStats: (params) => api.get('/livestock/stats', { params }),
};

// Inventory API
export const inventoryAPI = {
  getInventory: (params) => api.get('/inventory', { params }),
  getInventoryItem: (id) => api.get(`/inventory/${id}`),
  createInventoryItem: (itemData) => api.post('/inventory', itemData),
  updateInventoryItem: (id, itemData) => api.put(`/inventory/${id}`, itemData),
  deleteInventoryItem: (id) => api.delete(`/inventory/${id}`),
  addTransaction: (id, transactionData) => api.post(`/inventory/${id}/transactions`, transactionData),
  getInventoryStats: (params) => api.get('/inventory/stats', { params }),
};

// Paddy Variety API
export const paddyVarietyAPI = {
  getPaddyVarieties: (params) => api.get('/paddy-varieties', { params }),
  getPaddyVariety: (id) => api.get(`/paddy-varieties/${id}`),
  createPaddyVariety: (varietyData) => api.post('/paddy-varieties', varietyData),
  updatePaddyVariety: (id, varietyData) => api.put(`/paddy-varieties/${id}`, varietyData),
  deletePaddyVariety: (id) => api.delete(`/paddy-varieties/${id}`),
};

// Season Plan API
export const seasonPlanAPI = {
  getSeasonPlans: (params) => api.get('/season-plans', { params }),
  getSeasonPlan: (id) => api.get(`/season-plans/${id}`),
  createSeasonPlan: (planData) => api.post('/season-plans', planData),
  updateSeasonPlan: (id, planData) => api.put(`/season-plans/${id}`, planData),
  deleteSeasonPlan: (id) => api.delete(`/season-plans/${id}`),
};

// File upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
