import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import logService from '../../utils/logService';
import { SchemaField, returnSchema, SchemaName } from '../../schemas/schemas';
import Modal from '../Modal/Modal';
import { getComponents } from '../../services/componentService';
import { handleFormErrors } from '../../utils/formErrorHandler';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../../utils/apiErrorHandler';

interface DynamicFormProps {
  schema: SchemaField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  onDelete?: () => void;
  onCancel?: () => void;
  /** Opcional: callback para actualizar las opciones de un campo en el formulario padre */
  onNewOptionCreated?: (fieldName: string, newOption: { value: string; label: string }) => void;
}

interface Option {
  value: string;
  label: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  initialData = {},
  onSubmit,
  onDelete,
  onCancel,
  onNewOptionCreated
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  // Estado para controlar el modal anidado
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  // Guardamos el campo para el que se abre el modal (para campos con bdComponent)
  const [currentField, setCurrentField] = useState<SchemaField | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      const newOptions: Record<string, Option[]> = {};
      for (const field of schema) {
        if (field.bdComponent) {
          try {
            const response = await getComponents(`${field.bdComponent}`);
            newOptions[field.name] = response.data.map((item: any) => ({
              value: item.id,
              label: item.name || item.title || item.username
            }));
          } catch (error) {
            logService.log('error', `Error fetching options for ${field.name}`, { error });
          }
        }
      }
      setOptions(newOptions);
    };

    fetchOptions();
  }, [schema]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    schema.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
    });

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    logService.log('info', 'Form submit', { formData });
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        logService.log('error', 'Error submitting form', { error });
        
        // Procesar errores de validación del backend
        if (error && (error as AxiosError).response) {
          const fieldErrors = handleFormErrors(error as AxiosError<ApiErrorResponse>);
          setErrors(fieldErrors);
          
          // Si hay un error general, mostrarlo en un campo especial
          if (fieldErrors._general) {
            setErrors(prev => ({
              ...prev,
              _general: fieldErrors._general
            }));
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Función para el envío del formulario del modal anidado
  const handleNewItemSubmit = async (data: Record<string, any>) => {
    if (!currentField || !currentField.bdComponent) return;

    try {
      const response = await api.post(`/${currentField.bdComponent}`, data);
      logService.log('info', `Nuevo ${currentField.label} creado`, { data: response.data });

      const newOption = {
        value: response.data.id,
        label: response.data.name || response.data.title
      };

      // Actualiza las opciones para el select correspondiente
      setOptions(prevOptions => ({
        ...prevOptions,
        [currentField.name]: [...(prevOptions[currentField.name] || []), newOption]
      }));

      // Actualiza el formData para seleccionar el nuevo elemento
      setFormData(prev => ({
        ...prev,
        [currentField.name]: response.data.id
      }));

      if (onNewOptionCreated) {
        onNewOptionCreated(currentField.name, newOption);
      }
      // Cierra solo el modal anidado
      setIsNewModalOpen(false);
    } catch (error) {
      logService.log('error', 'Error al crear nuevo elemento', { error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {schema.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="mt-1">
            {field.bdComponent ? (
              <div className="flex gap-2">
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`
                    block w-full rounded-md shadow-sm
                    focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    ${errors[field.name] ? 'border-red-300' : 'border-gray-300'}
                  `}
                >
                  <option value="">Seleccione {field.label}</option>
                  {options[field.name]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    logService.log('info', 'Abrir modal para nuevo', { field: field.name });
                    setCurrentField(field);
                    setIsNewModalOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nuevo
                </button>
              </div>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={`
                  block w-full rounded-md shadow-sm
                  focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                  ${errors[field.name] ? 'border-red-300' : 'border-gray-300'}
                `}
              />
            )}
          </div>
          {errors[field.name] && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      {/* Mensaje de error general */}
      {errors._general && (
        <div className="p-3 bg-red-50 rounded-md">
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{errors._general}</span>
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Guardando...
              </span>
            ) : (
              'Guardar'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Modal anidado para crear un nuevo elemento para el campo seleccionado */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title={`${currentField ? 'Crear' : 'Nuevo'} ${currentField?.label}`}
      >
        <DynamicForm
      // Usamos el schema específico del componente relacionado
      schema={
        currentField?.bdComponent
          ? returnSchema(currentField.bdComponent as SchemaName)
          : []
      }
      onSubmit={handleNewItemSubmit}
      onCancel={() => setIsNewModalOpen(false)}
        />
      </Modal>
    </form>
  );
};

export default DynamicForm;
