import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { useAdmin } from '../../contexts/AdminContext';

/**
 * Footer component with institutional information
 * Displayed at the bottom of every page
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isAdmin } = useAdmin();

  return (
    <footer className="bg-dark text-white py-8 relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Info */}
          <div className="flex flex-col">
            <Logo className="h-12 w-auto mb-4 invert" />
            <p className="text-sm text-gray-300 mt-2">
              Portal institucional de la Secretaría de Asuntos Estudiantiles
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">Noticias</Link></li>
              <li><Link to="/galeria" className="text-gray-300 hover:text-primary transition-colors">Galería</Link></li>
              <li><Link to="/estadisticas" className="text-gray-300 hover:text-primary transition-colors">Estadísticas</Link></li>
              <li><Link to="/admin/login" className="text-gray-300 hover:text-primary transition-colors">Panel de Control</Link></li>
              {isAdmin && (
                <li><Link to="/admin" className="text-gray-300 hover:text-primary transition-colors">Panel de Control</Link></li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <address className="not-italic text-sm text-gray-300 space-y-2">
              <p>Campus Universitario</p>
              <p>secretaria.deportes@universidad.edu</p>
              <p>+54 (011) 4567-8900</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {currentYear} Deportivo SAE - Secretaría de Asuntos Estudiantiles. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;