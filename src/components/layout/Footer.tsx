import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component with institutional information
 * Displayed at the bottom of every page
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-8 relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Info */}
          <div className="flex flex-col">
            <p className="text-sm text-gray-300 mt-2">
              Portal institucional de las Olimpiadas Deportivas de Educacion Superior de Tucumán.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">Noticias</Link></li>
              <li><Link to="/estadisticas" className="text-gray-300 hover:text-primary transition-colors">Estadísticas</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <address className="not-italic text-sm text-gray-300 space-y-2">
              <p>+54 9 3816 54-7205 (IPEF)</p>
              <p>+54 9 3813 35-1260 (UTN)</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {currentYear} SAE UTN-FRT - Secretaría de Asuntos Estudiantiles. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;