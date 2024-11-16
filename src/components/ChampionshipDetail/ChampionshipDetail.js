// src/components/ChampionshipDetail/ChampionshipDetail.js
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import logService from '../../utils/logger';

const ChampionshipDetail = ({ championship }) => {
  const [assignments, setAssignments] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedJobPosition, setSelectedJobPosition] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');

  useEffect(() => {
    fetchAssignments();
    fetchUsers();
    fetchJobPositions();
  }, []);

  // Funciones para cargar datos
  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/assignments?championship_id=${championship.id}`);
      setAssignments(response.data);
    } catch (error) {
      logService.log('error', 'Error al obtener asignaciones del campeonato', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      logService.log('error', 'Error al obtener usuarios', error);
    }
  };

  const fetchJobPositions = async () => {
    try {
      const response = await api.get('/job-positions');
      setJobPositions(response.data);
    } catch (error) {
      logService.log('error', 'Error al obtener puestos de trabajo', error);
    }
  };

  // Función para agregar una nueva asignación
  const handleAddAssignment = async () => {
    try {
      const newAssignment = {
        user_id: selectedUser,
        championship_id: championship.id,
        job_position_id: selectedJobPosition,
        hours_worked: parseFloat(hoursWorked),
      };
      await api.post('/assignments/create', newAssignment);
      logService.log('info', 'Asignación creada exitosamente', newAssignment);
      fetchAssignments(); // Refrescar la lista de asignaciones
      setSelectedUser('');
      setSelectedJobPosition('');
      setHoursWorked('');
    } catch (error) {
      logService.log('error', 'Error al crear asignación', error);
    }
  };

  return (
    <div className="championship-detail">
      <h2>Detalles del Campeonato: {championship.name}</h2>
      <p>Ubicación: {championship.location}</p>
      <p>Fecha: {new Date(championship.date).toLocaleDateString()}</p>

      <h3>Asignaciones</h3>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((assignment) => (
            <li key={`${assignment.user_id}-${assignment.job_position_id}`}>
              Usuario ID: {assignment.user_id}, Puesto: {assignment.job_position_id}, Horas: {assignment.hours_worked}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay asignaciones para este campeonato.</p>
      )}

      <h3>Añadir Nueva Asignación</h3>
      <div className="assignment-form">
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>

        <select value={selectedJobPosition} onChange={(e) => setSelectedJobPosition(e.target.value)}>
          <option value="">Selecciona un puesto de trabajo</option>
          {jobPositions.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Horas trabajadas"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
        />

        <button onClick={handleAddAssignment}>Añadir Asignación</button>
      </div>
    </div>
  );
};

export default ChampionshipDetail;