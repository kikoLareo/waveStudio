export const APP_CONFIG = {
  name: 'WaveStudio',
  version: '0.1.0',
  defaultLanguage: 'es',
  supportedLanguages: ['es', 'en'],
  itemsPerPage: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  dateFormat: 'DD/MM/YYYY',
  timeFormat: 'HH:mm',
  defaultTheme: 'light'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CHAMPIONSHIPS: '/championships',
  CHAMPIONSHIP_DETAILS: '/championships/:id',
  ASSIGNMENTS: '/assignments',
  JOB_POSITIONS: '/job-positions',
  USERS: '/users',
  ROLES: '/roles',
  PROFILE: '/profile',
  NOT_FOUND: '*'
} as const;

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  FORBIDDEN: 'No tienes permisos para acceder a este recurso.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  INTERNAL_ERROR: 'Ha ocurrido un error interno. Por favor, intenta nuevamente más tarde.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.'
} as const;