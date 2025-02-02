import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Bienvenido a Wave Studio
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sistema de gestión para campeonatos y eventos deportivos
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Campeonatos</h2>
            <p className="text-gray-600">Gestiona todos los campeonatos y eventos deportivos.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Usuarios</h2>
            <p className="text-gray-600">Administra usuarios, roles y permisos del sistema.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Asignaciones</h2>
            <p className="text-gray-600">Gestiona las asignaciones de personal a eventos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;