import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import Modal from './Modal';
import { AppError } from '../../utils/errorHandler';
import { getErrorSuggestionByCode } from '../../utils/apiErrorHandler';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  error?: AppError; // Error procesado para extraer detalles y sugerencias
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  message,
  title = 'Error',
  error
}) => {
  // Obtener detalles del error
  const details = error?.details;
  
  // Obtener código de error si existe
  const errorCode = error?.originalError?.response?.data?.code;
  
  // Obtener sugerencia basada en el código de error o el tipo de error
  let suggestion = null;
  if (error) {
    if (errorCode) {
      suggestion = getErrorSuggestionByCode(errorCode);
    }
    }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>
        
        {/* Detalles del error */}
        {details && typeof details === 'string' && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700 text-left">
              <strong>Detalles:</strong> {details}
            </p>
          </div>
        )}
        
        {/* Sugerencia basada en el tipo de error */}
        {suggestion && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700 text-left">
              <strong>Sugerencia:</strong> {suggestion}
            </p>
          </div>
        )}
        
        <div className="mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorModal;
