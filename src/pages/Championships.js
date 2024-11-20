import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import { championships } from '../schemas/schemas';
import api from '../services/api';
import logService from '../utils/logger';

const Championships = () => {
  const [championships, setChampionships] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentChampionship, setCurrentChampionship] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChampionships();
  }, []);

  const fetchChampionships = async () => {
    try {
      const response = await api.get('/championships');
      setChampionships(response.data);
      logService.log('info', 'Campeonatos obtenidos exitosamente');
    } catch (error) {
      setError('Error al obtener campeonatos');
      logService.log('error', 'Error al obtener campeonatos', error);
    }
  };

  const handleViewDetails = (championships) => {
    navigate(`/championships/${championships.id}`);
  };

  const handleEdit = (championships) => {
    setCurrentChampionship(championships);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/championships/delete/${id}`);
      fetchChampionships();
      logService.log('info', `Campeonato con ID ${id} eliminado exitosamente`);
    } catch (error) {
      setError('Error al eliminar el campeonato');
      logService.log('error', `Error al eliminar el campeonato con ID ${id}`, error);
    }
  };

  const handleCreate = () => {
    setCurrentChampionship({});
    setModalOpen(true);
  };

  const handleFormSubmit = async (championshipData) => {
    try {
      if (currentChampionship && currentChampionship.id) {
        await api.put(`/championships/${currentChampionship.id}/update`, championshipData);
        logService.log('info', `Campeonato con ID ${currentChampionship.id} actualizado exitosamente`);
      } else {
        await api.post('/championships/create', championshipData);
        logService.log('info', 'Nuevo campeonato creado exitosamente');
      }
      setModalOpen(false);
      fetchChampionships();
    } catch (error) {
      setError('Error al crear o actualizar el campeonato');
      logService.log('error', 'Error al crear o actualizar el campeonato', error);
    }
  };

  return (
    <div>
      <h1>Campeonatos</h1>
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleCreate}>Crear Campeonato</button>
      <Table
        columns={Object.keys(championships).map((key) => ({
          label: championships[key].label || key,
          field: key
        }))}
        data={championships}
        onView={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DynamicForm
          schema={championships}
          onSubmit={handleFormSubmit}
          initialData={currentChampionship}
        />
      </Modal>
    </div>
  );
};

export default Championships;