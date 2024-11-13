// src/components/Table/TableRow.js
import React from 'react';

function TableRow({ data, columns, onEdit, onDelete }) {
  return (
    <tr>
      {columns.map((column) => (
        <td key={column.name}>{data[column.name]}</td>
      ))}
      <td>
        <button onClick={() => onEdit(data)}>Editar</button>
        <button onClick={() => onDelete(data.id)}>Eliminar</button>
      </td>
    </tr>
  );
}

export default TableRow;