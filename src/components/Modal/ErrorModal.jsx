import React from 'react';
import './ErrorModal.scss'; // Estilos específicos para este modal

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="error-modal">
      <div className="modal-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={onClose} className="btn-primary">Cerrar</button>
      </div>
    </div>
  );
};

export default ErrorModal;