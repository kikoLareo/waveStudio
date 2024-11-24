// src/components/Modal/Modal.js
import React from 'react';
import './Modal.scss'; // Asegúrate de tener estilos básicos
import { FaWindowClose } from 'react-icons/fa';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          <FaWindowClose />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;