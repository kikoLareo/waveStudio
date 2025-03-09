import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Interfaz para las opciones extendidas de renderizado
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  route?: string;
}

/**
 * Función personalizada de renderizado que envuelve el componente con los proveedores necesarios
 * @param ui - Componente React a renderizar
 * @param options - Opciones de renderizado extendidas
 * @returns Objeto con métodos y propiedades de testing-library
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...renderOptions }: ExtendedRenderOptions = {}
) {
  // Configurar la ruta del navegador si se proporciona
  window.history.pushState({}, 'Test page', route);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

/**
 * Función para crear mocks de objetos con tipos TypeScript
 * @param overrides - Propiedades para sobrescribir en el objeto mock
 * @returns Objeto mock con las propiedades sobrescritas
 */
export function createMock<T>(overrides: Partial<T> = {}): T {
  return overrides as T;
}

/**
 * Función para simular una respuesta de API exitosa
 * @param data - Datos a devolver en la respuesta
 * @returns Promesa resuelta con los datos
 */
export function mockApiSuccess<T>(data: T): Promise<T> {
  return Promise.resolve(data);
}

/**
 * Función para simular un error de API
 * @param error - Error a devolver
 * @returns Promesa rechazada con el error
 */
export function mockApiError(error: Error): Promise<never> {
  return Promise.reject(error);
}
