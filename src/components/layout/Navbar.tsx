import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAdmin } from '../../contexts/AdminContext';

/**
 * Navigation component that stays fixed at the top
 * Includes responsive mobile menu
 */
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAdmin } = useAdmin();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Close mobile menu when clicking a link
  const closeMenu = () => setIsOpen(false);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo className="h-12 w-auto" />
          </Link>

          {/* Imagen agregada al centro de la navbar */}
          <img 
            src="/images/logos_horizontal.png" 
            alt="Logo institucional extra" 
            className="hidden md:block h-10 w-auto mx-8" 
            style={{flexShrink: 0}} 
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active text-primary' : 'text-dark hover:text-primary'}`} end>
              Noticias
            </NavLink>
            <NavLink to="/galeria" className={({isActive}) => `nav-link ${isActive ? 'active text-primary' : 'text-dark hover:text-primary'}`}>
              Galería
            </NavLink>
            <NavLink to="/estadisticas" className={({isActive}) => `nav-link ${isActive ? 'active text-primary' : 'text-dark hover:text-primary'}`}>
              Estadísticas
            </NavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-dark hover:text-primary"
            onClick={toggleMenu}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`fixed top-0 left-0 w-full h-screen z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="fixed inset-0 bg-white"></div>
        <button
          onClick={closeMenu}
          className="fixed top-6 right-6 z-50 p-2 rounded-full hover:bg-gray-100"
          aria-label="Cerrar menú"
        >
          <X size={24} className="text-gray-900" />
        </button>
        <nav className="fixed inset-x-0 top-24 bottom-0 z-10 flex flex-col w-full overflow-y-auto">
          <NavLink 
            to="/" 
            className={({isActive}) => `w-full py-5 px-8 text-lg font-medium ${
              isActive ? 'text-primary bg-primary/10 font-bold' : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={closeMenu}
            end
          >
            Noticias
          </NavLink>
          <NavLink 
            to="/galeria" 
            className={({isActive}) => `w-full py-5 px-8 text-lg font-medium ${
              isActive ? 'text-primary bg-primary/10 font-bold' : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={closeMenu}
          >
            Galería
          </NavLink>
          <NavLink 
            to="/estadisticas" 
            className={({isActive}) => `w-full py-5 px-8 text-lg font-medium ${
              isActive ? 'text-primary bg-primary/10 font-bold' : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={closeMenu}
          >
            Estadísticas
          </NavLink>
          {isAdmin && (
            <NavLink 
              to="/admin" 
              className={({isActive}) => `w-full py-5 px-8 text-lg font-medium ${
                isActive ? 'text-primary bg-primary/10 font-bold' : 'text-gray-900 hover:bg-gray-100'
              }`}
              onClick={closeMenu}
            >
              Panel de Control
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;