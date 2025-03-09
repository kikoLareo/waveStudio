import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import FilterableTable from './FilterableTable';
import { SchemaField } from '../../schemas/schemas';

describe('FilterableTable Component', () => {
  // Datos de prueba
  const mockColumns: SchemaField[] = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'status', label: 'Estado', type: 'text', required: false },
    { name: 'date', label: 'Fecha', type: 'date', required: false }
  ];

  const mockData = [
    { id: 1, name: 'Juan Pérez', status: 'Activo', date: '2023-01-15' },
    { id: 2, name: 'María López', status: 'Inactivo', date: '2023-02-20' },
    { id: 3, name: 'Carlos Ruiz', status: 'Activo', date: '2023-03-10' }
  ];

  const mockFilters = [
    {
      field: 'status',
      type: 'select' as const,
      label: 'Estado',
      options: [
        { label: 'Activo', value: 'Activo' },
        { label: 'Inactivo', value: 'Inactivo' }
      ]
    },
    {
      field: 'name',
      type: 'text' as const,
      label: 'Nombre'
    },
    {
      field: 'date',
      type: 'date-range' as const,
      label: 'Fecha'
    }
  ];

  // Mocks para los handlers
  const onRowClickMock = vi.fn();
  const onViewMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with data and filters', () => {
    renderWithProviders(
      <FilterableTable
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRowClick={onRowClickMock}
        onView={onViewMock}
      />
    );

    // Verificar que se muestra el botón de filtros
    expect(screen.getByText('Filtros avanzados')).toBeInTheDocument();

    // Verificar que se muestran los datos
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María López')).toBeInTheDocument();
    expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
  });

  it('shows filter controls when filter button is clicked', async () => {
    renderWithProviders(
      <FilterableTable
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRowClick={onRowClickMock}
        onView={onViewMock}
      />
    );

    // Hacer clic en el botón de filtros
    fireEvent.click(screen.getByText('Filtros avanzados'));

    // Verificar que se muestran los controles de filtro
    await waitFor(() => {
      // Verificar que se muestran los controles de filtro
      expect(screen.getByRole('combobox', { name: 'Estado' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Nombre' })).toBeInTheDocument();
      
      // Verificar que se muestra el botón para aplicar filtros
      expect(screen.getByText('Aplicar filtros')).toBeInTheDocument();
    });

    // Verificar que se muestra el botón para aplicar filtros
    expect(screen.getByText('Aplicar filtros')).toBeInTheDocument();
  });

  it('filters data by status when select filter is applied', async () => {
    renderWithProviders(
      <FilterableTable
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRowClick={onRowClickMock}
        onView={onViewMock}
      />
    );

    // Hacer clic en el botón de filtros
    fireEvent.click(screen.getByText('Filtros avanzados'));

    // Seleccionar el filtro de estado "Activo"
    const statusSelect = screen.getByLabelText('Estado');
    fireEvent.change(statusSelect, { target: { value: 'Activo' } });

    // Hacer clic en el botón para aplicar filtros
    fireEvent.click(screen.getByText('Aplicar filtros'));

    // Verificar que solo se muestran los elementos con estado "Activo"
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
      expect(screen.queryByText('María López')).not.toBeInTheDocument();
    });
  });

  it('filters data by name when text filter is applied', async () => {
    renderWithProviders(
      <FilterableTable
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRowClick={onRowClickMock}
        onView={onViewMock}
      />
    );

    // Hacer clic en el botón de filtros
    fireEvent.click(screen.getByText('Filtros avanzados'));

    // Ingresar texto en el filtro de nombre
    const nameInput = screen.getByPlaceholderText('Buscar por nombre');
    fireEvent.change(nameInput, { target: { value: 'Juan' } });

    // Hacer clic en el botón para aplicar filtros
    fireEvent.click(screen.getByText('Aplicar filtros'));

    // Verificar que solo se muestra el elemento con nombre que contiene "Juan"
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.queryByText('María López')).not.toBeInTheDocument();
      expect(screen.queryByText('Carlos Ruiz')).not.toBeInTheDocument();
    });
  });

  it('clears all filters when clear button is clicked', async () => {
    renderWithProviders(
      <FilterableTable
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRowClick={onRowClickMock}
        onView={onViewMock}
      />
    );

    // Hacer clic en el botón de filtros
    fireEvent.click(screen.getByText('Filtros avanzados'));

    // Seleccionar el filtro de estado "Activo"
    const statusSelect = screen.getByLabelText('Estado');
    fireEvent.change(statusSelect, { target: { value: 'Activo' } });

    // Hacer clic en el botón para aplicar filtros
    fireEvent.click(screen.getByText('Aplicar filtros'));

    // Verificar que solo se muestran los elementos con estado "Activo"
    await waitFor(() => {
      expect(screen.queryByText('María López')).not.toBeInTheDocument();
    });

    // Hacer clic en el botón para limpiar filtros
    fireEvent.click(screen.getByText('Limpiar filtros'));

    // Verificar que se muestran todos los elementos nuevamente
    await waitFor(() => {
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María López')).toBeInTheDocument();
      expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
    });
  });

  it('calls onRowClick when a row is clicked', () => {
    renderWithProviders(
      <FilterableTable
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRowClick={onRowClickMock}
        onView={onViewMock}
      />
    );

    // Hacer clic en una fila
    fireEvent.click(screen.getByText('Juan Pérez'));

    // Verificar que se llamó a la función onRowClick con los datos correctos
    expect(onRowClickMock).toHaveBeenCalledTimes(1);
    expect(onRowClickMock).toHaveBeenCalledWith(mockData[0]);
  });
});
