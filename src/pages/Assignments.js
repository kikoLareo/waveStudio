// src/pages/Assignments.js
import React, { useState, useEffect } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import AssignmentForm from '../components/Form/AssignmentForm';
import api from '../services/api';
import logService from '../utils/logger';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      logService.log('error', 'Error al obtener las asignaciones', error);
    }
  };

  const handleEdit = (assignment) => {
    setCurrentAssignment(assignment);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assignments/${id}/delete`);
      fetchAssignments();
    } catch (error) {
      logService.log('error', 'Error al eliminar la asignación', error);
    }
  };

  const handleCreate = () => {
    setCurrentAssignment({});
    setModalOpen(true);
  };

  const handleFormSubmit = async (assignmentData) => {
    logService.log("info", assignmentData);
    try {
      if (currentAssignment) {
        await api.put(`/assignments/${currentAssignment.user_id}/${currentAssignment.championship_id}/update`, assignmentData);
      } else {
        await api.post('/assignments/create', assignmentData);
      }
      logService.log('info', 'Asignación creada o actualizada', assignmentData);
    } catch (error) {
      logService.log('error', 'Error al crear o actualizar la asignación', error);
    }
    setModalOpen(false);
    fetchAssignments();
  };

  return (
    <div>
      <h1>Gestión de Asignaciones</h1>
      <button onClick={handleCreate}>Crear Asignación</button>
      <Table
        columns={['user_id', 'championship_id', 'job_position_id', 'hours_worked']}
        data={assignments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <AssignmentForm
          initialData={currentAssignment}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
};

export default Assignments;