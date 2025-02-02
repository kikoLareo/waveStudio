import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Edit, Eye, Trash2, MoreVertical } from 'lucide-react';
import type { SchemaField } from '../../schemas/schemas';
import logService from '../../utils/logService';

interface TableProps {
  columns: SchemaField[];
  data: any[];
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
  onRowClick?: (item: any) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

const Table: React.FC<TableProps> = ({
  columns,
  data = [],
  onEdit,
  onView,
  onDelete,
  onRowClick,
  isLoading = false,
  showActions = true
}) => {
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) {
      console.error('Table data is not an array:', data);
      return [];
    }

    let sortableData = [...data];
    
    if (searchTerm) {
      sortableData = sortableData.filter(item =>
        Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig, searchTerm]);

  const handleRowClick = (e: React.MouseEvent, item: any) => {
    // Si el clic viene del menú de acciones, no propagamos el evento
    if ((e.target as HTMLElement).closest('.actions-menu')) {
      return;
    }
    
    if (onRowClick) {
      logService.log('info', 'Click en fila', { itemId: item.id });
      onRowClick(item);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 text-sm
              border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            "
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.name}
                  onClick={() => handleSort(column.name)}
                  className="
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    cursor-pointer hover:bg-gray-100 transition-colors duration-150
                  "
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortConfig?.key === column.name ? (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp className="h-4 w-4 text-blue-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-blue-500" />
                      )
                    ) : (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
              {showActions && (onEdit || onView || onDelete) && (
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  onClick={(e) => handleRowClick(e, item)}
                  className={`
                    transition-all duration-150
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.name}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {item[column.name]}
                    </td>
                  ))}
                  {showActions && (onEdit || onView || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative actions-menu">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === index ? null : index);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {activeDropdown === index && (
                          <div className="
                            absolute right-0 mt-2 w-48
                            bg-white rounded-md shadow-lg z-10
                            ring-1 ring-black ring-opacity-5
                          ">
                            <div className="py-1" role="menu">
                              {onView && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onView(item);
                                    setActiveDropdown(null);
                                  }}
                                  className="
                                    w-full text-left px-4 py-2 text-sm text-gray-700
                                    hover:bg-gray-100 flex items-center
                                  "
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalles
                                </button>
                              )}
                              {onEdit && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(item);
                                    setActiveDropdown(null);
                                  }}
                                  className="
                                    w-full text-left px-4 py-2 text-sm text-gray-700
                                    hover:bg-gray-100 flex items-center
                                  "
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item);
                                    setActiveDropdown(null);
                                  }}
                                  className="
                                    w-full text-left px-4 py-2 text-sm text-red-600
                                    hover:bg-red-50 flex items-center
                                  "
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;