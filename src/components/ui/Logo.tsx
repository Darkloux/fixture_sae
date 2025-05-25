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
        src="/images/favicon-32x32.png" 
        alt="Deportivo SAE Logo" 
        className="h-full w-auto rounded-lg"
      />
      <span className="ml-2 font-semibold text-base text-dark">Olimpiadas Deportivas 2025</span>
    </div>
  );
};

export default Logo;