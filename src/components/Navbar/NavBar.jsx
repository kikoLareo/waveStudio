// src/components/Navbar/Navbar.js
import { Link } from 'react-router-dom';
import './Navbar.scss';
function Navbar() {
  return (
    <nav className="navbar">
      <h1>WaveStudio</h1>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/roles">Roles</Link></li>
        <li><Link to="/users">Usuarios</Link></li>
        <li><Link to="/surf-sessions">Sesiones de Surf</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;