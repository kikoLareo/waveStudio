import React from 'react';
import './ConfirmDeleteModal.scss'; // Estilos específicos para este modal

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, entityName }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-delete-modal">
      <div className="modal-content">
        <h2>¿Eliminar {entityName}?</h2>
        <p>Esta acción no se puede deshacer.</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={onConfirm} className="btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;