import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs Component', () => {
  it('renders correctly with default props', () => {
    const items = [
      { label: 'Campeonatos', path: '/championships' },
      { label: 'Detalle de Campeonato', path: '/championships/1' }
    ];

    renderWithProviders(<Breadcrumbs items={items} />);
    
    // Verificar que se muestra el elemento Home
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    
    // Verificar que se muestran los elementos de la ruta
    expect(screen.getByText('Campeonatos')).toBeInTheDocument();
    expect(screen.getByText('Detalle de Campeonato')).toBeInTheDocument();
    
    // Verificar que el último elemento no es un enlace
    const lastItem = screen.getByText('Detalle de Campeonato');
    expect(lastItem.tagName).not.toBe('A');
  });

  it('renders without home item when showHome is false', () => {
    const items = [
      { label: 'Campeonatos', path: '/championships' },
      { label: 'Detalle de Campeonato', path: '/championships/1' }
    ];

    renderWithProviders(<Breadcrumbs items={items} showHome={false} />);
    
    // Verificar que no se muestra el elemento Home
    expect(screen.queryByText('Inicio')).not.toBeInTheDocument();
    
    // Verificar que se muestran los elementos de la ruta
    expect(screen.getByText('Campeonatos')).toBeInTheDocument();
    expect(screen.getByText('Detalle de Campeonato')).toBeInTheDocument();
  });

  it('marks the last item as active', () => {
    const items = [
      { label: 'Campeonatos', path: '/championships' },
      { label: 'Detalle de Campeonato', path: '/championships/1' }
    ];

    renderWithProviders(<Breadcrumbs items={items} />);
    
    // Verificar que el primer elemento es un enlace
    const firstItem = screen.getByText('Campeonatos');
    expect(firstItem.closest('a')).toBeInTheDocument();
    
    // Verificar que el último elemento no es un enlace (está marcado como activo)
    const lastItem = screen.getByText('Detalle de Campeonato');
    expect(lastItem.closest('a')).not.toBeInTheDocument();
    expect(lastItem.getAttribute('aria-current')).toBe('page');
  });

  it('renders with correct separator icons', () => {
    const items = [
      { label: 'Campeonatos', path: '/championships' },
      { label: 'Detalle de Campeonato', path: '/championships/1' }
    ];

    const { container } = renderWithProviders(<Breadcrumbs items={items} />);
    
    // Verificar que hay 2 separadores (entre Home-Campeonatos y Campeonatos-Detalle)
    // Nota: No podemos usar screen.getAllByRole porque los iconos no tienen roles específicos
    // Usamos una aproximación basada en la estructura del componente
    const separators = container.querySelectorAll('svg.text-gray-400');
    expect(separators.length).toBe(2);
  });
});
