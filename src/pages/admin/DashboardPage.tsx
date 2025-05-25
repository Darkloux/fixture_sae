import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNews } from '../../contexts/NewsContext';
import { useSports } from '../../contexts/SportsContext';
import { Newspaper, Calendar } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { news } = useNews();
  const { matches } = useSports();

  const stats = [
    { icon: Newspaper, label: 'Noticias Publicadas', value: news.length.toString() },
    { icon: Calendar, label: 'Partidos Registrados', value: matches.length.toString() },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido, {user?.fullName}. Aquí tienes un resumen general del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <stat.icon size={24} className="text-primary" />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-gray-600 mt-2">{stat.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;