import axios from 'axios';

// For development, use direct backend URL to bypass proxy issues
// For production, use direct backend URL
const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for CORS proxy
api.interceptors.request.use(
  (config) => {
    // Add origin header for CORS proxy
    if (config.baseURL.includes('cors-anywhere')) {
      config.headers['Origin'] = 'http://localhost:3000';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Please check if your backend is running on http://localhost:8080');
      console.error('If you have CORS issues, try using a different CORS proxy or configure CORS on your backend');
    }
    return Promise.reject(error);
  }
);

// Product API
export const productAPI = {
  getAll: () => api.get('/api/product'),
  getById: (id) => api.get(`/api/product/${id}`),
  create: (data) => api.post('/api/product', data),
  update: (id, data) => api.patch(`/api/product/${id}`, data),
  delete: (id) => api.delete(`/api/product/${id}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/api/category'),
  getById: (id) => api.get(`/api/category/${id}`),
  create: (data) => api.post('/api/category', data),
  update: (id, data) => api.patch(`/api/category/${id}`, data),
  delete: (id) => api.delete(`/api/category/${id}`),
};

// Customer API
export const customerAPI = {
  getAll: () => api.get('/api/costumer'),
  getById: (id) => api.get(`/api/costumer/${id}`),
  create: (data) => api.post('/api/costumer', data),
  update: (id, data) => api.patch(`/api/costumer/${id}`, data),
  delete: (id) => api.delete(`/api/costumer/${id}`),
};

// Order API
export const orderAPI = {
  getAll: () => api.get('/api/order'),
  getById: (id) => api.get(`/api/order/${id}`),
  create: (data) => api.post('/api/order', data),
  update: (id, data) => api.patch(`/api/order/${id}`, data),
  delete: (id) => api.delete(`/api/order/${id}`),
  getByStatus: (status, params = {}) => api.get(`/api/order/filter/${status}`, { params }),
  getByCustomer: (id) => api.get(`/api/order/costumer/${id}`),
  getByBusiness: (id, params = {}) => api.get(`/api/order/business/${id}`, { params }),
};

// Payment API
export const paymentAPI = {
  getAll: () => api.get('/api/payment'),
  getById: (id) => api.get(`/api/payment/${id}`),
  create: (data) => api.post('/api/payment', data),
  update: (id, data) => api.patch(`/api/payment/${id}`, data),
  delete: () => api.delete('/api/payment'),
};

// Business API
export const businessAPI = {
  getAll: () => api.get('/api/business'),
  getById: (id) => api.get(`/api/business/${id}`),
  create: (data) => api.post('/api/business', data),
  update: (id, data) => api.patch(`/api/business/${id}`, data),
  delete: (id) => api.delete(`/api/business/${id}`),
};

export default api;
