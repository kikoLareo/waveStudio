import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Table from './Table';
import type { SchemaField } from '../../schemas/schemas';

interface GroupedTableProps {
  columns: SchemaField[];
  data: Record<string, any[]>;
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
  onRowClick?: (item: any) => void;
  onToggleGroup: (groupId: string) => void;
  expandedGroups: Set<string>;
  isLoading?: boolean;
}

const GroupedTable: React.FC<GroupedTableProps> = ({
  columns,
  data = {}, // Provide default empty object
  onEdit,
  onView,
  onDelete,
  onRowClick,
  onToggleGroup,
  expandedGroups,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!data || typeof data !== 'object') {
    console.error('GroupedTable data is not an object:', data);
    return (
      <div className="text-center py-4 text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  // Ensure each group contains an array of items
  const processedData: Record<string, any[]> = {};
  Object.entries(data).forEach(([key, value]) => {
    processedData[key] = Array.isArray(value) ? value : [value].filter(Boolean);
  });

  const groups = Object.entries(processedData);

  if (groups.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map(([groupName, items]) => (
        <div key={groupName} className="bg-white rounded-lg shadow overflow-hidden">
          <button
            onClick={() => onToggleGroup(groupName)}
            className="w-full px-6 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {expandedGroups.has(groupName) ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
              <span className="font-medium text-gray-900">{groupName}</span>
              <span className="text-sm text-gray-500">
                ({items.length} {items.length === 1 ? 'elemento' : 'elementos'})
              </span>
            </div>
          </button>

          {expandedGroups.has(groupName) && Array.isArray(items) && (
            <Table
              columns={columns}
              data={items}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
              onRowClick={onRowClick}
              isLoading={isLoading}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupedTable;