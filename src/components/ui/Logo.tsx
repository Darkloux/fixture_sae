import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Logo component that displays the institutional logo
 * Can be customized with additional classes
 */
const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="https://i.ibb.co/3YspXSkV/apple-touch-icon.png" 
        alt="Deportivo SAE Logo" 
        className="h-full w-auto rounded-lg"
      />
      <span className="ml-2 font-bold text-xl text-dark">Olimpiadas Deportivas</span>
    </div>
  );
};

export default Logo;