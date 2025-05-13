import React from 'react';

/**
 * Banner component for the homepage
 * Features a background image with overlay text for announcements
 */
const Banner: React.FC = () => {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Estudiantes universitarios practicando deporte" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/60"></div>
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center text-white">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-[fadeIn_1s_ease-in]">
          Secretaría Académica de Deportes
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-[fadeIn_1s_ease-in_0.3s_both]">
          Formando estudiantes a través del deporte y la actividad física
        </p>
        <a 
          href="#featured" 
          className="btn btn-primary text-white inline-block animate-[fadeIn_1s_ease-in_0.6s_both]"
        >
          Conocer más
        </a>
      </div>
    </section>
  );
};

export default Banner;