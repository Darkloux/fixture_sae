import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminPage: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Deportivo SAE - Panel de Administración';
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
          <p className="text-gray-600 mb-6">
            Bienvenido, {user?.fullName}. Desde aquí podrás gestionar el contenido del sitio.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h2 className="font-semibold mb-2">Gestión de Noticias</h2>
              <p className="text-sm text-gray-600">Administra las publicaciones del sitio</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h2 className="font-semibold mb-2">Usuarios</h2>
              <p className="text-sm text-gray-600">Gestiona los usuarios registrados</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h2 className="font-semibold mb-2">Estadísticas</h2>
              <p className="text-sm text-gray-600">Visualiza métricas del sitio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;