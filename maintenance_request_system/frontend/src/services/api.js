import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.token) {
    config.headers.Authorization = `Token ${user.token}`
  }
  return config
})

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/profiles/me/'),
}

export const requestsAPI = {
  getAll: () => api.get('/requests/'),
  getById: (id) => api.get(`/requests/${id}/`),
  create: (data) => api.post('/requests/', data),
  update: (id, data) => api.patch(`/requests/${id}/`, data),
  delete: (id) => api.delete(`/requests/${id}/`),
  getMyRequests: () => api.get('/requests/my_requests/'),
  getDashboardData: () => api.get('/requests/dashboard_data/'),
  accept: (id) => api.post(`/requests/${id}/accept/`),
  startMaintenance: (id) => api.post(`/requests/${id}/start_maintenance/`),
  completeMaintenance: (id, data) => api.post(`/requests/${id}/complete_maintenance/`, data),
}

export const notificationsAPI = {
  getAll: () => api.get('/notifications/'),
  markAsRead: (id) => api.post(`/notifications/${id}/mark_as_read/`),
  markAllAsRead: () => api.post('/notifications/mark_all_as_read/'),
}

export default api

