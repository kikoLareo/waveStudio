import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './DynamicForm.scss';
import { FaTrash } from 'react-icons/fa';
import LocationSelector from '../LocationSelector/LocationSelector';

function DynamicForm({ schema, initialData = {}, onSubmit, onDelete = null }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  // Maneja el cambio en inputs y actualiza el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'confirmPassword' || name === 'newPassword') {
      if (name === 'confirmPassword' && formData.newPassword && value !== formData.newPassword) {
        setErrors({ ...errors, confirmPassword: 'Las contraseñas no coinciden' });
      } else {
        const { confirmPassword, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  // Maneja el cambio en selectores dinámicos
  const handleSelectChange = (field, selectedOption) => {
    setFormData({ ...formData, [field.name]: selectedOption?.value || '' });
    if (errors[field.name]) {
      const { [field.name]: _, ...rest } = errors;
      setErrors(rest); // Elimina el error si se corrige
    }
  };

  // Carga las opciones dinámicas para los campos `bdComponent`
  useEffect(() => {
    const fetchOptions = async () => {
      const newOptions = {};
      for (const field of schema) {
        if (field.bdComponent) {
          try {
            const response = await fetch(`http://localhost:8000/${field.bdComponent}`);
            const data = await response.json();
            newOptions[field.name] = data.map((item) => ({
              value: item.id,
              label: item.name,
            }));
          } catch (error) {
            console.error(`Error fetching options for ${field.name}:`, error);
          }
        }
      }
      setOptions(newOptions);
    };
    fetchOptions();
  }, [schema]);

  // Valida los campos del formulario
  const validate = () => {
    const newErrors = {};
    schema.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es obligatorio`;
      }
    });

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
            {field.bdComponent ? (
            // Selector dinámico para campos de base de datos
            <Select
              options={options[field.name] || []}
              onChange={(selectedOption) => handleSelectChange(field, selectedOption)}
              placeholder={`Seleccione ${field.label}`}
              value={options[field.name]?.find((option) => option.value === formData[field.name]) || null}
              isSearchable
            />
          ) : field.type === "map" ? (
            // Componente para seleccionar ubicaciones en un mapa
            <LocationSelector
              onLocationSelect={(location) => {
                setFormData({
                  ...formData,
                  [field.name]: location.name, // Nombre de la ubicación
                  latitude: location.latitude, // Latitud de la ubicación
                  longitude: location.longitude, // Longitud de la ubicación
                });
              }}
            />
          ) : (
            // Entrada estándar para otros tipos de campos
            <input
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder || ''}
            />
          )}
            {errors[field.name] && <div className="error-message">{errors[field.name]}</div>}
          </div>
        ))}

        <button type="submit" className="btn-primary">Guardar</button>
      </form>

      {onDelete && (
        <div className="deleteBtn-container">
          <button onClick={onDelete} className="btn-danger">
            <FaTrash size={20} />
          </button>
        </div>
      )}
    </>
  );
}

export default DynamicForm;