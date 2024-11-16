// src/pages/JobPositions.js
import React, { useState, useEffect } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import { jobPositionCreateSchema, jobPositionUpdateSchema } from '../schemas/schemas';
import api from '../services/api';
import logService from '../utils/logger';

const JobPositions = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentJobPosition, setCurrentJobPosition] = useState(null);
  const [schema, setSchema] = useState(jobPositionCreateSchema);

  useEffect(() => {
    fetchJobPositions();
  }, []);

  const fetchJobPositions = async () => {
    const response = await api.get('/job-positions');
    setJobPositions(response.data);
  };

  const handleEdit = (jobPosition) => {
    setCurrentJobPosition(jobPosition);
    setSchema(jobPositionUpdateSchema);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/job-positions/${id}/delete`);
    fetchJobPositions();
  };

  const handleCreate = () => {
    setCurrentJobPosition({});
    setSchema(jobPositionCreateSchema);
    setModalOpen(true);
  };

  const handleFormSubmit = async (jobPositionData) => {
    logService.log("info", jobPositionData);
    try {
      if (currentJobPosition && currentJobPosition.id) {
        await api.put(`/job-positions/${currentJobPosition.id}/update`, jobPositionData);
      } else {
        await api.post('/job-positions/create', jobPositionData);
      }
    } catch (error) {
      logService.log('error', 'Error al crear o actualizar puesto de trabajo', error);
    }
    logService.log('info', 'Puesto de trabajo creado o actualizado', jobPositionData);
    setModalOpen(false);
    fetchJobPositions();
  };

  return (
    <div>
      <h1>Gestión de Puestos de Trabajo</h1>
      <button onClick={handleCreate}>Crear Puesto de Trabajo</button>
      <Table
        columns={schema}
        data={jobPositions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DynamicForm
          schema={schema}
          onSubmit={handleFormSubmit}
          initialData={currentJobPosition}
        />
      </Modal>
    </div>
  );
};

export default JobPositions;