import React, { useState, useEffect, useCallback } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import api from '../services/api';
import logService from '../utils/logger';

const GenericPage = ({ entityName, fetchUrl, createSchema, updateSchema }) => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [schema, setSchema] = useState(createSchema);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(fetchUrl);
      setItems(response.data);
      logService.log('info', `${entityName}s obtenidos exitosamente`);
    } catch (error) {
      setError(`Error al obtener ${entityName}s`);
      logService.log('error', `Error al obtener ${entityName}s`, error);
    }
  }, [fetchUrl, entityName]); // Depende solo de `fetchUrl` y `entityName`

  useEffect(() => {
    fetchItems();
  }, [fetchItems]); // Ahora puedes incluir fetchItems como dependencia

  const handleCreate = () => {
    setCurrentItem({});
    setSchema(createSchema);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setSchema(updateSchema);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${fetchUrl}/delete/${id}`);
      fetchItems();
      logService.log('info', `${entityName} con ID ${id} eliminado exitosamente`);
    } catch (error) {
      setError(`Error al eliminar el ${entityName}`);
      logService.log('error', `Error al eliminar el ${entityName} con ID ${id}`, error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentItem && currentItem.id) {
        await api.put(`${fetchUrl}/${currentItem.id}/update`, formData);
        logService.log('info', `${entityName} con ID ${currentItem.id} actualizado exitosamente`);
      } else {
        await api.post(`${fetchUrl}/create`, formData);
        logService.log('info', `Nuevo ${entityName} creado exitosamente`);
      }
      setModalOpen(false);
      fetchItems();
    } catch (error) {
      setError(`Error al crear o actualizar el ${entityName}`);
      logService.log('error', `Error al crear o actualizar el ${entityName}`, error);
    }
  };

  return (
    <div>
      <h1>Gestión de {entityName}s</h1>
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleCreate}>Crear {entityName}</button>
      <Table
        columns={createSchema}
        data={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DynamicForm
          schema={schema}
          onSubmit={handleFormSubmit}
          initialData={currentItem}
        />
      </Modal>
    </div>
  );
};

export default GenericPage;