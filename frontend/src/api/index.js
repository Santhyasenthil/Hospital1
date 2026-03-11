import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// Doctors
export const doctorsAPI = {
  getAll: (specialization) => api.get('/api/doctors', { params: specialization ? { specialization } : {} }),
  getById: (id) => api.get(`/api/doctors/${id}`),
  getSpecializations: () => api.get('/api/specializations'),
  getAvailableSlots: (doctorId) => api.get(`/api/slots/${doctorId}/available`),
};

// Doctor self-management
export const doctorAPI = {
  addSlot: (data) => api.post('/api/doctor/slots', data),
  getMySlots: () => api.get('/api/doctor/slots'),
  deleteSlot: (id) => api.delete(`/api/doctor/slots/${id}`),
};

// Appointments
export const appointmentAPI = {
  book: (data) => api.post('/api/appointments/book', data),
  getMine: () => api.get('/api/appointments/my'),
  confirm: (id) => api.patch(`/api/appointments/${id}/confirm`),
  complete: (id) => api.patch(`/api/appointments/${id}/complete`),
  cancel: (id) => api.patch(`/api/appointments/${id}/cancel`),
  getAll: () => api.get('/api/appointments/all'),
  getDashboard: () => api.get('/api/appointments/dashboard'),
};

// Admin
export const adminAPI = {
  getPatients: () => api.get('/api/admin/patients'),
  getDoctors: () => api.get('/api/admin/doctors'),
};

export default api;
