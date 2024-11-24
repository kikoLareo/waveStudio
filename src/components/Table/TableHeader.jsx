// src/components/Table/TableHeader.jsx
import React from 'react';
import './Table.scss';

function TableHeader({ columns }) {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.name}>{col.label}</th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;