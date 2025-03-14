import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table/Table';
import GroupedTable from '../components/Table/GroupedTable';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import ErrorModal from '../components/Modal/ErrorModal';
import api from '../services/api';
import logService from '../utils/logService';
import type { SchemaField } from '../schemas/schemas';
import { getComponents } from '../services/componentService';
import { AppError, getFriendlyErrorMessage } from '../utils/errorHandler';
import { processApiError, ApiErrorResponse } from '../utils/apiErrorHandler';
import { AxiosError } from 'axios';

interface GenericPageProps {
  entityId: string;
  entityName: string;
  componentSchema: SchemaField[];
  createSchema?: SchemaField[] | null;
  updateSchema?: SchemaField[] | null;
  onView?: (item: any) => void;
  onRowClick?: (item: any) => void;
  onCellClick?: (item: any, column: SchemaField) => void;
  groupBy?: string;
  onToggleGroup?: (groupId: string) => void;
  expandedGroups?: Set<string>;
  transformData?: (data: any[]) => Record<string, any[]>;
}

const GenericPage: React.FC<GenericPageProps> = ({
  entityId,
  entityName,
  componentSchema,
  createSchema = null,
  updateSchema = null,
  onView,
  onRowClick,
  onCellClick,
  groupBy,
  onToggleGroup,
  expandedGroups,
  transformData
}) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any | null>(null);
  const [schema, setSchema] = useState<SchemaField[]>( componentSchema);
  const [error, setError] = useState<AppError | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const fetchUrl = window.location.pathname;

  logService.log('info', 'GenericPage inicializado', {
    entityId,
    entityName,
    fetchUrl,
    schemaFields: componentSchema.map(f => f.name)
  });

  const fetchItems = useCallback(async () => {
    logService.log('info', 'Iniciando fetchItems', { entityName, fetchUrl });
    try {
      const response = await getComponents(entityId);
      logService.log('info', `Datos de ${entityName} obtenidos exitosamente`, {
        itemCount: response.data.length,
        firstItem: response.data[0]
      });
      setItems(response.data);
    } catch (error) {
      const appError = processApiError(error as AxiosError<ApiErrorResponse>, `obtener ${entityName}`);
      setError(appError);
      setErrorMessage(getFriendlyErrorMessage(appError));
      setErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUrl, entityName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = () => {
    logService.log('info', `Iniciando creación de ${entityName}`);
    setCurrentItem(null);
    setSchema(createSchema || componentSchema);
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    logService.log('info', `Iniciando edición de ${entityName}`, { itemId: item.id });
    setCurrentItem(item);
    setSchema(updateSchema || componentSchema);
    setModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    logService.log('info', `Iniciando eliminación de ${entityName}`, { itemId: item.id });
    try {
      await api.delete(`${fetchUrl}/delete/${item.id}`);
      logService.log('info', `${entityName} eliminado exitosamente`, { itemId: item.id });
      fetchItems();
    } catch (error) {
      const appError = processApiError(error as AxiosError<ApiErrorResponse>, `eliminar ${entityName}`);
      setError(appError);
      setErrorMessage(getFriendlyErrorMessage(appError));
      setErrorModalOpen(true);
    }
  };

  const handleRowClick = (item: any) => {
    logService.log('info', `Click en fila de ${entityName}`, { itemId: item.id });
    if (onRowClick) {
      onRowClick(item);
    } else if (item.id) {
      logService.log('info', `Navegando a detalles de ${entityName}`, { itemId: item.id });
      navigate(`${fetchUrl}/${item.id}`);
    }
  };

  const handleSubmit = async (formData: any) => {
    logService.log('info', `Iniciando envío de formulario de ${entityName}`, { 
      isEdit: !!currentItem?.id,
      formData 
    });

    try {
      if (currentItem?.id) {
        await api.put(`${fetchUrl}/${currentItem.id}`, formData);
        logService.log('info', `${entityName} actualizado exitosamente`, { 
          itemId: currentItem.id 
        });
      } else {
        const response = await api.post(`${fetchUrl}/create`, formData);
        logService.log('info', `${entityName} creado exitosamente`);
        if (response.data && response.data.id) {
          navigate(`${fetchUrl}/${response.data.id}`);
        }
      }
      setModalOpen(false);
      fetchItems();
    } catch (error) {
      const action = currentItem?.id ? 'actualizar' : 'crear';
      const appError = processApiError(error as AxiosError<ApiErrorResponse>, `${action} ${entityName}`);
      setError(appError);
      setErrorMessage(getFriendlyErrorMessage(appError));
      logService.log('error', `Error al ${action} ${entityName}`, { error: appError, formData });
      setErrorModalOpen(true);
    }
  };

  const processedData = transformData ? transformData(items) : (groupBy ? {} : items);

  logService.log('info', 'Renderizando tabla', {
    entityName,
    itemCount: items.length,
    hasGrouping: !!groupBy,
    hasProcessedData: !!processedData
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Crear {entityName}
        </button>
      </div>
      
      {groupBy ? (
        <GroupedTable
          columns={componentSchema}
          data={processedData as Record<string, any[]>}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={onView}
          onRowClick={handleRowClick}
          isLoading={isLoading}
          onToggleGroup={onToggleGroup!}
          expandedGroups={expandedGroups!}
        />
      ) : (
        <Table
          columns={componentSchema}
          data={Array.isArray(processedData) ? processedData : []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={onView}
          onRowClick={handleRowClick}
          isLoading={isLoading}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`${currentItem ? 'Editar' : 'Crear'} ${entityName}`}
      >
        <DynamicForm
          schema={schema}
          initialData={currentItem || {}}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage || `Ha ocurrido un error al procesar la operación`}
      />
    </div>
  );
};

export default GenericPage;
