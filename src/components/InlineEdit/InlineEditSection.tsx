import React from 'react';
import DynamicForm from '../Form/DynamicForm';
import { SchemaField } from '../../schemas/schemas';

interface InlineEditSectionProps<T> {
  /**
   * Indica si está en modo edición
   */
  isEditing: boolean;
  
  /**
   * Datos iniciales para el formulario
   */
  editData: Partial<T> | null;
  
  /**
   * Esquema de campos para el formulario
   */
  schema: SchemaField[];
  
  /**
   * Función para guardar cambios
   */
  onSave: (data: Record<string, any>) => Promise<void> | void;
  
  /**
   * Función para cancelar la edición
   */
  onCancel: () => void;
  
  /**
   * Componente a mostrar en modo visualización
   */
  viewComponent: React.ReactNode;
  
  /**
   * Clase CSS adicional para el contenedor
   */
  className?: string;
}

/**
 * Componente para alternar entre modo visualización y edición
 */
function InlineEditSection<T extends Record<string, any>>({
  isEditing,
  editData,
  schema,
  onSave,
  onCancel,
  viewComponent,
  className = ''
}: InlineEditSectionProps<T>) {
  return (
    <div className={className}>
      {isEditing ? (
        <DynamicForm
          schema={schema}
          initialData={editData || {}}
          onSubmit={onSave}
          onCancel={onCancel}
        />
      ) : (
        viewComponent
      )}
    </div>
  );
}

export default InlineEditSection;
