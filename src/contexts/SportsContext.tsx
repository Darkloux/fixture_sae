import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveMatch, deleteMatch, DBMatch } from '../api/matchesApi';
import { getTeams, addTeam as addTeamApi, updateTeam as updateTeamApi, deleteTeam as deleteTeamApi } from '../api/teamsApi';
import { Match, SportType, SportsContextType, Team } from '../types/sports';

const SportsContext = createContext<SportsContextType | null>(null);

export const useSports = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error('useSports must be used within a SportsProvider');
  }
  return context;
};

function matchToDBMatch(match: Match, teams: Team[]): DBMatch {
  const { id, deporte, equipoLocalId, equipoVisitanteId, golesLocal, golesVisitante, estado, name_partido, name_cancha, fecha } = match;
  const equipoLocal = teams.find((t: Team) => t.id === equipoLocalId);
  const equipoVisitante = teams.find((t: Team) => t.id === equipoVisitanteId);
  const [fechaStr, hora] = fecha.includes('T') ? fecha.split('T') : [fecha, ''];
  return {
    id_partido: id,
    deporte,
    type_sport: deporte,
    equipoLocal: { id: '', nombre: '', logo: '' }, // legacy, no usar
    equipoVisitante: { id: '', nombre: '', logo: '' }, // legacy, no usar
    goles_equipo_1: golesLocal,
    goles_equipo_2: golesVisitante,
    estado,
    name_partido: name_partido || '',
    name_cancha: name_cancha || '',
    fecha: fechaStr,
    hora,
    id_equipo_local: equipoLocalId,
    id_equipo_visitante: equipoVisitanteId,
    icon_equipo_local: equipoLocal?.logo || '',
    icon_equipo_visitante: equipoVisitante?.logo || '',
  };
}

export const SportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch((err) => {
        // Mostrar error en consola y setear equipos vacío
        console.error('Error al cargar equipos:', err);
        setTeams([]);
      });
  }, []);

  // Join en memoria al cargar partidos desde Supabase
  const fetchMatches = async () => {
    try {
      const { getMatches } = await import('../api/matchesApi');
      const dbMatches = await getMatches();
      const joinedMatches: Match[] = dbMatches.map((dbMatch) => {
        const equipoLocal = teams.find(t => t.id === dbMatch.id_equipo_local);
        const equipoVisitante = teams.find(t => t.id === dbMatch.id_equipo_visitante);
        return {
          id: dbMatch.id_partido,
          deporte: dbMatch.deporte as SportType,
          equipoLocalId: dbMatch.id_equipo_local,
          equipoVisitanteId: dbMatch.id_equipo_visitante,
          golesLocal: dbMatch.goles_equipo_1,
          golesVisitante: dbMatch.goles_equipo_2,
          estado: dbMatch.estado as Match['estado'],
          fecha: dbMatch.fecha + (dbMatch.hora ? 'T' + dbMatch.hora : ''),
          name_partido: dbMatch.name_partido,
          name_cancha: dbMatch.name_cancha,
          equipoLocal: equipoLocal,
          equipoVisitante: equipoVisitante,
        };
      });
      setMatches(joinedMatches);
    } catch (err) {
      // Mostrar error en consola y setear partidos vacío
      console.error('Error al cargar partidos:', err);
      setMatches([]);
    }
  };

  useEffect(() => {
    if (teams.length > 0) fetchMatches();
  }, [teams]);

  const addMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      const newMatch: Match = {
        ...matchData,
        id: `match-${Date.now()}`,
      };
      await saveMatch(matchToDBMatch(newMatch, teams));
      setMatches(prev => [...prev, {
        ...newMatch,
        equipoLocal: teams.find(t => t.id === newMatch.equipoLocalId),
        equipoVisitante: teams.find(t => t.id === newMatch.equipoVisitanteId),
      }]);
    } catch (error) {
      throw error;
    }
  };

  const updateMatch = async (id: string, matchData: Partial<Match>) => {
    const prevMatch = matches.find(m => m.id === id);
    if (!prevMatch) return;
    const match: Match = {
      ...prevMatch,
      ...matchData,
      id,
    };
    await saveMatch(matchToDBMatch(match, teams));
    setMatches(prev => prev.map(m => m.id === id ? {
      ...match,
      equipoLocal: teams.find(t => t.id === match.equipoLocalId),
      equipoVisitante: teams.find(t => t.id === match.equipoVisitanteId),
    } : m));
  };

  const deleteMatchFn = async (id: string) => {
    await deleteMatch(id);
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const addTeam = async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addTeamApi(teamData);
    setTeams(await getTeams());
  };

  const updateTeam = async (id: string, teamData: Partial<Team>) => {
    await updateTeamApi(id, teamData);
    setTeams(await getTeams());
  };

  const deleteTeam = async (id: string) => {
    await deleteTeamApi(id);
    setTeams(await getTeams());
  };

  const getTeamById = (id: string) => {
    return teams.find((team) => team.id === id);
  };

  const getMatchesByDate = (date: string) => {
    return matches.filter((match) => match.fecha.startsWith(date));
  };

  const getMatchesBySport = (sport: SportType) => {
    return matches.filter((match) => match.deporte === sport);
  };

  return (
    <SportsContext.Provider value={{
      matches,
      addMatch,
      updateMatch,
      deleteMatch: deleteMatchFn,
      getMatchesByDate,
      getMatchesBySport,
      teams,
      addTeam,
      updateTeam,
      deleteTeam,
      getTeamById
    }}>
      {children}
    </SportsContext.Provider>
  );
};