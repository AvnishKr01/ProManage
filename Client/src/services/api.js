import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/api/auth/login", { email, password }),
  register: (name, email, password, role) => api.post("/api/auth/register", { name, email, password, role }),
  getCurrentUser: () => api.get("/api/auth/me"),
}

// Project API
export const projectAPI = {
  getProjects: () => api.get("/api/projects"),
  getProject: (id) => api.get(`/api/projects/${id}`),
  createProject: (data) => api.post("/api/projects", data),
  updateProject: (id, data) => api.put(`/api/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/projects/${id}`),
}

// Task API
export const taskAPI = {
  getTasksByProject: (projectId) => api.get(`/api/tasks/project/${projectId}`),
  getTask: (id) => api.get(`/api/tasks/${id}`),
  createTask: (data) => api.post("/api/tasks", data),
  updateTask: (id, data) => api.put(`/api/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
}

export default api
