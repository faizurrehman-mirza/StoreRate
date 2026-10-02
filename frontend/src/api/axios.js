import axios from 'axios'

// Development: VITE_API_URL=http://localhost:5000/api (from .env.development)
// Docker: no env variable set, falls back to /api (proxied by nginx)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
