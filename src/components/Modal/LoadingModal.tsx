import React from 'react';
import { Loader } from 'lucide-react';
import Modal from './Modal';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  title?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = 'Por favor espere...',
  title = 'Cargando'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="sm">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default LoadingModal;