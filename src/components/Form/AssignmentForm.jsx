// src/components/Form/AssignmentForm.jsx
import React, { useState, useEffect } from 'react';
import './AssignmentForm.scss';
import api from '../../services/api';

function AssignmentForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState(initialData);
  const [users, setUsers] = useState([]);
  const [championships, setChampionships] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);

  // Cargar opciones desde el backend
  useEffect(() => {
    fetchUsers();
    fetchChampionships();
    fetchJobPositions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const fetchChampionships = async () => {
    try {
      const response = await api.get('/championships');
      setChampionships(response.data);
    } catch (error) {
      console.error("Error al obtener los campeonatos:", error);
    }
  };

  const fetchJobPositions = async () => {
    try {
      const response = await api.get('/job-positions');
      setJobPositions(response.data);
    } catch (error) {
      console.error("Error al obtener los puestos de trabajo:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Usuario</label>
        <select
          name="user_id"
          value={formData.user_id || ''}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Campeonato</label>
        <select
          name="championship_id"
          value={formData.championship_id || ''}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un campeonato</option>
          {championships.map((championship) => (
            <option key={championship.id} value={championship.id}>
              {championship.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Puesto de Trabajo</label>
        <select
          name="job_position_id"
          value={formData.job_position_id || ''}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un puesto de trabajo</option>
          {jobPositions.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Horas Trabajadas</label>
        <input
          type="number"
          name="hours_worked"
          value={formData.hours_worked || ''}
          onChange={handleChange}
          placeholder="Ingrese las horas trabajadas"
          required
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
}

export default AssignmentForm;