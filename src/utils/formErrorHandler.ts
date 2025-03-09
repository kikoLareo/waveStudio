import { AppError } from './errorHandler';
import { ApiErrorResponse } from './apiErrorHandler';
import { AxiosError } from 'axios';

/**
 * Interfaz para los errores de validación de formularios
 */
export interface FormValidationError {
  field: string;
  message: string;
}

/**
 * Función para extraer errores de validación de un error de API
 * @param error - Error de la API
 * @returns Un array de errores de validación de formulario
 */
export const extractFormValidationErrors = (error: AppError): FormValidationError[] => {
  const validationErrors: FormValidationError[] = [];
  
  // Si no hay detalles, no podemos extraer errores de validación
  if (!error.details) {
    return validationErrors;
  }
  
  // Intentar extraer errores de validación de los detalles
  try {
    // Si los detalles son un objeto, intentar extraer errores de validación
    if (typeof error.details === 'object' && error.details !== null) {
      const details = error.details as Record<string, any>;
      
      // Si hay un campo 'errors' que es un array, procesarlo
      if (Array.isArray(details.errors)) {
        details.errors.forEach((err: any) => {
          if (err.field && err.message) {
            validationErrors.push({
              field: err.field,
              message: err.message
            });
          }
        });
      } 
      // Si hay campos específicos con mensajes de error
      else {
        Object.entries(details).forEach(([key, value]) => {
          if (typeof value === 'string') {
            validationErrors.push({
              field: key,
              message: value
            });
          }
        });
      }
    }
    // Si los detalles son una cadena, intentar analizarla como JSON
    else if (typeof error.details === 'string') {
      // Intentar detectar patrones comunes en mensajes de error
      
      // Patrón: "El campo 'X' es requerido"
      const requiredFieldMatch = error.details.match(/El campo ['"]?([^'"]+)['"]? es requerido/i);
      if (requiredFieldMatch) {
        validationErrors.push({
          field: requiredFieldMatch[1],
          message: `El campo ${requiredFieldMatch[1]} es requerido`
        });
      }
      
      // Patrón: "El valor de 'X' no es válido"
      const invalidValueMatch = error.details.match(/El valor de ['"]?([^'"]+)['"]? no es válido/i);
      if (invalidValueMatch) {
        validationErrors.push({
          field: invalidValueMatch[1],
          message: `El valor de ${invalidValueMatch[1]} no es válido`
        });
      }
      
      // Patrón: "Ya existe un X con Y 'Z'"
      const duplicateMatch = error.details.match(/Ya existe un ([^ ]+) con ([^ ]+) ['"]?([^'"]+)['"]?/i);
      if (duplicateMatch) {
        validationErrors.push({
          field: duplicateMatch[2],
          message: `Ya existe un ${duplicateMatch[1]} con este ${duplicateMatch[2]}`
        });
      }
    }
  } catch (e) {
    console.error('Error al extraer errores de validación:', e);
  }
  
  return validationErrors;
};

/**
 * Función para obtener un mensaje de error amigable para un campo específico
 * @param field - Nombre del campo
 * @param errorCode - Código de error
 * @returns Un mensaje de error amigable
 */
export const getFieldErrorMessage = (field: string, errorCode: string): string => {
  // Mensajes específicos para campos comunes
  const fieldMessages: Record<string, Record<string, string>> = {
    // Campos de usuario
    username: {
      DUPLICATE_ENTRY: 'Este nombre de usuario ya está en uso',
      MISSING_FIELDS: 'El nombre de usuario es obligatorio',
      INVALID_FORMAT: 'El nombre de usuario solo puede contener letras, números y guiones bajos'
    },
    email: {
      DUPLICATE_ENTRY: 'Este correo electrónico ya está registrado',
      MISSING_FIELDS: 'El correo electrónico es obligatorio',
      INVALID_FORMAT: 'El formato del correo electrónico no es válido'
    },
    password: {
      MISSING_FIELDS: 'La contraseña es obligatoria',
      INVALID_FORMAT: 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número'
    },
    
    // Campos de campeonato
    name: {
      DUPLICATE_ENTRY: 'Ya existe un registro con este nombre',
      MISSING_FIELDS: 'El nombre es obligatorio',
      INVALID_FORMAT: 'El nombre contiene caracteres no válidos'
    },
    start_date: {
      MISSING_FIELDS: 'La fecha de inicio es obligatoria',
      INVALID_FORMAT: 'El formato de la fecha de inicio no es válido'
    },
    end_date: {
      MISSING_FIELDS: 'La fecha de fin es obligatoria',
      INVALID_FORMAT: 'El formato de la fecha de fin no es válido'
    },
    
    // Campos generales
    id: {
      NOT_FOUND: 'El ID proporcionado no existe',
      INVALID_FORMAT: 'El ID debe ser un número entero positivo'
    }
  };
  
  // Si hay un mensaje específico para el campo y el código de error, devolverlo
  if (fieldMessages[field] && fieldMessages[field][errorCode]) {
    return fieldMessages[field][errorCode];
  }
  
  // Mensajes genéricos basados en el código de error
  switch (errorCode) {
    case 'DUPLICATE_ENTRY':
      return `Ya existe un registro con este valor de ${field}`;
    case 'MISSING_FIELDS':
      return `El campo ${field} es obligatorio`;
    case 'INVALID_FORMAT':
      return `El formato del campo ${field} no es válido`;
    case 'NOT_FOUND':
      return `No se encontró el ${field} especificado`;
    default:
      return `Error en el campo ${field}`;
  }
};

/**
 * Función para manejar errores de formulario
 * @param error - Error de la API
 * @returns Un objeto con los errores de validación por campo
 */
export const handleFormErrors = (error: AxiosError<ApiErrorResponse>): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  // Si no hay respuesta, es un error de red
  if (!error.response) {
    fieldErrors._general = 'Error de conexión. Por favor, verifica tu conexión a internet.';
    return fieldErrors;
  }
  
  const errorData = error.response.data;
  
  // Si hay un código de error y detalles
  if (errorData && errorData.code) {
    // Si los detalles son un objeto, intentar extraer errores por campo
    if (typeof errorData.details === 'object' && errorData.details !== null) {
      const details = errorData.details as Record<string, any>;
      
      // Si hay un campo 'errors' que es un array, procesarlo
      if (Array.isArray(details.errors)) {
        details.errors.forEach((err: any) => {
          if (err.field && err.message) {
            fieldErrors[err.field] = err.message;
          }
        });
      } 
      // Si hay campos específicos con mensajes de error
      else {
        Object.entries(details).forEach(([key, value]) => {
          if (typeof value === 'string') {
            fieldErrors[key] = value;
          }
        });
      }
    }
    // Si no hay errores específicos por campo, usar un error general
    if (Object.keys(fieldErrors).length === 0) {
      fieldErrors._general = errorData.message || 'Ha ocurrido un error al procesar el formulario';
    }
  } else {
    // Si no hay código de error, usar un error general
    fieldErrors._general = 'Ha ocurrido un error al procesar el formulario';
  }
  
  return fieldErrors;
};
