// src/components/Form/DynamicForm.js
import React, { useState } from 'react';
import './DynamicForm.scss';

function DynamicForm({ schema, initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState(initialData);

  // Actualiza los datos del formulario cuando cambian los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {schema.map((field) => (
        <div key={field.name} className="form-group">
          <label>{field.label}</label>
          <input
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            placeholder={field.placeholder || ''}
            required={field.required || false}
          />
        </div>
      ))}
      <button type="submit" >Guardar</button>
    </form>
  );
}

export default DynamicForm;