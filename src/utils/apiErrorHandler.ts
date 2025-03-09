import { AxiosError } from 'axios';
import { AppError, ErrorCode, createAppError } from './errorHandler';
import logService from './logService';

/**
 * Interfaz para la respuesta de error de la API
 */
export interface ApiErrorResponse {
  code?: string;
  message?: string;
  details?: string | Record<string, any>;
  error?: {
    code?: string;
    message?: string;
    details?: string | Record<string, any>;
  };
  detail?: {
    code?: string;
    message?: string;
    details?: string | Record<string, any>;
    error?: {
      code?: string;
      message?: string;
      details?: string | Record<string, any>;
    };
  };
}

export const getErrorSuggestionByCode = (errorCode: string): string | null => {
  switch (errorCode) {
    case 'INVALID_CREDENTIALS':
      return 'Verifica que tu correo y contraseña sean correctos.';
    case 'PERMISSION_DENIED':
    case 'INSUFFICIENT_PRIVILEGES':
      return 'No tienes permisos suficientes para realizar esta acción. Contacta al administrador.';
    case 'NOT_FOUND':
      return 'El recurso solicitado no existe o ha sido eliminado.';
    case 'ALREADY_EXISTS':
    case 'DUPLICATE_ENTRY':
      return 'El recurso que intentas crear ya existe.';
    case 'VALIDATION_ERROR':
      return 'Verifica que todos los campos estén completos y con el formato correcto.';
    case 'INVALID_FORMAT':
      return 'El formato de los datos proporcionados no es válido.';
    case 'MISSING_FIELDS':
      return 'Faltan campos obligatorios. Por favor, completa todos los campos requeridos.';
    case 'DATABASE_ERROR':
    case 'INTEGRITY_ERROR':
      return 'Hay un problema en la base de datos. Contacta al soporte técnico.';
    case 'INTERNAL_ERROR':
      return 'Hay un problema en el servidor. Intenta nuevamente más tarde o contacta al soporte técnico.';
    default:
      return null;
  }
};

/**
 * Mapea los códigos de error de la API a los códigos de error de la aplicación
 */
const mapApiErrorCode = (apiCode: string | undefined): string => {
  if (!apiCode) return ErrorCode.UNKNOWN_ERROR;

  switch (apiCode) {
    case 'INVALID_CREDENTIALS':
      return ErrorCode.UNAUTHORIZED;
    case 'PERMISSION_DENIED':
    case 'INSUFFICIENT_PRIVILEGES':
      return ErrorCode.FORBIDDEN;
    case 'NOT_FOUND':
      return ErrorCode.NOT_FOUND;
    case 'ALREADY_EXISTS':
    case 'DUPLICATE_ENTRY':
      return ErrorCode.ALREADY_EXISTS;
    case 'VALIDATION_ERROR':
      return ErrorCode.VALIDATION_ERROR;
    case 'INVALID_FORMAT':
      return ErrorCode.INVALID_FORMAT;
    case 'MISSING_FIELDS':
      return ErrorCode.MISSING_FIELDS;
    case 'DATABASE_ERROR':
    case 'INTEGRITY_ERROR':
      return ErrorCode.DATABASE_ERROR;
    case 'INTERNAL_ERROR':
      return ErrorCode.SERVER_ERROR;
    default:
      return ErrorCode.UNKNOWN_ERROR;
  }
};

/**
 * Extrae el código de error de la respuesta de la API
 */
const extractErrorCode = (errorData: ApiErrorResponse | undefined): string => {
  if (!errorData) return ErrorCode.UNKNOWN_ERROR;

  // Buscar el código en diferentes ubicaciones posibles
  const code = 
    errorData.code || 
    errorData.error?.code || 
    errorData.detail?.code || 
    errorData.detail?.error?.code;

  return mapApiErrorCode(code);
};

/**
 * Extrae el mensaje de error de la respuesta de la API
 */
const extractErrorMessage = (errorData: ApiErrorResponse | undefined, defaultAction: string): string => {
  if (!errorData) return `Error al ${defaultAction}`;

  // Buscar el mensaje en diferentes ubicaciones posibles
  return (
    errorData.message || 
    errorData.error?.message || 
    errorData.detail?.message || 
    errorData.detail?.error?.message || 
    `Error al ${defaultAction}`
  );
};

