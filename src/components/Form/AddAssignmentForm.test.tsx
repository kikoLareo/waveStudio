import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import AddAssignmentForm from './AddAssignmentForm';
import api from '../../services/api';

// Mock del módulo api
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

// Mock del módulo logService
vi.mock('../../utils/logService', () => ({
  default: {
    log: vi.fn()
  }
}));

describe('AddAssignmentForm Component', () => {
  const mockChampionshipId = '123';
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  // Datos de prueba
  const mockUsers = [
    { id: '1', username: 'user1' },
    { id: '2', username: 'user2' }
  ];

  const mockJobPositions = [
    { id: '1', title: 'Juez' },
    { id: '2', title: 'Asistente' }
  ];

  const mockChampionship = {
    id: '123',
    name: 'Campeonato de Prueba',
    start_date: '2023-05-01',
    end_date: '2023-05-10'
  };

  const mockAssignments: any[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configurar mocks para las llamadas a la API
    (api.get as any).mockImplementation((url: string) => {
      if (url === '/users') {
        return Promise.resolve({ data: mockUsers });
      } else if (url === '/job-positions') {
        return Promise.resolve({ data: mockJobPositions });
      } else if (url === '/assignments') {
        return Promise.resolve({ data: mockAssignments });
      } else if (url === `/championships/${mockChampionshipId}`) {
        return Promise.resolve({ data: mockChampionship });
      }
      return Promise.reject(new Error('URL no reconocida'));
    });

    (api.post as any).mockResolvedValue({});
  });

  it('renders correctly with loaded data', async () => {
    renderWithProviders(
      <AddAssignmentForm
        championshipId={mockChampionshipId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/users');
      expect(api.get).toHaveBeenCalledWith('/job-positions');
      expect(api.get).toHaveBeenCalledWith(`/championships/${mockChampionshipId}`);
    });

    // Verificar que se muestra el título del formulario
    expect(screen.getByText('Añadir Personal al Campeonato')).toBeInTheDocument();

    // Verificar que se muestran los campos del formulario
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Puesto de Trabajo')).toBeInTheDocument();
    expect(screen.getByText('Horas Trabajadas')).toBeInTheDocument();
    expect(screen.getByText('Fecha de Inicio')).toBeInTheDocument();
    expect(screen.getByText('Fecha de Fin')).toBeInTheDocument();

    // Verificar que se muestran los botones
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
  });

  it('shows validation errors when submitting with empty fields', async () => {
    renderWithProviders(
      <AddAssignmentForm
        championshipId={mockChampionshipId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(4);
    });

    // Hacer clic en el botón de guardar sin completar los campos
    fireEvent.click(screen.getByText('Guardar'));

    // Verificar que se muestran los mensajes de error de validación
    await waitFor(() => {
      // Verificar que se muestra el resumen de errores
      expect(screen.getByText('Por favor, corrija los siguientes errores:')).toBeInTheDocument();
      
      // Verificar que se muestran los mensajes de error específicos
      const errorMessages = screen.getAllByText('El usuario es obligatorio');
      expect(errorMessages.length).toBeGreaterThan(0);
      
      expect(screen.getAllByText('El puesto de trabajo es obligatorio').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Las horas trabajadas deben ser mayores que 0').length).toBeGreaterThan(0);
    });

    // Verificar que no se llamó a la API para crear la asignación
    expect(api.post).not.toHaveBeenCalled();
  });

  it('validates that end date is after start date', async () => {
    renderWithProviders(
      <AddAssignmentForm
        championshipId={mockChampionshipId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(4);
    });

    // Completar los campos del formulario con fechas inválidas
    // Seleccionar usuario (haciendo clic en el dropdown y seleccionando una opción)
    const userDropdown = screen.getByText('Seleccionar usuario');
    fireEvent.click(userDropdown);
    
    // Esperar a que aparezca la lista de opciones y seleccionar la primera
    await waitFor(() => {
      const userOption = screen.getByText('user1');
      fireEvent.click(userOption);
    });
    
    // Seleccionar puesto de trabajo
    const jobDropdown = screen.getByText('Seleccionar puesto');
    fireEvent.click(jobDropdown);
    
    // Esperar a que aparezca la lista de opciones y seleccionar la primera
    await waitFor(() => {
      const jobOption = screen.getByText('Juez');
      fireEvent.click(jobOption);
    });
    
    // Ingresar horas trabajadas
    const hoursInput = screen.getByRole('spinbutton');
    fireEvent.change(hoursInput, { target: { value: '8' } });
    
    // Ingresar fechas inválidas (fin antes que inicio)
    const startDateInput = screen.getByLabelText('Fecha de Inicio');
    fireEvent.change(startDateInput, { target: { value: '2023-05-10' } });
    
    const endDateInput = screen.getByLabelText('Fecha de Fin');
    fireEvent.change(endDateInput, { target: { value: '2023-05-01' } });

    // Hacer clic en el botón de guardar
    fireEvent.click(screen.getByText('Guardar'));

    // Verificar que se muestra el mensaje de error de validación de fechas
    await waitFor(() => {
      const errorMessages = screen.getAllByText('La fecha de fin debe ser posterior a la fecha de inicio');
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    // Verificar que no se llamó a la API para crear la asignación
    expect(api.post).not.toHaveBeenCalled();
  });

  it('submits form successfully with valid data', async () => {
    renderWithProviders(
      <AddAssignmentForm
        championshipId={mockChampionshipId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(4);
    });

    // Completar los campos del formulario con datos válidos
    // Seleccionar usuario (haciendo clic en el dropdown y seleccionando una opción)
    const userDropdown = screen.getByText('Seleccionar usuario');
    fireEvent.click(userDropdown);
    
    // Esperar a que aparezca la lista de opciones y seleccionar la primera
    await waitFor(() => {
      const userOption = screen.getByText('user1');
      fireEvent.click(userOption);
    });
    
    // Seleccionar puesto de trabajo
    const jobDropdown = screen.getByText('Seleccionar puesto');
    fireEvent.click(jobDropdown);
    
    // Esperar a que aparezca la lista de opciones y seleccionar la primera
    await waitFor(() => {
      const jobOption = screen.getByText('Juez');
      fireEvent.click(jobOption);
    });
    
    // Ingresar horas trabajadas
    const hoursInput = screen.getByRole('spinbutton');
    fireEvent.change(hoursInput, { target: { value: '8' } });
    
    // Ingresar fechas válidas
    const startDateInput = screen.getByLabelText('Fecha de Inicio');
    fireEvent.change(startDateInput, { target: { value: '2023-05-01' } });
    
    const endDateInput = screen.getByLabelText('Fecha de Fin');
    fireEvent.change(endDateInput, { target: { value: '2023-05-10' } });

    // Hacer clic en el botón de guardar
    fireEvent.click(screen.getByText('Guardar'));

    // Verificar que se llamó a la API para crear la asignación
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/assignments', expect.objectContaining({
        championship_id: mockChampionshipId,
        hours_worked: 8,
        start_date: '2023-05-01',
        end_date: '2023-05-10'
      }));
    });

    // Verificar que se llamó a la función onSuccess
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('handles API errors correctly', async () => {
    // Configurar el mock para que falle
    (api.post as any).mockRejectedValue({
      response: {
        data: {
          detail: 'Error al crear la asignación'
        }
      }
    });

    renderWithProviders(
      <AddAssignmentForm
        championshipId={mockChampionshipId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(4);
    });

    // Completar los campos del formulario con datos válidos
    // Seleccionar usuario (haciendo clic en el dropdown y seleccionando una opción)
    const userDropdown = screen.getByText('Seleccionar usuario');
    fireEvent.click(userDropdown);
    
    // Esperar a que aparezca la lista de opciones y seleccionar la primera
    await waitFor(() => {
      const userOption = screen.getByText('user1');
      fireEvent.click(userOption);
    });
    
    // Seleccionar puesto de trabajo
    const jobDropdown = screen.getByText('Seleccionar puesto');
    fireEvent.click(jobDropdown);
    
    // Esperar a que aparezca la lista de opciones y seleccionar la primera
    await waitFor(() => {
      const jobOption = screen.getByText('Juez');
      fireEvent.click(jobOption);
    });
    
    // Ingresar horas trabajadas
    const hoursInput = screen.getByRole('spinbutton');
    fireEvent.change(hoursInput, { target: { value: '8' } });
    
    // Ingresar fechas válidas
    const startDateInput = screen.getByLabelText('Fecha de Inicio');
    fireEvent.change(startDateInput, { target: { value: '2023-05-01' } });
    
    const endDateInput = screen.getByLabelText('Fecha de Fin');
    fireEvent.change(endDateInput, { target: { value: '2023-05-10' } });

    // Hacer clic en el botón de guardar
    fireEvent.click(screen.getByText('Guardar'));

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Error: Error al crear la asignación')).toBeInTheDocument();
    });

    // Verificar que no se llamó a la función onSuccess
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    renderWithProviders(
      <AddAssignmentForm
        championshipId={mockChampionshipId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Esperar a que se carguen los datos
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(4);
    });

    // Hacer clic en el botón de cancelar
    fireEvent.click(screen.getByText('Cancelar'));

    // Verificar que se llamó a la función onCancel
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
