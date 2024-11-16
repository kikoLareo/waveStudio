// src/components/Form/MultiAssignmentForm.jsx
import React, { useState, useEffect } from 'react';
import './MultiAssignmentForm.scss';
import api from '../../services/api';

const MultiAssignmentForm = ({ championshipId, onSubmit }) => {
  const [formData, setFormData] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);

  useEffect(() => {
    fetchUsers();
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

  const fetchJobPositions = async () => {
    try {
      const response = await api.get('/job-positions');
      setJobPositions(response.data);
    } catch (error) {
      console.error("Error al obtener los puestos de trabajo:", error);
    }
  };

  const handleAddAssignment = () => {
    setFormData([...formData, { user_id: '', job_position_id: '', hours_worked: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const updatedData = [...formData];
    updatedData[index][field] = value;
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Asignar Usuarios a {championshipId}</h3>
      {formData.map((assignment, index) => (
        <div className="assignment-group" key={index}>
          <select
            name="user_id"
            value={assignment.user_id}
            onChange={(e) => handleChange(index, 'user_id', e.target.value)}
            required
          >
            <option value="">Seleccione un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          <select
            name="job_position_id"
            value={assignment.job_position_id}
            onChange={(e) => handleChange(index, 'job_position_id', e.target.value)}
            required
          >
            <option value="">Seleccione un puesto</option>
            {jobPositions.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="hours_worked"
            value={assignment.hours_worked}
            onChange={(e) => handleChange(index, 'hours_worked', e.target.value)}
            placeholder="Horas trabajadas"
            required
          />
        </div>
      ))}
      <button type="button" onClick={handleAddAssignment}>Añadir Asignación</button>
      <button type="submit">Guardar Asignaciones</button>
    </form>
  );
};

export default MultiAssignmentForm;