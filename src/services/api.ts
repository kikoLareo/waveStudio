// api.ts
import axios from 'axios';
import { apiConfig } from '../config/api';

const api = axios.create({
  baseURL: apiConfig.baseURL, // Ejemplo: 'https://api.tuservidor.com'
  timeout: apiConfig.timeout, // Ejemplo: 5000 (milisegundos)
  headers: apiConfig.headers, // Ejemplo: { 'Content-Type': 'application/json' }
});

// Interceptor para agregar el token de autenticación en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
