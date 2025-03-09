import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComponentById } from '../services/componentService';

import { 
  ArrowLeft,
  Shield,
  Edit,
  Calendar,
  Phone,
  Mail,
  Globe,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import logService from '../utils/logService';
import { useAuth } from '../context/AuthContext';

interface DisciplineData {
  id: string;
  name: string;
  description: string;
  placement: string; // Dirección o ubicación
  phone: string;
  email: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const DisciplineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState<DisciplineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { hasRole } = useAuth();
  
  const canEdit =  hasRole(1) || hasRole(2);
  useEffect(() => {
    const fetchDisciplineDetails = async () => {
      try {
        if (!id) {
          throw new Error('ID is undefined');
        }
        const response = await getComponentById(`disciplines`, id);
        setDiscipline(response.data);
        logService.log('info', `Detalles del organizador ${id} obtenidos exitosamente`);
      } catch (error) {
        const errorMessage = 'Error al obtener los detalles del organizador';
        setError(errorMessage);
        logService.log('error', errorMessage, { error });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDisciplineDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleEdit = async () => {
    try {
      await api.put(`disciplines/${id}/update`, discipline);
      logService.log('info', `Organizador ${id} actualizado exitosamente`);
      setEditMode(false);
    } catch (error) {
      const errorMessage = 'Error al actualizar el organizador';
      setError(errorMessage);
      logService.log('error', errorMessage, { error });
    }
  }

  if (error || !discipline) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || 'No se encontró el organizador'}
        </div>
      </div>
    );
  }

  // Construimos la URL del mapa de Google Maps.
  // Recuerda reemplazar YOUR_API_KEY por tu clave real de la API de Google Maps.
  const mapUrl = discipline.placement
    ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(discipline.placement)}`
    : null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Encabezado */}
        <div className="p-8 border-b border-gray-200 flex justify-between items-center">
          <div>
            {/* Nombre de la Disciplina */}
            {editMode ? (
              <input
                type="text"
                value={discipline.name}
                autoFocus
                onChange={(e) => setDiscipline({ ...discipline, name: e.target.value })}
                className="text-2xl font-bold text-gray-900 focus:outline-none background-gray-50 border-b border-gray-200"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{discipline.name}</h1>
            )}

          </div>
          {/* Botón de Editar */}
          {canEdit && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Edit className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Detalles del Organizador */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
          </div>
        </div>

        {editMode && (
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleEdit}
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {/* Información Adicional */}
        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Creado</p>
                <p className="text-gray-900">
                  {new Date(discipline.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Última Actualización</p>
                <p className="text-gray-900">
                  {new Date(discipline.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisciplineDetail;
