import React, { useState } from 'react';
import { Briefcase, DollarSign, Clock } from 'lucide-react';

interface JobPositionFormData {
  title: string;
  description: string;
  hourlyRate: number;
  minHours: number;
  maxHours: number;
  requirements: string;
}

interface JobPositionFormProps {
  initialData?: Partial<JobPositionFormData>;
  onSubmit: (data: JobPositionFormData) => void;
}

const JobPositionForm: React.FC<JobPositionFormProps> = ({
  initialData = {},
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<JobPositionFormData>>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof JobPositionFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof JobPositionFormData, string>> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!formData.hourlyRate || formData.hourlyRate <= 0) {
      newErrors.hourlyRate = 'La tarifa por hora debe ser mayor a 0';
    }
    if (formData.minHours && formData.maxHours && formData.minHours > formData.maxHours) {
      newErrors.maxHours = 'Las horas máximas deben ser mayores a las mínimas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as JobPositionFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título del Puesto
        </label>
        <div className="mt-1 relative">
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={`
              block w-full rounded-md shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${errors.title ? 'border-red-300' : 'border-gray-300'}
            `}
          />
          <Briefcase className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.title && (
          <p className="mt-2 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <div className="mt-1">
          <textarea
            name="description"
            rows={3}
            value={formData.description || ''}
            onChange={handleChange}
            className={`
              block w-full rounded-md shadow-sm
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${errors.description ? 'border-red-300' : 'border-gray-300'}
            `}
            placeholder="Descripción detallada del puesto..."
          />
        </div>
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tarifa por Hora
          </label>
          <div className="mt-1 relative">
            <input
              type="number"
              name="hourlyRate"
              min="0"
              step="0.01"
              value={formData.hourlyRate || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.hourlyRate ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <DollarSign className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.hourlyRate && (
            <p className="mt-2 text-sm text-red-600">{errors.hourlyRate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Horas Mínimas
          </label>
          <div className="mt-1 relative">
            <input
              type="number"
              name="minHours"
              min="0"
              value={formData.minHours || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.minHours ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.minHours && (
            <p className="mt-2 text-sm text-red-600">{errors.minHours}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Horas Máximas
          </label>
          <div className="mt-1 relative">
            <input
              type="number"
              name="maxHours"
              min="0"
              value={formData.maxHours || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.maxHours ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.maxHours && (
            <p className="mt-2 text-sm text-red-600">{errors.maxHours}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Requisitos
        </label>
        <div className="mt-1">
          <textarea
            name="requirements"
            rows={3}
            value={formData.requirements || ''}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Requisitos específicos para el puesto..."
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData.title ? 'Actualizar Puesto' : 'Crear Puesto'}
        </button>
      </div>
    </form>
  );
};

export default JobPositionForm;