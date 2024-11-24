import React, { useState, useEffect } from 'react';
import './DynamicForm.scss';
import { FaTrash } from 'react-icons/fa';

function DynamicForm({ schema, initialData = {}, onSubmit, onDelete = null }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validar contraseñas en tiempo real
    if (name === 'confirmPassword' || name === 'newPassword') {
      if (name === 'confirmPassword' && formData.newPassword && value !== formData.newPassword) {
        setErrors({ ...errors, confirmPassword: 'Las contraseñas no coinciden' });
      } else {
        const { confirmPassword, ...rest } = errors;
        setErrors(rest); // Eliminar el error si las contraseñas coinciden
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    schema.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es obligatorio`;
      }
    });

    // Validar contraseñas
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      {schema.map((field) => (
        <div key={field.name} className="form-group">
          <label>
            {field.label} {field.required && <span className="required">*</span>}
          </label>
          <input
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            placeholder={field.placeholder || ''}
            onBlur={(e) => {
              if (field.name === 'confirmPassword') {
                if (formData.newPassword !== formData.confirmPassword) {
                  setErrors({
                    ...errors,
                    confirmPassword: 'Las contraseñas no coinciden',
                  });
                }
              }
            }}
          />
          {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
        </div>
      ))}

        <button type="submit" className="btn-primary">
          Guardar
        </button>

    </form>
    <div className="deleteBtn-container">
        {onDelete && (
          <button
            onClick={() => onDelete()}
            className="btn-danger"
          >
            <FaTrash size={20} />
          </button>
        )}
    </div>
    </>
  );
  
}

export default DynamicForm;