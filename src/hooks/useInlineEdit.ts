import { useState } from 'react';
import api from '../services/api';
import logService from '../utils/logService';

interface UseInlineEditOptions<T> {
  /**
   * Función para recargar los datos después de guardar
   */
  onRefresh: () => Promise<void>;
  
  /**
   * Endpoint base para las operaciones de actualización (sin barra inicial)
   * Ejemplo: 'roles/update', 'users'
   */
  endpoint: string;
  
  /**
   * ID del elemento que se está editando
   */
  id?: string | number;
  
  /**
   * Mensaje de log para operación exitosa
   */
  successMessage?: string;
  
  /**
   * Mensaje de log para operación fallida
   */
  errorMessage?: string;
}

/**
 * Hook personalizado para manejar la edición en línea en páginas de detalle
 */
function useInlineEdit<T>({
  onRefresh,
  endpoint,
  id,
  successMessage = 'Elemento actualizado exitosamente',
  errorMessage = 'Error al actualizar el elemento'
}: UseInlineEditOptions<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<T> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Inicia el modo de edición con los datos proporcionados
   */
  const startEditing = (initialData: Partial<T>) => {
    setEditData(initialData);
    setIsEditing(true);
  };

  /**
   * Cancela el modo de edición y limpia los datos
   */
  const cancelEditing = () => {
    setIsEditing(false);
    setEditData(null);
  };

  /**
   * Guarda los cambios y vuelve al modo de visualización
   */
  const saveChanges = async (formData: Partial<T>) => {
    if (!id) {
      logService.log('error', 'No se puede actualizar sin ID');
      return;
    }

    setIsSubmitting(true);
    try {
      // Construir la URL de actualización
      const updateUrl = `/${endpoint}/${id}`;
      
      await api.put(updateUrl, formData);
      logService.log('info', successMessage, { id });
      
      // Recargar los datos para mostrar los cambios
      await onRefresh();
      
      // Volver al modo visualización
      setIsEditing(false);
      setEditData(null);
    } catch (error) {
      logService.log('error', errorMessage, { error, id });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    editData,
    isSubmitting,
    startEditing,
    cancelEditing,
    saveChanges
  };
}

export default useInlineEdit;
