// src/pages/JobPositions.js
import React, { useState, useEffect } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import { jobPositions } from '../schemas/schemas';
import api from '../services/api';
import logService from '../utils/logger';

const JobPositions = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [schema, setSchema] = useState(jobPositions);
  const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error

  useEffect(() => {
    fetchJobPositions();
  }, []);

  const fetchJobPositions = async () => {
    try {
      const response = await api.get('/job-positions');
      setJobPositions(response.data);
    } catch (error) {
      logService.log('error', 'Error al obtener los puestos de trabajo', error);
    }
  };

  const handleEdit = (job) => {
    setCurrentJob(job);
    setSchema(jobPositions);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/job-positions/${id}/delete`);
      fetchJobPositions();
    } catch (error) {
      logService.log('error', 'Error al eliminar el puesto de trabajo', error);
    }
  };

  const handleCreate = () => {
    setCurrentJob({});
    setSchema(jobPositions);
    setModalOpen(true);
  };

  const handleFormSubmit = async (jobData) => {
    setErrorMessage(null); // Limpiar mensaje de error
    try {
      if (currentJob && currentJob.id) {
        await api.put(`/job-positions/${currentJob.id}/update`, jobData);
      } else {
        await api.post('/job-positions/create', jobData);
      }
      logService.log('info', 'Puesto de trabajo creado o actualizado', jobData);
      setModalOpen(false);
      fetchJobPositions();
    } catch (error) {
      setErrorMessage('Error al crear o actualizar el puesto de trabajo. Verifica los datos e intenta nuevamente.');
      logService.log('error', 'Error al crear o actualizar puesto de trabajo', error);
    }
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
        {errorMessage && <div className="error-alert">{errorMessage}</div>} {/* Mostrar mensaje de error */}
        <DynamicForm
          schema={schema}
          onSubmit={handleFormSubmit}
          initialData={currentJob}
        />
      </Modal>
    </div>
  );
};

export default JobPositions;