// src/components/ThemeToggle/ThemeToggle.jsx
import React from 'react';

function ThemeToggle() {
  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}

export default ThemeToggle;