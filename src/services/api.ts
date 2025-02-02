import axios from 'axios';
import { apiConfig } from '../config/api';
import { generateMockData } from './mockData';

const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers
});

// Add request interceptor for authentication
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

// Helper function to get entity type from URL
const getEntityType = (url: string): string | null => {
  // Remove leading slash and query parameters
  const cleanPath = url.replace(/^\//, '').split('?')[0];
  // Get the first segment of the path
  const entityType = cleanPath.split('/')[0];
  
  // Map URL paths to mock data keys
  const pathMap: Record<string, string> = {
    'job-positions': 'job-positions',
    'jobPositions': 'job-positions'
  };

  return pathMap[entityType] || entityType;
};

// Mock API for development
const mockApi = {
  get: async (url: string) => {
    if (import.meta.env.DEV) {
      const entityType = getEntityType(url);
      if (entityType) {
        const mock = generateMockData(entityType as any);
        const id = url.split('/')[2];
        return id ? mock.getById(id) : mock.get();
      }
    }
    return api.get(url);
  },
  post: async (url: string, data: any) => {
    if (import.meta.env.DEV) {
      const entityType = getEntityType(url);
      if (entityType) {
        const mock = generateMockData(entityType as any);
        return mock.create(data);
      }
    }
    return api.post(url, data);
  },
  put: async (url: string, data: any) => {
    if (import.meta.env.DEV) {
      const entityType = getEntityType(url);
      if (entityType) {
        const id = url.split('/')[2];
        if (id) {
          const mock = generateMockData(entityType as any);
          return mock.update(id, data);
        }
      }
    }
    return api.put(url, data);
  },
  delete: async (url: string) => {
    if (import.meta.env.DEV) {
      const entityType = getEntityType(url);
      if (entityType) {
        const id = url.split('/')[2];
        if (id) {
          const mock = generateMockData(entityType as any);
          return mock.delete(id);
        }
      }
    }
    return api.delete(url);
  }
};

export default import.meta.env.DEV ? mockApi : api;