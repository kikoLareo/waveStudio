// src/pages/Roles.js
import React, { useState, useEffect } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import {roles} from '../schemas/schemas';
import api from '../services/api';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await api.get('/roles');
    setRoles(response.data);
  };

  const handleEdit = (roles) => {
    setCurrentRole(roles);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/roles/${id}`);
    fetchRoles();
  };

  const handleFormSubmit = async (roleData) => {
    if (currentRole) {
      await api.put(`/roles/${currentRole.id}`, roleData);
    } else {
      await api.post('/roles', roleData);
    }
    setModalOpen(false);
    fetchRoles();
  };

  return (
    <div>
      <h1>Gestión de Roles</h1>
      <button onClick={() => setModalOpen(true)}>Crear Rol</button>
      <Table
        columns={roles}
        data={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DynamicForm
          schema={roles}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
}

export default Roles; 