/**
 * Extrae los detalles del error de la respuesta de la API
 */
const extractErrorDetails = (errorData: ApiErrorResponse | undefined): string | Record<string, any> | undefined => {
  if (!errorData) return undefined;

  // Buscar los detalles en diferentes ubicaciones posibles
  return (
    errorData.details || 
    errorData.error?.details || 
    errorData.detail?.details || 
    errorData.detail?.error?.details || 
    errorData.detail || 
    undefined
  );
};

/**
 * Procesa un error de Axios y lo convierte en un AppError
 */
export function processApiError(error: AxiosError<ApiErrorResponse>, defaultAction: string = 'realizar la operación'): AppError {
  // Registrar el error para depuración
  logService.log('error', 'Error de API', {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url,
    method: error.config?.method
  });

  // Si no hay respuesta, es un error de red
  if (!error.response) {
    return createAppError(
      ErrorCode.NETWORK_ERROR,
      'Error de conexión con el servidor',
      error.message,
      'api'
    );
  }

  const status = error.response.status;
  const errorData = error.response.data;

  // Manejar errores basados en el código de estado HTTP
  switch (status) {
    case 400: // Bad Request
      return createAppError(
        extractErrorCode(errorData) || ErrorCode.VALIDATION_ERROR,
        extractErrorMessage(errorData, defaultAction),
        extractErrorDetails(errorData),
        'api'
      );
    
    case 401: // Unauthorized
      return createAppError(
        ErrorCode.UNAUTHORIZED,
        'No autorizado. Por favor, inicia sesión nuevamente.',
        extractErrorDetails(errorData),
        'api'
      );
    
    case 403: // Forbidden
      return createAppError(
        ErrorCode.FORBIDDEN,
        'No tienes permisos para realizar esta acción',
        extractErrorDetails(errorData),
        'api'
      );
    
    case 404: // Not Found
      return createAppError(
        ErrorCode.NOT_FOUND,
        `El recurso solicitado no existe o ha sido eliminado`,
        extractErrorDetails(errorData),
        'api'
      );
    
    case 422: // Unprocessable Entity
      return createAppError(
        ErrorCode.VALIDATION_ERROR,
        extractErrorMessage(errorData, 'validar los datos'),
        extractErrorDetails(errorData),
        'api'
      );
    
    case 500: // Internal Server Error
    case 502: // Bad Gateway
    case 503: // Service Unavailable
    case 504: // Gateway Timeout
      return createAppError(
        ErrorCode.SERVER_ERROR,
        'Error en el servidor. Por favor, inténtalo más tarde.',
        extractErrorDetails(errorData),
        'api'
      );
    
    default:
      // Para otros códigos de estado, usar la información de la respuesta si está disponible
      return createAppError(
        extractErrorCode(errorData) || ErrorCode.UNKNOWN_ERROR,
        extractErrorMessage(errorData, defaultAction),
        extractErrorDetails(errorData),
        'api'
      );
  }
}

/**
 * Formatea un mensaje de error para mostrar al usuario
 */
export function formatApiErrorMessage(error: AxiosError<ApiErrorResponse>): string {
  const appError = processApiError(error);
  
  let message = appError.message;
  
  // Añadir detalles si están disponibles
  if (appError.details) {
    if (typeof appError.details === 'string') {
      message += `: ${appError.details}`;
    } else if (typeof appError.details === 'object') {
      // Si hay errores específicos de campo, mostrarlos
      if (Array.isArray(appError.details.errors)) {
        const fieldErrors = appError.details.errors
          .map((err: any) => {
            if (err.field && err.message) {
              return `${err.field}: ${err.message}`;
            }
            return err.message || JSON.stringify(err);
          })
          .join(', ');
        
        if (fieldErrors) {
          message += `: ${fieldErrors}`;
        }
      } else if (appError.details.message) {
        message += `: ${appError.details.message}`;
      }
    }
  }
  
  return message;
}
