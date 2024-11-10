// src/pages/Users.js
import React, { useState, useEffect } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import {userSchema} from '../schemas/schemas';
import api from '../services/api';
import logService from '../utils/logger';
export const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await api.get('/users');
    setUsers(response.data);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleFormSubmit = async (userData) => {
  var userProp = {
    
  }
    logService.log('info', 'Usuario creado o actualizado', userData);
    if (currentUser) {
      await api.put(`/users/${currentUser.id}`, userData);
    } else {
      await api.post('/users/create', userData);
    }
    setModalOpen(false);
    fetchUsers();

    
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <button onClick={() => setModalOpen(true)}>Crear Usuario</button>
      <Table
        columns={userSchema}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DynamicForm
          schema={userSchema}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
}

