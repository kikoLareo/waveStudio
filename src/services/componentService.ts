// componentService.ts
import logService from '../utils/logService';
import api from './api';

/**
 * Obtiene todos los registros de un componente.
 * @param component Nombre del componente (ej: 'users', 'organizers', etc.)
 * @returns Una promesa que resuelve con los datos obtenidos.
 */
export const getComponents = async (component: string): Promise<any> => {
  logService.log('info', 'Recuperando datos del componente:', { component });
  const response = await api.get(`/${component}`);
  return response;
};

/**
 * Obtiene un registro de un componente por su ID.
 * @param component Nombre del componente (ej: 'users', 'organizers', etc.)
 * @param id Identificador del registro
 * @returns Una promesa que resuelve con el registro obtenido.
 */
export const getComponentById = async (component: string, id: string): Promise<any> => {
  const response = await api.get(`/${component}/${id}`);
  return response;
};

/**
 * Crea un nuevo registro para un componente.
 * @param component Nombre del componente (ej: 'users', 'organizers', etc.)
 * @param data Objeto con los datos a crear.
 * @returns Una promesa que resuelve con el registro creado.
 */
export const createComponent = async (component: string, data: any): Promise<any> => {
  const response = await api.post(`/${component}`, data);
  return response.data;
};

/**
 * Actualiza un registro existente de un componente.
 * @param component Nombre del componente (ej: 'users', 'organizers', etc.)
 * @param id Identificador del registro a actualizar.
 * @param data Objeto con los datos a actualizar.
 * @returns Una promesa que resuelve con el registro actualizado.
 */
export const updateComponent = async (component: string, id: string, data: any): Promise<any> => {
  const response = await api.put(`/${component}/${id}`, data);
  return response.data;
};

/**
 * Elimina un registro de un componente.
 * @param component Nombre del componente (ej: 'users', 'organizers', etc.)
 * @param id Identificador del registro a eliminar.
 * @returns Una promesa que resuelve con la respuesta de la eliminación.
 */
export const deleteComponent = async (component: string, id: string): Promise<any> => {
  const response = await api.delete(`/${component}/${id}`);
  return response.data;
};
