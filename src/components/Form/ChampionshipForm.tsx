import React, { useState } from 'react';
import { MapPin, Calendar, Trophy, Users } from 'lucide-react';
import { SchemaField } from '../../schemas/schemas';

interface ChampionshipFormData {
  name: string;
  location: string;
  organizer: string;
  discipline: string;
  startDate: string;
  endDate: string;
  description?: string;
  maxParticipants?: number;
}

interface ChampionshipFormProps {
  initialData?: Partial<ChampionshipFormData>;
  onSubmit: (data: ChampionshipFormData) => void;
  schema: SchemaField[];
}

const ChampionshipForm: React.FC<ChampionshipFormProps> = ({
  initialData = {},
  onSubmit,
  schema
}) => {
  const [formData, setFormData] = useState<Partial<ChampionshipFormData>>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ChampionshipFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ChampionshipFormData, string>> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }
    if (!formData.organizer?.trim()) {
      newErrors.organizer = 'El organizador es requerido';
    }
    if (!formData.discipline?.trim()) {
      newErrors.discipline = 'La disciplina es requerida';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData as ChampionshipFormData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Campeonato
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.name ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <Trophy className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ubicación
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.location ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.location && (
            <p className="mt-2 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organizador
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              name="organizer"
              value={formData.organizer || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.organizer ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <Users className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.organizer && (
            <p className="mt-2 text-sm text-red-600">{errors.organizer}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Disciplina
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="discipline"
              value={formData.discipline || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.discipline ? 'border-red-300' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.discipline && (
            <p className="mt-2 text-sm text-red-600">{errors.discipline}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Inicio
          </label>
          <div className="mt-1 relative">
            <input
              type="date"
              name="startDate"
              value={formData.startDate || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.startDate ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.startDate && (
            <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Fin
          </label>
          <div className="mt-1 relative">
            <input
              type="date"
              name="endDate"
              value={formData.endDate || ''}
              onChange={handleChange}
              className={`
                block w-full rounded-md shadow-sm
                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                ${errors.endDate ? 'border-red-300' : 'border-gray-300'}
              `}
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.endDate && (
            <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <div className="mt-1">
            <textarea
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Descripción detallada del campeonato..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Máximo de Participantes
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="maxParticipants"
              min="0"
              value={formData.maxParticipants || ''}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {initialData.id ? 'Actualizar Campeonato' : 'Crear Campeonato'}
        </button>
      </div>
    </form>
  );
};

export default ChampionshipForm;