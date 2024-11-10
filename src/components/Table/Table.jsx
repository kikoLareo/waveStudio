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
        {data.map((item) => (
          <TableRow
            key={item.id}
            data={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

export default Table;