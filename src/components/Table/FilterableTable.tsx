import React, { useState, useEffect } from 'react';
import { Filter, Calendar, X } from 'lucide-react';
import Table from './Table';
import type { SchemaField } from '../../schemas/schemas';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  field: string;
  options?: FilterOption[];
  type: 'select' | 'date-range' | 'text';
  label: string;
}

interface FilterableTableProps {
  columns: SchemaField[];
  data: any[];
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
  onRowClick?: (item: any) => void;
  isLoading?: boolean;
  showActions?: boolean;
  filters: FilterConfig[];
}

const FilterableTable: React.FC<FilterableTableProps> = ({
  columns,
  data,
  onEdit,
  onView,
  onDelete,
  onRowClick,
  isLoading = false,
  showActions = true,
  filters
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // Reset filtered data when original data changes
  useEffect(() => {
    applyFilters();
  }, [data]);

  const applyFilters = () => {
    let result = [...data];

    // Apply each active filter
    Object.entries(activeFilters).forEach(([field, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      const filterConfig = filters.find(f => f.field === field);
      if (!filterConfig) return;

      switch (filterConfig.type) {
        case 'select':
          result = result.filter(item => item[field] === value);
          break;
        case 'text':
          result = result.filter(item => 
            item[field] && item[field].toLowerCase().includes(value.toLowerCase())
          );
          break;
        case 'date-range':
          if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
            const startDate = new Date(value[0]);
            const endDate = new Date(value[1]);
            
            result = result.filter(item => {
              const itemDate = new Date(item[field]);
              return itemDate >= startDate && itemDate <= endDate;
            });
          }
          break;
      }
    });

    setFilteredData(result);
  };

  const handleFilterChange = (field: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setFilteredData(data);
  };

  const renderFilterControls = () => {
    return (
      <div className="bg-gray-50 p-4 border-b border-gray-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Filtros avanzados</h3>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar filtros
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filters.map(filter => (
            <div key={filter.field} className="space-y-1">
              <label 
                htmlFor={`filter-${filter.field}`}
                className="block text-xs font-medium text-gray-700"
              >
                {filter.label}
              </label>
              
              {filter.type === 'select' && filter.options && (
                <select
                  id={`filter-${filter.field}`}
                  value={activeFilters[filter.field] || ''}
                  onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {filter.type === 'text' && (
                <input
                  id={`filter-${filter.field}`}
                  type="text"
                  value={activeFilters[filter.field] || ''}
                  onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                  placeholder={`Buscar por ${filter.label.toLowerCase()}`}
                  className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              )}
              
              {filter.type === 'date-range' && (
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        id={`filter-${filter.field}-start`}
                        type="date"
                        value={activeFilters[filter.field]?.[0] || ''}
                        onChange={(e) => {
                          const currentValue = activeFilters[filter.field] || ['', ''];
                          handleFilterChange(filter.field, [e.target.value, currentValue[1]]);
                        }}
                        className="block w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        id={`filter-${filter.field}-end`}
                        type="date"
                        value={activeFilters[filter.field]?.[1] || ''}
                        onChange={(e) => {
                          const currentValue = activeFilters[filter.field] || ['', ''];
                          handleFilterChange(filter.field, [currentValue[0], e.target.value]);
                        }}
                        className="block w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={applyFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            inline-flex items-center px-3 py-1.5 border border-gray-300 
            text-sm font-medium rounded-md 
            ${showFilters ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
        >
          <Filter className="mr-1.5 h-4 w-4" />
          Filtros avanzados
        </button>
      </div>
      
      {showFilters && renderFilterControls()}
      
      <Table
        columns={columns}
        data={filteredData}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
        onRowClick={onRowClick}
        isLoading={isLoading}
        showActions={showActions}
      />
    </div>
  );
};

export default FilterableTable;
