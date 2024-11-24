import React, { useState, useEffect, useCallback } from 'react';
import Table from '../components/Table/Table';
import Modal from '../components/Modal/Modal';
import DynamicForm from '../components/Form/DynamicForm';
import ConfirmDeleteModal from '../components/Modal/ConfirmDeleteModal';
import ErrorModal from '../components/Modal/ErrorModal';
import api from '../services/api';
import logService from '../utils/logger';
import { FaTrash } from 'react-icons/fa';

const GenericPage = ({ entityName, fetchUrl, componentSchema, updateSchema = null }) => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isErrorModalOpen, setErrorModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [schema, setSchema] = useState(componentSchema);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(fetchUrl);
      setItems(response.data);
      logService.log('info', `${entityName}s obtenidos exitosamente`);
    } catch (error) {
      setError(`Error al obtener ${entityName}s`);
      logService.log('error', `Error al obtener ${entityName}s`, error);
      setErrorModalOpen(true);
    }
  }, [fetchUrl, entityName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = () => {
    setCurrentItem({});
    setSchema(componentSchema);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setSchema(updateSchema || componentSchema);
    setModalOpen(true);
  };

  const confirmDelete = (item) => {
    setCurrentItem(item);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!currentItem || !currentItem.id) return;

    try {
      await api.delete(`${fetchUrl}/${currentItem.id}/delete`);
      fetchItems();
      logService.log('info', `${entityName} con ID ${currentItem.id} eliminado exitosamente`);
    } catch (error) {
      setError(`Error al eliminar el ${entityName}`);
      logService.log('error', `Error al eliminar el ${entityName} con ID ${currentItem.id}`, error);
      setErrorModalOpen(true);
    } finally {
      setConfirmModalOpen(false);
      setModalOpen(false);
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
      setErrorModalOpen(true);
    }
  };

  return (
    <div style={{ padding: "0 20px" }}>
      <h1>Gestión de {entityName}s</h1>
      <button onClick={handleCreate} style={{ margin: "10px 0" }}>Crear {entityName}</button>
      <Table
        columns={componentSchema.filter((field) => field.name !== 'password')}
        data={items}
        onEdit={handleEdit}
      />
      {/* Modal de formulario */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <DynamicForm
          schema={schema}
          onSubmit={handleFormSubmit}
          initialData={currentItem}
        />
        {currentItem && currentItem.id && (
          <div className='deleteBtn-container'>
            <button  className="btn-danger" onClick={() => confirmDelete(currentItem)} style={{ marginTop: "10px" }}>
            <FaTrash />
            </button>
          </div>
        )}
      </Modal>
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        entityName={entityName}
      />
      {/* Modal de errores */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={error}
      />
    </div>
  );
};

export default GenericPage;