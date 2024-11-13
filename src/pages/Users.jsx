// src/pages/Users.js
import React, { useState, useEffect } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import {userCreateSchema, userUpdateSchema} from '../schemas/schemas';
import api from '../services/api';
import logService from '../utils/logger';
export const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [schema, setSchema] = useState(userCreateSchema);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await api.get('/users');
    setUsers(response.data);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setSchema(userUpdateSchema);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}/delete`);
    fetchUsers();
  };

  const handleCreate = () => {
    setCurrentUser({});
    setSchema(userCreateSchema)
    setModalOpen(true);
  }

  const handleFormSubmit = async (userData) => {
    logService.log("info", userData);
    try{
      if (currentUser) {
        await api.put(`/users/${currentUser.id}/update`, userData);
      } else {
        await api.post('/users/create', userData);
      }
    } catch (error) {
      logService.log('error', 'Error al crear o actualizar usuario', error);
    }
    logService.log('info', 'Usuario creado o actualizado', userData);
    setModalOpen(false);
    fetchUsers();

    
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <button onClick={handleCreate}>Crear Usuario</button>
      <Table
        columns={schema}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DynamicForm
          schema={schema}
          onSubmit={handleFormSubmit}
          initialData={currentUser}
        />
      </Modal>
    </div>
  );
}

