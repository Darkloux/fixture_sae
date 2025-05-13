import React from 'react';
import FeatureCard from './FeatureCard';
import { Trophy, Users, Calendar, Award } from 'lucide-react';

/**
 * Section for highlighting key features of the institution
 * Displays cards with icons and descriptions
 */
const FeaturedSection: React.FC = () => {
  const features = [
    {
      title: "Competencias Interuniversitarias",
      description: "Participa en torneos y eventos deportivos contra otras universidades a nivel nacional e internacional.",
      Icon: Trophy
    },
    {
      title: "Actividades Recreativas",
      description: "Disfruta de actividades deportivas recreativas para fomentar la salud y el bienestar estudiantil.",
      Icon: Users
    },
    {
      title: "Calendario Deportivo",
      description: "Mantente al día con todos los eventos y actividades deportivas programadas durante el año académico.",
      Icon: Calendar
    },
    {
      title: "Logros y Reconocimientos",
      description: "Conoce los logros de nuestros atletas y equipos que representan con orgullo a nuestra institución.",
      Icon: Award
    }
  ];

  return (
    <section id="featured" className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            La Secretaría Académica de Deportes ofrece múltiples oportunidades para que los estudiantes participen en actividades deportivas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              Icon={feature.Icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;