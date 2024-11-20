// src/components/Table/TableRow.js
import React from 'react';

function TableRow({ data, columns, onView, onEdit, onDelete }) {
  return (
    <tr>
      {columns.map((column) => (
        <td key={column.name}>{data[column.name]}</td>
      ))}
      <td className="actions">
        <button onClick={() => onView(data)}>Ver</button>
        <button onClick={() => onEdit(data)}>Editar</button>
        <button onClick={() => onDelete(data.id)}>Eliminar</button>
      </td>
    </tr>
  );
}

export default TableRow;