// src/pages/Championships.js
import React, { useState, useEffect } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import ChampionshipDetail from '../components/ChampionshipDetail/ChampionshipDetail';
import { championshipCreateSchema } from '../schemas/schemas';
import api from '../services/api';
import logService from '../utils/logger';

const Championships = () => {
  const [championships, setChampionships] = useState([]);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedChampionship, setSelectedChampionship] = useState(null);

  useEffect(() => {
    fetchChampionships();
  }, []);

  const fetchChampionships = async () => {
    try {
      const response = await api.get('/championships');
      setChampionships(response.data);
    } catch (error) {
      logService.log('error', 'Error al obtener campeonatos', error);
    }
  };

  // Manejar la apertura del detalle del campeonato
  const handleViewDetails = (championship) => {
    setSelectedChampionship(championship);
    setDetailModalOpen(true);
  };

  return (
    <div>
      <h1>Campeonatos</h1>
      <Table
        columns={championshipCreateSchema}
        data={championships}
        onEdit={handleViewDetails} // Cambiado para mostrar detalles
      />
      {/* Modal para mostrar los detalles del campeonato */}
      {selectedChampionship && (
        <Modal isOpen={isDetailModalOpen} onClose={() => setDetailModalOpen(false)}>
          <ChampionshipDetail championship={selectedChampionship} />
        </Modal>
      )}
    </div>
  );
};

export default Championships;