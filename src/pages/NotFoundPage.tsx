import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page component
 * Displayed when a user navigates to a non-existent route
 */
const NotFoundPage: React.FC = () => {
  // Update the document title when the component mounts
  useEffect(() => {
    document.title = 'Deportivo SAE - Página no encontrada';
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center"> {/* Padding to account for fixed navbar */}
      <div className="container-custom text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Página no encontrada</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary inline-block"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;