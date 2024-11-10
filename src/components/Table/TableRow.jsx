// src/components/Table/TableRow.js
import React from 'react';

function TableRow({ data, onEdit, onDelete }) {
  return (
    <tr>
      {Object.values(data).map((value, index) => (
        <td key={index}>{value}</td>
      ))}
      <td>
        <button onClick={() => onEdit(data)}>Editar</button>
        <button onClick={() => onDelete(data.id)}>Eliminar</button>
      </td>
    </tr>
  );
}

export default TableRow;