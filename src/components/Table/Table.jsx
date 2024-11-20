// src/components/Table/Table.js
import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import './Table.scss';

function Table({ columns, data, onView, onEdit, onDelete }) {
  return (
    <table className="custom-table">
      <TableHeader columns={columns} />
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="no-data">
              No hay elementos
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <TableRow
              key={item.id}
              data={item}
              columns={columns}
              onView={onView}
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