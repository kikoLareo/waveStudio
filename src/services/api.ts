import axios from 'axios';
import { apiConfig } from '../config/api';
import logService from '../utils/logService';

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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Procesar respuestas exitosas si es necesario
    return response;
  },
  (error) => {
    // Registrar el error para debugging
    logService.log('error', 'Error en petición API', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });

    // Si el error es 401 (no autorizado), podríamos manejar el logout automático
    if (error.response?.status === 401 && !error.config?.url.includes('auth')) {
      // Verificar si el error es por token expirado
      const errorData = error.response.data;
      const isTokenExpired = 
        (errorData.detail?.error?.code === 'TOKEN_EXPIRED') || 
        (errorData.error?.code === 'TOKEN_EXPIRED');
      
      if (isTokenExpired) {
        logService.log('warn', 'Token expirado, redirigiendo a login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    // Devolver el error para que pueda ser manejado por el código que hizo la petición
    return Promise.reject(error);
  }
);

// Función para obtener datos reales del dashboard
export const fetchDashboardData = async () => {
  try {
    const [championshipsResponse, usersResponse, assignmentsResponse] = await Promise.all([
      api.get('/championships'),
      api.get('/users'),
      api.get('/assignments'),
    ]);
    return {
      championships: championshipsResponse.data,
      users: usersResponse.data,
      assignments: assignmentsResponse.data,
    };
  } catch (error) {
    throw error;
  }
};

// Función para obtener todos los organizadores
export const fetchOrganizers = async () => {
  try {
    const response = await api.get('/organizers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener todas las disciplinas
export const fetchDisciplines = async () => {
  try {
    const response = await api.get('/disciplines');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener un organizador por ID
export const fetchOrganizerById = async (id: number) => {
  try {
    const response = await api.get(`/organizers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener una disciplina por ID
export const fetchDisciplineById = async (id: number) => {
  try {
    const response = await api.get(`/disciplines/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
