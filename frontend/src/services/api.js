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
    // Don't show toast errors for login/register endpoints - let the auth context handle them
    const isAuthEndpoint = error.config?.url?.includes('/users/login') || error.config?.url?.includes('/users/register');
    
    if (error.response?.status === 401) {
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    } else if (error.response?.status === 403) {
      if (!isAuthEndpoint) {
        toast.error('You do not have permission to perform this action.');
      }
    } else if (error.response?.status >= 500) {
      if (!isAuthEndpoint) {
        toast.error('Server error. Please try again later.');
      }
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
  uploadAvatar: (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAvatarUrl: (filename) => filename ? `${api.defaults.baseURL}/users/avatar/${filename.split('/').pop()}` : null,
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
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
  // New district-related endpoints
  getDistricts: () => api.get('/farms/districts'),
  getCultivationZoneDetails: (zoneCode) => api.get(`/farms/cultivation-zones/${zoneCode}`),
  getFarmsByDistrict: (district, params) => api.get(`/farms/by-district/${district}`, { params }),
  getFarmsByZone: (zoneCode, params) => api.get(`/farms/by-zone/${zoneCode}`, { params }),
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
  updateFertilizerImplementation: (id, applicationIndex, data) => 
    api.put(`/season-plans/${id}/fertilizer/${applicationIndex}`, data),
  updateStageImplementation: (id, stageIndex, data) => 
    api.put(`/season-plans/${id}/stage/${stageIndex}`, data),
  updateHarvest: (id, harvestData) => 
    api.put(`/season-plans/${id}/harvest`, harvestData),
  addLCCFertilizerApplication: (id, lccData) =>
    api.post(`/season-plans/${id}/lcc-fertilizer`, lccData),
  deleteFertilizerApplication: (id, applicationIndex) =>
    api.delete(`/season-plans/${id}/fertilizer/${applicationIndex}`),
  
  // Daily Remarks API
  addDailyRemark: (id, formData) => 
    api.post(`/season-plans/${id}/daily-remarks`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds for image uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`[MOBILE DEBUG] Upload progress: ${percentCompleted}%`);
      }
    }),
  updateDailyRemark: (id, remarkId, formData) => 
    api.put(`/season-plans/${id}/daily-remarks/${remarkId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds for image uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`[MOBILE DEBUG] Upload progress: ${percentCompleted}%`);
      }
    }),
  deleteDailyRemark: (id, remarkId) => 
    api.delete(`/season-plans/${id}/daily-remarks/${remarkId}`),
  removeRemarkImage: (id, remarkId, imageFilename) =>
    api.delete(`/season-plans/${id}/daily-remarks/${remarkId}/remove-image`, {
      data: { imageFilename }
    }),
  
  // Expense Management API
  addExpense: (id, expenseData) => 
    api.post(`/season-plans/${id}/expenses`, expenseData),
  updateExpense: (id, expenseId, expenseData) => 
    api.put(`/season-plans/${id}/expenses/${expenseId}`, expenseData),
  deleteExpense: (id, expenseId) => 
    api.delete(`/season-plans/${id}/expenses/${expenseId}`),
  getExpenseSummary: (id) => 
    api.get(`/season-plans/${id}/expenses/summary`),
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

// Disease Detection API
export const diseaseDetectionAPI = {
  analyzeImage: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/disease-detection/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds for AI processing
    });
  },
  getDiseases: () => api.get('/disease-detection/diseases'),
  getDiseaseDetails: (id) => api.get(`/disease-detection/diseases/${id}`),
  getAnalysisHistory: () => api.get('/disease-detection/history'),
  getImageUrl: (filename) => `${api.defaults.baseURL}/disease-detection/image/${filename}`,
};

// NEW: Admin Disease Reference API
export const adminDiseaseAPI = {
  // Get all disease references
  getReferences: () => api.get('/admin/diseases/references'),
  
  // Get references for specific disease
  getDiseaseReferences: (diseaseId) => api.get(`/admin/diseases/references/${diseaseId}`),
  
  // Upload reference images
  uploadReferenceImages: (diseaseId, diseaseName, files, metadata) => {
    const formData = new FormData();
    
    // Add files
    files.forEach(file => {
      formData.append('images', file);
    });
    
    // Add metadata
    formData.append('diseaseId', diseaseId);
    formData.append('diseaseName', diseaseName);
    formData.append('descriptions', JSON.stringify(metadata.descriptions));
    formData.append('severities', JSON.stringify(metadata.severities));
    formData.append('stages', JSON.stringify(metadata.stages));
    formData.append('affectedAreas', JSON.stringify(metadata.affectedAreas));
    
    return api.post('/admin/diseases/references', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for large file uploads
    });
  },
  
  // Delete reference image
  deleteReferenceImage: (diseaseId, imageId) => 
    api.delete(`/admin/diseases/references/${diseaseId}/images/${imageId}`),
  
  // Compare image with disease references
  compareWithDisease: (diseaseId, imagePath) => 
    api.post(`/admin/diseases/compare/${diseaseId}`, { imagePath }),
  
  // Compare image with all disease references
  compareWithAllDiseases: (imagePath) => 
    api.post('/admin/diseases/compare-all', { imagePath }),
  
  // Get reference image URL
  getReferenceImageUrl: (filename) => `${api.defaults.baseURL}/admin/diseases/reference-image/${filename}`,
};

// Admin API (users management)
export const adminAPI = {
  // Get farmer users (pagination + search supported)
  getFarmers: (params) => api.get('/admin/farmers', { params }),

  // Delete a farmer by id
  deleteFarmer: (id) => api.delete(`/admin/farmers/${id}`),
  // Update a farmer by id
  updateFarmer: (id, data) => api.put(`/admin/farmers/${id}`, data),
};

// Machinery API
export const machineryAPI = {
  // Get all machinery with filters
  searchMachinery: (filters) => api.get('/machinery', { params: filters }),
  
  // Get nearby machinery
  getNearbyMachinery: (params) => api.get('/machinery/nearby', { params }),
  
  // Get single machinery
  getMachinery: (id) => api.get(`/machinery/${id}`),
  
  // Create new machinery (operator only)
  createMachinery: (data) => api.post('/machinery', data),
  
  // Update machinery
  updateMachinery: (id, data) => api.put(`/machinery/${id}`, data),
  
  // Delete machinery
  deleteMachinery: (id) => api.delete(`/machinery/${id}`),
  
  // Get my machinery listings
  getMyMachinery: () => api.get('/machinery/my/listings'),
  
  // Search machinery by farm
  searchByFarm: (farmId) => api.get(`/machinery/search-by-farm/${farmId}`),
  
  // Create machinery request (farmer)
  createRequest: (data) => api.post('/machinery/requests', data),
  
  // Get my requests (farmer)
  getMyRequests: () => api.get('/machinery/requests/my'),
  
  // Get requests for machinery (operator)
  getMachineryRequests: (machineryId) => api.get(`/machinery/${machineryId}/requests`),
  
  // Update request status (operator)
  updateRequestStatus: (requestId, data) => api.put(`/machinery/requests/${requestId}/status`, data),
  
  // Rate machinery service (farmer)
  rateService: (requestId, data) => api.post(`/machinery/requests/${requestId}/rate`, data),
};

export default api;
