import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
}

/**
 * Card component for displaying features or services
 * Includes an icon, title, and description
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  Icon 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105">
      <div className="bg-primary/10 rounded-full w-14 h-14 flex items-center justify-center mb-4">
        <Icon size={24} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;