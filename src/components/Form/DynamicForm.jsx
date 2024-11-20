import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Biblioteca react-select
import Modal from '../Modal/Modal'; // Componente modal
import './DynamicForm.scss';
import * as schemas from '../../schemas/schemas'; // Importar los schemas dinámicos
import api from '../../services/api';

function DynamicForm({ schema, initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({}); // Opciones de los selects dinámicos
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar el modal
  const [currentField, setCurrentField] = useState(null); // Campo activo para la creación dinámica


  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Manejar cambios en el selector dinámico
  const handleSelectChange = (field, selectedOption) => {
    setFormData({ ...formData, [field.name]: selectedOption?.value || '' });
    if (errors[field.name]) {
      setErrors({ ...errors, [field.name]: null });
    }
  };

  // Validar campos obligatorios
  const validate = () => {
    const newErrors = {};
    schema.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es obligatorio`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Cargar opciones dinámicas para los campos `bdComponent`
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


  const handleDynamicCreation = async (data) => {
    if (currentField) {
      try {
        // Crear el nuevo elemento utilizando Axios
        await api.post(`/${currentField.bdComponent}/create`, data);
  
        // Actualizar las opciones después de crear
        const response = await api.get(`/${currentField.bdComponent}`);
        const newData = response.data;
  
        setOptions((prevOptions) => ({
          ...prevOptions,
          [currentField.name]: newData.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }));
  
        setModalOpen(false); // Cierra el modal
      } catch (error) {
        console.error(`Error creating new ${currentField.name}:`, error);
      }
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
      {schema && schema.map((field) => (
        <div key={field.name} className="form-group">
          <label>
            {field.label} {field.required && <span className="required">*</span>}
          </label>

          {field.bdComponent ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="select-container">
                <Select
                  options={options[field.name] || []}
                  onChange={(selectedOption) => handleSelectChange(field, selectedOption)}
                  placeholder={`Seleccione ${field.label.toLowerCase()}`}
                  value={
                    options[field.name]?.find((option) => option.value === formData[field.name]) || null
                  }
                  isSearchable
                />
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  console.log('Field: ', field);
                  setCurrentField(field);
                  setModalOpen(true);
                }}
              >
                + Añadir
              </button>
            </div>
          ) : (
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

      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>

      {/* Modal dinámico con el schema correspondiente */}
      {isModalOpen && currentField && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h2>Crear nuevo {currentField.label}</h2>
          <DynamicForm
            schema={schemas[currentField.bdComponent]} 
            onSubmit={handleDynamicCreation}
          />
        </Modal>
      )}
    </>
  );
}

export default DynamicForm;