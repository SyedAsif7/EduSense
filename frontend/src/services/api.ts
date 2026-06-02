import axios from 'axios';
import { Student, AttendanceRecord, RiskPrediction } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle common errors
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const status = error.response?.status;
  
  // 401 is always unauthorized
  // 422 is usually a malformed token in flask-jwt-extended
  if (status === 401 || status === 422) {
    const errorMsg = error.response?.data?.msg || '';
    console.error('Authentication Error:', status, errorMsg);
    
    // Only logout if it looks like a genuine token issue
    if (status === 401 || errorMsg.toLowerCase().includes('token') || errorMsg.toLowerCase().includes('authorization')) {
      if (sessionStorage.getItem('token')) {
        console.warn('Session invalid, logging out...');
        sessionStorage.clear();
        window.location.href = '/';
      }
    }
  }
  return Promise.reject(error);
});

export const authService = {
  login: (credentials: any) => api.post('/login', credentials),
  getMe: () => api.get('/me'),
};

export const studentService = {
  getRiskHeatmap: () => api.get('/risk-heatmap'),
  getReport: (rollNo: string) => api.get(`/student-report/${rollNo}`),
  getAttendance: (rollNo: string) => api.get(`/attendance/${rollNo}`),
};

export const hodService = {
  getFaculties: () => api.get('/hod/faculties'),
  getStudents: () => api.get('/hod/students'),
  getDeptStats: () => api.get('/hod/department-stats'),
};

export const alertService = {
  sendAlert: (data: { roll_no: string; type: string }) => api.post('/alerts', data),
};

export default api;
