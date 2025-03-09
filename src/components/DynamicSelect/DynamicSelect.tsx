import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react'; // o tu spinner preferido
import {getComponents} from '../../services/componentService'; // ajusta el import si es necesari
import logService from '../../utils/logService';

interface DynamicSelectProps {
  resourceName: string;                    // nombre del recurso: 'users', 'job-positions', etc.
  value: number;                           // valor seleccionado
  onChange: (value: string) => void;       // función cuando cambia el valor
  label: string;                           // etiqueta visible del campo
  placeholder?: string;                    // texto por defecto en el select
  idField?: string;                        // campo del objeto para usar como id (default: 'id')
  labelField?: string;                     // campo del objeto para usar como label (default: 'title')
  icon?: React.ElementType;                // icono opcional para el select
  disabled?: boolean;
}
export const DynamicSelect: React.FC<DynamicSelectProps> = ({
    resourceName,
    value,
    onChange,
    label,
    placeholder = 'Seleccione una opción',
    idField = 'id',
    labelField = 'title',
    icon: Icon,
    disabled = false
  }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchOptions = async () => {
        setLoading(true);
        try {
          const response = await getComponents(resourceName);
          setOptions(response.data || []);
          logService.log('info', `Datos de ${resourceName} cargados en DynamicSelect`);
        } catch (error) {
          logService.log('error', `Error al obtener ${resourceName}`, { error });
        } finally {
          setLoading(false);
        }
      };
  
      fetchOptions();
    }, [resourceName]);
  
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select
          disabled={disabled || loading}
          value={value ?? ''}
          onChange={(e) => {
            const selected = options.find(opt => String(opt[idField]) === e.target.value);
            onChange(selected);
          }}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
        >
          <option value="">{loading ? 'Cargando...' : placeholder}</option>
          {options.map((item) => (
            <option key={item[idField]} value={item[idField]}>
              {item[labelField]}
            </option>
          ))}
        </select>
  
        {Icon && (
          <Icon className="absolute right-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
        )}
        {loading && (
          <Loader className="absolute right-8 top-9 h-5 w-5 animate-spin text-blue-500" />
        )}
      </div>
    );
  };
  