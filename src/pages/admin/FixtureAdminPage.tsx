import React, { useState, useEffect } from 'react';
import { useSports } from '../../contexts/SportsContext';
import { useStandings } from '../../contexts/StandingsContext';
import { Match, Team, SportType } from '../../types/sports';
import { PlusCircle, Pencil, Trash2, X, Save, Upload } from 'lucide-react';
import { sportConfigs } from '../../components/standings/DynamicStandingsTable';
import { calcularStandings } from '../../api/standingsUtils';
import DynamicStandingsTable from '../../components/standings/DynamicStandingsTable';

const FixtureAdminPage: React.FC = () => {
  const {
    matches,
    teams,
    addMatch,
    updateMatch,
    deleteMatch,
    addTeam,
    updateTeam,
    deleteTeam
  } = useSports();

  const { setCustomStandings, customStandings } = useStandings();

  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamFormData, setTeamFormData] = useState({
    nombre: '',
    logo: ''
  });

  const [isEditingMatch, setIsEditingMatch] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [matchFormData, setMatchFormData] = useState<Omit<Match, 'id'>>({
    deporte: 'futbol_11_masculino',
    equipoLocal: {} as Team,
    equipoVisitante: {} as Team,
    resultado: { local: 0, visitante: 0 },
    estado: 'programado',
    fecha: new Date().toISOString().slice(0, 16)
  });

  const [activeTab, setActiveTab] = useState<'teams' | 'matches' | 'standings'>('teams');
  const [error, setError] = useState<string>('');

  const deportes: { id: SportType; nombre: string }[] = [
    { id: 'futbol_11_masculino', nombre: 'Fútbol 11 masculino' },
    { id: 'futbol_7_femenino', nombre: 'Fútbol 7 femenino' },
    { id: 'futbol_5_masculino', nombre: 'Fútbol 5 masculino' },
    { id: 'basquet_5x5_masculino', nombre: 'Basquet 5x5 masculino' },
    { id: 'basquet_5x5_femenino', nombre: 'Basquet 5x5 femenino' },
    { id: 'voley_masculino', nombre: 'Voley masculino' },
    { id: 'voley_femenino', nombre: 'Voley femenino' },
  ];

  const [selectedSport, setSelectedSport] = useState<SportType>('futbol_11_masculino');

  const handleTeamLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('El logo no debe superar los 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTeamFormData(prev => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const resetTeamForm = () => {
    setTeamFormData({ nombre: '', logo: '' });
    setEditingTeamId(null);
    setIsEditingTeam(false);
    setError('');
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeamId) {
      updateTeam(editingTeamId, teamFormData);
    } else {
      addTeam(teamFormData);
    }
    resetTeamForm();
  };

  const handleTeamEdit = (team: Team) => {
    setTeamFormData({
      nombre: team.nombre,
      logo: team.logo || ''
    });
    setEditingTeamId(team.id);
    setIsEditingTeam(true);
  };

  const handleTeamDelete = (id: string) => {
    const teamInUse = matches.some(
      match => match.equipoLocal.id === id || match.equipoVisitante.id === id
    );
    if (teamInUse) {
      setError('No se puede eliminar un equipo que está siendo usado en partidos');
      return;
    }
    deleteTeam(id);
  };

  const resetMatchForm = () => {
    setMatchFormData({
      deporte: 'futbol_11_masculino',
      equipoLocal: {} as Team,
      equipoVisitante: {} as Team,
      resultado: { local: 0, visitante: 0 },
      estado: 'programado',
      fecha: new Date().toISOString().slice(0, 16)
    });
    setEditingMatchId(null);
    setIsEditingMatch(false);
    setError('');
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matchFormData.equipoLocal.id || !matchFormData.equipoVisitante.id) {
      setError('Debe seleccionar ambos equipos');
      return;
    }

    if (matchFormData.equipoLocal.id === matchFormData.equipoVisitante.id) {
      setError('Los equipos deben ser diferentes');
      return;
    }

    const matchDate = new Date(matchFormData.fecha);
    const now = new Date();

    if (matchDate < now && matchFormData.estado === 'programado') {
      matchFormData.estado = 'finalizado';
    }

    if (editingMatchId) {
      updateMatch(editingMatchId, matchFormData);
    } else {
      addMatch(matchFormData);
    }
    resetMatchForm();
  };

  const handleMatchEdit = (match: Match) => {
    setMatchFormData({
      deporte: match.deporte,
      equipoLocal: match.equipoLocal,
      equipoVisitante: match.equipoVisitante,
      resultado: match.resultado,
      estado: match.estado,
      fecha: match.fecha
    });
    setEditingMatchId(match.id);
    setIsEditingMatch(true);
  };

  useEffect(() => {
    const config = sportConfigs[selectedSport];
    if (!config) return;
    const finalizados = matches.filter(m => m.deporte === selectedSport && m.estado === 'finalizado');
    const standingsAuto = calcularStandings(finalizados, teams, selectedSport);
    const prev = customStandings[selectedSport] || [];
    const stringify = (arr: any[]) => JSON.stringify(arr.map(x => ({...x})));
    if (stringify(standingsAuto) !== stringify(prev)) {
      setCustomStandings((prevAll: any) => ({ ...prevAll, [selectedSport]: standingsAuto }));
    }
  }, [matches, teams, selectedSport]);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-8">
        <button
          className={`btn ${activeTab === 'teams' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('teams')}
        >Equipos</button>
        <button
          className={`btn ${activeTab === 'matches' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('matches')}
        >Partidos</button>
        <button
          className={`btn ${activeTab === 'standings' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('standings')}
        >Tabla de posiciones</button>
      </div>

      {activeTab === 'teams' && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestión de Equipos</h2>
            <button
              onClick={() => setIsEditingTeam(!isEditingTeam)}
              className="btn btn-primary flex items-center gap-2"
            >
              {isEditingTeam ? (
                <>
                  <X size={20} />
                  Cancelar
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Nuevo Equipo
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {isEditingTeam && (
            <form onSubmit={handleTeamSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Equipo
                </label>
                <input
                  type="text"
                  value={teamFormData.nombre}
                  onChange={(e) => setTeamFormData({ ...teamFormData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo del Equipo
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleTeamLogoUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-white
                      hover:file:bg-primary-dark"
                  />
                  {teamFormData.logo && (
                    <img
                      src={teamFormData.logo}
                      alt="Logo preview"
                      className="h-20 w-20 object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetTeamForm}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  <Save size={20} />
                  {editingTeamId ? 'Actualizar' : 'Crear'} Equipo
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {team.logo ? (
                      <img src={team.logo} alt={team.nombre} className="w-16 h-16 object-contain" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{team.nombre}</h3>
                      <p className="text-sm text-gray-500">
                        Creado: {new Date(team.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleTeamEdit(team)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleTeamDelete(team.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'matches' && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestión de Partidos</h2>
            <button
              onClick={() => setIsEditingMatch(!isEditingMatch)}
              className="btn btn-primary flex items-center gap-2"
            >
              {isEditingMatch ? (
                <>
                  <X size={20} />
                  Cancelar
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  Nuevo Partido
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {isEditingMatch && (
            <form onSubmit={handleMatchSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deporte
                  </label>
                  <select
                    value={matchFormData.deporte}
                    onChange={(e) => setMatchFormData({ ...matchFormData, deporte: e.target.value as SportType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    {deportes.map(deporte => (
                      <option key={deporte.id} value={deporte.id}>
                        {deporte.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha y Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={matchFormData.fecha}
                    onChange={(e) => setMatchFormData({ ...matchFormData, fecha: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipo Local
                  </label>
                  <select
                    value={matchFormData.equipoLocal.id || ''}
                    onChange={(e) => {
                      const team = teams.find(t => t.id === e.target.value);
                      if (team) {
                        setMatchFormData({ ...matchFormData, equipoLocal: team });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccionar equipo</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipo Visitante
                  </label>
                  <select
                    value={matchFormData.equipoVisitante.id || ''}
                    onChange={(e) => {
                      const team = teams.find(t => t.id === e.target.value);
                      if (team) {
                        setMatchFormData({ ...matchFormData, equipoVisitante: team });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Seleccionar equipo</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={matchFormData.estado}
                  onChange={(e) => setMatchFormData({
                    ...matchFormData,
                    estado: e.target.value as Match['estado']
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="programado">Programado</option>
                  <option value="en_curso">En curso</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              {matchFormData.estado === 'finalizado' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resultado Local
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={matchFormData.resultado.local}
                      onChange={(e) => setMatchFormData({
                        ...matchFormData,
                        resultado: {
                          ...matchFormData.resultado,
                          local: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resultado Visitante
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={matchFormData.resultado.visitante}
                      onChange={(e) => setMatchFormData({
                        ...matchFormData,
                        resultado: {
                          ...matchFormData.resultado,
                          visitante: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetMatchForm}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary flex items-center gap-2">
                  <Save size={20} />
                  {editingMatchId ? 'Actualizar' : 'Crear'} Partido
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                      {deportes.find(d => d.id === match.deporte)?.nombre}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(match.fecha).toLocaleString()}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${
                    match.estado === 'en_curso'
                      ? 'bg-green-500'
                      : match.estado === 'finalizado'
                      ? 'bg-gray-500'
                      : 'bg-yellow-500'
                  }`}>
                    {match.estado === 'en_curso'
                      ? 'En curso'
                      : match.estado === 'finalizado'
                      ? 'Finalizado'
                      : 'Programado'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {match.equipoLocal.logo && (
                      <img
                        src={match.equipoLocal.logo}
                        alt={match.equipoLocal.nombre}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <span className="font-medium">{match.equipoLocal.nombre}</span>
                  </div>

                  <div className="px-6 py-2 bg-gray-50 rounded-lg font-bold text-xl">
                    {match.resultado.local} - {match.resultado.visitante}
                  </div>

                  <div className="flex items-center gap-4">
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

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleMatchEdit(match)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => deleteMatch(match.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'standings' && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Tabla de posiciones</h2>
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
            <select
              value={selectedSport}
              onChange={e => setSelectedSport(e.target.value as SportType)}
              className="px-4 py-2 border rounded-lg"
            >
              {deportes.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>
          <div className="mb-2 text-xs text-gray-500">
            La edición manual de la tabla de posiciones está deshabilitada. Solo los partidos finalizados afectan la tabla.
          </div>
          <DynamicStandingsTable
            matches={matches.filter(m => m.deporte === selectedSport)}
            teams={teams.filter(t => t)}
            sport={selectedSport}
          />
        </div>
      )}
    </div>
  );
};

export default FixtureAdminPage;