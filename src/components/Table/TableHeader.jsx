// src/components/Table/TableHeader.js
import React from 'react';

function TableHeader({ columns }) {
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th key={index}>{column.label}</th>
        ))}
        <th>Acciones</th>
      </tr>
    </thead>
  );
}

export default TableHeader;