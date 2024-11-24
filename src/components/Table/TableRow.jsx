// src/components/Table/TableRow.jsx
import React from 'react';
import { FaEdit, FaEye } from 'react-icons/fa'; // Iconos para editar y ver
import './Table.scss';

function TableRow({ data, columns, onView, onEdit }) {
  return (
    <>
      {data.map((row, index) => (
        <tr key={index}>
          {columns.map((column) => (
            <td key={column.name}>{row[column.name]}</td>
          ))}
          <td className="action-icons">
          <button onClick={() => onEdit(row)} className="icon-button">
            <FaEdit title="Editar" />
          </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableRow;

