import React, { useState } from 'react';
import './Table.scss';
 import TableRow from './TableRow';

const Table = ({ columns, data, onEdit }) => {
  const [sortConfig, setSortConfig] = useState(null);

  // Función para ordenar los datos
  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (key) => {
    if (!sortConfig) return null;
    return sortConfig.key === key ? sortConfig.direction : null;
  };

  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.name} onClick={() => requestSort(column.name)}>
              {column.label}
              {getSortDirection(column.name) === 'ascending' && ' ▲'}
              {getSortDirection(column.name) === 'descending' && ' ▼'}
            </th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        <TableRow data={sortedData} columns={columns} onEdit={onEdit} />
      </tbody>
    </table>
  );
};

export default Table;