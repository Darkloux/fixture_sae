import React, { useEffect, useState } from 'react';
import { useSports } from '../contexts/SportsContext';
import { useStandings } from '../contexts/StandingsContext';
import { SportType, Match, Team } from '../types/sports';
import { Calendar } from 'lucide-react';
import DynamicStandingsTable from '../components/standings/DynamicStandingsTable';

const StatsPage: React.FC = () => {
  const { matches, teams } = useSports();
  const { customStandings } = useStandings();
  const [selectedSport, setSelectedSport] = useState<SportType>('futbol_11_masculino');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    document.title = 'Deportivo SAE - Estadísticas';
  }, []);

  const deportes: { id: SportType; nombre: string }[] = [
    { id: 'futbol_11_masculino', nombre: 'Fútbol 11 masculino' },
    { id: 'futbol_7_femenino', nombre: 'Fútbol 7 femenino' },
    { id: 'futbol_5_masculino', nombre: 'Fútbol 5 masculino' },
    { id: 'basquet_5x5_masculino', nombre: 'Basquet 5x5 masculino' },
    { id: 'basquet_5x5_femenino', nombre: 'Basquet 5x5 femenino' },
    { id: 'voley_masculino', nombre: 'Voley masculino' },
    { id: 'voley_femenino', nombre: 'Voley femenino' },
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
            {/* Dropdown universal para deportes */}
            <div className="w-full">
              <select
                value={selectedSport}
                onChange={e => setSelectedSport(e.target.value as SportType)}
                className="w-full px-4 py-2 bg-white border rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {deportes.map(deporte => (
                  <option key={deporte.id} value={deporte.id}>
                    {deporte.nombre}
                  </option>
                ))}
              </select>
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
            {filteredMatches.map(match => {
              // Obtener equipos por ID
              const equipoLocal = typeof match.equipoLocalId === 'string' && Array.isArray(teams)
                ? teams.find(t => t.id === match.equipoLocalId)
                : undefined;
              const equipoVisitante = typeof match.equipoVisitanteId === 'string' && Array.isArray(teams)
                ? teams.find(t => t.id === match.equipoVisitanteId)
                : undefined;
              return (
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

                  {/* Mostrar nombre y ubicación de la cancha si existen */}
                  {(match.name_cancha) && (
                    <div className="mb-2 text-sm text-gray-700 flex flex-col md:flex-row md:items-center md:gap-2">
                      {match.name_cancha && (
                        <span><b>Cancha:</b> {match.name_cancha}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {equipoLocal?.logo && (
                        <img
                          src={equipoLocal.logo}
                          alt={equipoLocal.nombre}
                          className="w-12 h-12 object-contain"
                        />
                      )}
                      <span className="font-medium">{equipoLocal?.nombre || 'Equipo local'}</span>
                    </div>

                    <div className="px-6 py-2 bg-white rounded-lg shadow-sm font-bold text-xl">
                      {match.golesLocal} - {match.golesVisitante}
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end">
                      <span className="font-medium">{equipoVisitante?.nombre || 'Equipo visitante'}</span>
                      {equipoVisitante?.logo && (
                        <img
                          src={equipoVisitante.logo}
                          alt={equipoVisitante.nombre}
                          className="w-12 h-12 object-contain"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

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

        {/* Tabla de posiciones dinámica */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Tabla de posiciones</h2>
          <DynamicStandingsTable
            matches={filteredMatches}
            teams={Array.from(new Set(filteredMatches.flatMap(m => [m.equipoLocalId, m.equipoVisitanteId])))
              .map(id => (typeof teams !== 'undefined' ? teams.find(t => t.id === id) : undefined))
              .filter(Boolean) as Team[]}
            sport={selectedSport}
            customData={customStandings[selectedSport]}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsPage;