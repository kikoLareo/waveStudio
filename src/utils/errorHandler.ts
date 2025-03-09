/**
 * Tipos y utilidades para el manejo de errores en la aplicación
 */

// Tipo para errores de la aplicación
export interface AppError {
  code: string;
  message: string;
  details?: string | Record<string, any>;
  source?: string;
  timestamp: Date;
  originalError?: {
    response?: {
      data?: {
        code?: string;
      };
    };
  };
}

// Códigos de error comunes
export enum ErrorCode {
  // Errores de red
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Errores de autenticación
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // Errores de recursos
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // Errores de validación
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING_FIELDS = 'MISSING_FIELDS',
  
  // Errores de operación
  OPERATION_FAILED = 'OPERATION_FAILED',
  
  // Errores del servidor
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Errores desconocidos
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Crea un objeto de error de la aplicación
 */
export function createAppError(
  code: string,
  message: string,
  details?: string | Record<string, any>,
  source?: string
): AppError {
  return {
    code,
    message,
    details,
    source,
    timestamp: new Date()
  };
}

/**
 * Obtiene un mensaje de error amigable para el usuario
 */
export function getFriendlyErrorMessage(error: AppError | null): string {
  if (!error) {
    return 'Ha ocurrido un error desconocido';
  }

  // Si hay un mensaje personalizado, usarlo
  if (error.message) {
    return error.message;
  }

  // Mensajes predeterminados basados en el código de error
  switch (error.code) {
    case ErrorCode.NETWORK_ERROR:
      return 'Error de conexión. Por favor, verifica tu conexión a internet.';
    
    case ErrorCode.TIMEOUT_ERROR:
      return 'La operación ha tardado demasiado tiempo. Por favor, inténtalo de nuevo.';
    
    case ErrorCode.UNAUTHORIZED:
      return 'No tienes autorización para realizar esta acción. Por favor, inicia sesión nuevamente.';
    
    case ErrorCode.FORBIDDEN:
      return 'No tienes permisos para realizar esta acción.';
    
    case ErrorCode.NOT_FOUND:
      return 'El recurso solicitado no existe o ha sido eliminado.';
    
    case ErrorCode.ALREADY_EXISTS:
      return 'El recurso que intentas crear ya existe.';
    
    case ErrorCode.VALIDATION_ERROR:
      return 'Hay errores en los datos proporcionados. Por favor, verifica la información.';
    
    case ErrorCode.INVALID_FORMAT:
      return 'El formato de los datos proporcionados no es válido.';
    
    case ErrorCode.MISSING_FIELDS:
      return 'Faltan campos obligatorios. Por favor, completa todos los campos requeridos.';
    
    case ErrorCode.OPERATION_FAILED:
      return 'La operación ha fallado. Por favor, inténtalo de nuevo.';
    
    case ErrorCode.SERVER_ERROR:
      return 'Error en el servidor. Por favor, inténtalo más tarde.';
    
    case ErrorCode.DATABASE_ERROR:
      return 'Error en la base de datos. Por favor, inténtalo más tarde.';
    
    default:
      return 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.';
  }
}

/**
 * Obtiene detalles adicionales del error para mostrar al usuario
 */
export function getErrorDetails(error: AppError): string | null {
  if (!error.details) {
    return null;
  }

  if (typeof error.details === 'string') {
    return error.details;
  }

  // Si los detalles son un objeto, intentar extraer información útil
  if (typeof error.details === 'object') {
    if (Array.isArray(error.details.errors)) {
      // Si hay una lista de errores, mostrarlos como una lista
      return error.details.errors
        .map((err: any) => {
          if (err.field && err.message) {
            return `${err.field}: ${err.message}`;
          }
          return err.message || JSON.stringify(err);
        })
        .join('\n');
    }

    // Si hay un mensaje en los detalles, mostrarlo
    if (error.details.message) {
      return error.details.message;
    }

    // Si hay detalles específicos, mostrarlos
    if (error.details.details) {
      return typeof error.details.details === 'string'
        ? error.details.details
        : JSON.stringify(error.details.details);
    }
  }

  // Si no se puede extraer información útil, mostrar los detalles como JSON
  return JSON.stringify(error.details);
}
