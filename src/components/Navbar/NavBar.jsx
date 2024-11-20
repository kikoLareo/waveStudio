// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import ThemeToggle from '../ThemeToogle/ThemeToggle';

function Navbar() {
  // Estado para controlar el menú desplegable
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para alternar el menú al hacer clic
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Funciones para abrir y cerrar el menú al hacer hover
  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <h1>WaveStudio</h1>
      {/* Icono de menú con eventos onClick y onMouseEnter */}
     
      <ThemeToggle />
      <button
        className="menu-toggle"
        onClick={toggleMenu}
        onMouseEnter={openMenu} // Abre el menú al hacer hover
      >
        ☰ {/* Este símbolo representa un icono de menú */}
      </button>

      {/* Menú desplegable con evento onMouseLeave para cerrarlo al salir */}
      <ul
        className={`menu ${isMenuOpen ? 'open' : ''}`}
        onMouseLeave={closeMenu} // Cierra el menú al salir con el ratón
      >
        <li>
          <Link to="/" onClick={toggleMenu}>Dashboard</Link>
        </li>
        <li>
          <Link to="/roles" onClick={toggleMenu}>Roles</Link>
        </li>
        <li>
          <Link to="/users" onClick={toggleMenu}>Usuarios</Link>
        </li>
        <li>
          <Link to="/championships" onClick={toggleMenu}>Campeonatos</Link>
        </li>
        <li>
          <Link to="/assignments" onClick={toggleMenu}>Asignaciones</Link>
        </li>
        <li>
          <Link to="/job-positions" onClick={toggleMenu}>Puestos de Trabajo</Link>
        </li>

        <li>
          <Link to="/organizers" onClick={toggleMenu}>Organizadores</Link>
        </li>
        <li>
          <Link to="/disciplines" onClick={toggleMenu}>Disciplinas</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;