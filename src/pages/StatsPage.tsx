import React, { useEffect, useState } from 'react';
import { useSports } from '../contexts/SportsContext';
import { SportType, Match } from '../types/sports';
import { Calendar, ChevronDown } from 'lucide-react';

const StatsPage: React.FC = () => {
  const { matches, getMatchesBySport } = useSports();
  const [selectedSport, setSelectedSport] = useState<SportType>('futbol');
  const [searchDate, setSearchDate] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    document.title = 'Deportivo SAE - Estadísticas';
  }, []);

  const deportes: { id: SportType; nombre: string }[] = [
    { id: 'futbol', nombre: 'Fútbol' },
    { id: 'baloncesto', nombre: 'Baloncesto' },
    { id: 'voleibol', nombre: 'Voleibol' }
  ];

  const filteredMatches = matches
    .filter(match => !selectedSport || match.deporte === selectedSport)
    .filter(match => !searchDate || match.fecha.includes(searchDate))
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const getStatusColor = (estado: Match['estado']) => {
    switch (estado) {
      case 'en_curso':
        return 'bg-green-500';
      case 'finalizado':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusText = (estado: Match['estado']) => {
    switch (estado) {
      case 'en_curso':
        return 'En curso';
      case 'finalizado':
        return 'Finalizado';
      default:
        return 'Programado';
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              {/* Mobile Dropdown */}
              <div className="md:hidden w-full">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-2 bg-white border rounded-lg shadow-sm flex items-center justify-between"
                >
                  <span>{deportes.find(d => d.id === selectedSport)?.nombre}</span>
                  <ChevronDown size={20} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-10">
                    {deportes.map(deporte => (
                      <button
                        key={deporte.id}
                        onClick={() => {
                          setSelectedSport(deporte.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                          selectedSport === deporte.id ? 'text-primary font-medium' : 'text-gray-700'
                        }`}
                      >
                        {deporte.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Desktop Buttons */}
              <div className="hidden md:grid grid-cols-3 gap-2">
                {deportes.map(deporte => (
                  <button
                    key={deporte.id}
                    onClick={() => setSelectedSport(deporte.id)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors text-center ${
                      selectedSport === deporte.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } w-full`}
                  >
                    {deporte.nombre}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Matches Grid */}
          <div className="grid gap-4">
            {filteredMatches.map(match => (
              <div
                key={match.id}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(match.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                      match.estado
                    )}`}
                  >
                    {getStatusText(match.estado)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {match.equipoLocal.logo && (
                      <img
                        src={match.equipoLocal.logo}
                        alt={match.equipoLocal.nombre}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <span className="font-medium">{match.equipoLocal.nombre}</span>
                  </div>

                  <div className="px-6 py-2 bg-white rounded-lg shadow-sm font-bold text-xl">
                    {match.resultado.local} - {match.resultado.visitante}
                  </div>

                  <div className="flex items-center gap-4 flex-1 justify-end">
                    <span className="font-medium">{match.equipoVisitante.nombre}</span>
                    {match.equipoVisitante.logo && (
                      <img
                        src={match.equipoVisitante.logo}
                        alt={match.equipoVisitante.nombre}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredMatches.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay partidos que mostrar para los filtros seleccionados.
              </div>
            )}
          </div>
        </div>

        {/* Sport Section Indicator */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-2">Sección actual</h2>
          <p className="text-gray-600">
            Estás viendo la sección de{' '}
            <span className="font-medium text-primary">
              {deportes.find(d => d.id === selectedSport)?.nombre || 'Todos los deportes'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;