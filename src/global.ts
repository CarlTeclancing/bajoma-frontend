import axios from 'axios';
import { authStorage } from './config/storage.config';

export const BACKEND_URL:string ="http://localhost:5000/api/v1";

// Set up axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = authStorage.getItem('token');
    console.log('Making request to:', config.url);
    console.log('Token present:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle 401 responses (unauthorized)
axios.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Only redirect to login for protected routes, not for public endpoints
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/')) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on login or public pages
      if (!currentPath.includes('/login') && !currentPath.includes('/shop') && !currentPath.includes('/')) {
        authStorage.removeItem('token');
        authStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);;