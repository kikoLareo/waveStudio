interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: {
    'Content-Type': string;
    Accept: string;
  };
  retryAttempts: number;
  retryDelay: number;
}

export const apiConfig: ApiConfig = {
  baseURL: "/api",
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  retryAttempts: 3,
  retryDelay: 1000
};

export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    register: '/auth/register'
  },
  users: {
    base: '/users',
    profile: '/users/profile',
    roles: '/users/roles'
  },
  championships: {
    base: '/championships',
    assignments: '/championships/assignments',
    details: (id: string) => `/championships/${id}`
  },
  assignments: {
    base: '/assignments',
    user: (userId: string) => `/assignments/user/${userId}`,
    championship: (championshipId: string) => `/assignments/championship/${championshipId}`
  },
  jobPositions: {
    base: '/job-positions',
    details: (id: string) => `/job-positions/${id}`
  }
};