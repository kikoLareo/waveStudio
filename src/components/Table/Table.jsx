// src/components/Table/Table.js
import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import './Table.scss';

function Table({ columns, data, onEdit, onDelete }) {
  return (
    <table className="custom-table">
      <TableHeader columns={columns} />
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="no-data">
              No hay elementos
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <TableRow
              key={item.id}
              data={item}
              columns={columns} // Pasa las columnas a TableRow para formatear correctamente
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default Table;