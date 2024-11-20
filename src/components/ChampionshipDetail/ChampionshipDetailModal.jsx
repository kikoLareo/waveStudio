// src/components/ChampionshipDetailModal/ChampionshipDetailModal.jsx
import React, { useState } from 'react';
import './ChampionshipDetailModal.scss';

function ChampionshipDetailModal({ isOpen, onClose, championshipData }) {
  const [activeTab, setActiveTab] = useState('main');

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <div className="tab-content">
            <h2>Información Principal</h2>
            <p><strong>Nombre:</strong> {championshipData.name}</p>
            <p><strong>Organizador:</strong> {championshipData.organizer}</p>
            <p><strong>Disciplina:</strong> {championshipData.discipline}</p>
            <p><strong>Lugar:</strong> {championshipData.location}</p>
          </div>
        );
      case 'costs':
        return (
          <div className="tab-content">
            <h2>Costes</h2>
            <p>Sección para costes generales y costes de trabajadores.</p>
          </div>
        );
      case 'assignments':
        return (
          <div className="tab-content">
            <h2>Asignaciones de Trabajadores</h2>
            <p>Sección para gestionar los trabajadores asignados al campeonato.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="tabs">
          <button onClick={() => setActiveTab('main')} className={activeTab === 'main' ? 'active' : ''}>Principal</button>
          <button onClick={() => setActiveTab('costs')} className={activeTab === 'costs' ? 'active' : ''}>Costes</button>
          <button onClick={() => setActiveTab('assignments')} className={activeTab === 'assignments' ? 'active' : ''}>Asignaciones</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default ChampionshipDetailModal;