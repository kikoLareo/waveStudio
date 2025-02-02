import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import logService from '../../utils/logService';
import { SchemaField } from '../../schemas/schemas';

interface DynamicFormProps {
  schema: SchemaField[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onDelete?: () => void;
}

interface Option {
  value: string;
  label: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  initialData = {},
  onSubmit,
  onDelete
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      const newOptions: Record<string, Option[]> = {};
      
      for (const field of schema) {
        if (field.bdComponent) {
          try {
            const response = await api.get(`/${field.bdComponent}`);
            newOptions[field.name] = response.data.map((item: any) => ({
              value: item.id,
              label: item.name || item.title
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
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        logService.log('error', 'Error submitting form', { error });
      } finally {
        setIsLoading(false);
      }
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

      <div className="flex justify-between pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default DynamicForm;