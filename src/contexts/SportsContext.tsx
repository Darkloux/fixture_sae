import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMatches, saveMatch, deleteMatch, DBMatch } from '../api/matchesApi';
import { Match, MatchScore, SportType, SportsContextType, Team } from '../types/sports';

const SportsContext = createContext<SportsContextType | null>(null);

export const useSports = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error('useSports must be used within a SportsProvider');
  }
  return context;
};

// Conversión DBMatch <-> Match
function dbMatchToMatch(db: DBMatch, teams: Team[]): Match {
  // El backend ahora devuelve objetos equipoLocal y equipoVisitante anidados
  const equipoLocal = teams.find(t => t.id === db.equipoLocal?.id) || { 
    id: db.equipoLocal?.id || '', 
    nombre: db.equipoLocal?.nombre || '', 
    logo: db.equipoLocal?.logo || '', 
    createdAt: '', 
    updatedAt: '' 
  };
  const equipoVisitante = teams.find(t => t.id === db.equipoVisitante?.id) || { 
    id: db.equipoVisitante?.id || '', 
    nombre: db.equipoVisitante?.nombre || '', 
    logo: db.equipoVisitante?.logo || '', 
    createdAt: '', 
    updatedAt: '' 
  };
  return {
    id: db.id_partido,
    deporte: db.deporte as SportType,
    equipoLocal,
    equipoVisitante,
    resultado: { local: db.goles_equipo_1, visitante: db.goles_equipo_2 },
    estado: db.estado as any,
    fecha: db.fecha + (db.hora ? 'T' + db.hora : ''),
    canchaNombre: db.name_partido,
    canchaUbicacion: db.name_cancha,
  };
}

function matchToDBMatch(match: Match): DBMatch {
  return {
    id_partido: match.id,
    deporte: match.deporte,
    equipoLocal: {
      id: match.equipoLocal.id,
      nombre: match.equipoLocal.nombre,
      logo: match.equipoLocal.logo || ''
    },
    equipoVisitante: {
      id: match.equipoVisitante.id,
      nombre: match.equipoVisitante.nombre,
      logo: match.equipoVisitante.logo || ''
    },
    goles_equipo_1: match.resultado.local,
    goles_equipo_2: match.resultado.visitante,
    estado: match.estado,
    name_partido: match.canchaNombre || '',
    name_cancha: match.canchaUbicacion || '',
    fecha: match.fecha.split('T')[0],
    hora: match.fecha.includes('T') ? match.fecha.split('T')[1] : '',
    id_equipo_local: match.equipoLocal.id,
    id_equipo_visitante: match.equipoVisitante.id,
    icon_equipo_local: match.equipoLocal.logo || '',
    icon_equipo_visitante: match.equipoVisitante.logo || '',
    type_sport: (match as any).type_sport || match.deporte,
  };
}

export const SportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    getMatches().then((dbMatches) => {
      const storedTeams = localStorage.getItem('teams');
      const teamsArr: Team[] = storedTeams ? JSON.parse(storedTeams) : [];
      setTeams(teamsArr);
      setMatches(dbMatches.map((db: DBMatch) => dbMatchToMatch(db, teamsArr)));
    });
  }, []);

  const addMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      const newMatch: Match = {
        ...matchData,
        id: `match-${Date.now()}`,
      };
      console.log('🔄 Guardando partido:', newMatch);
      console.log('🔄 Datos para DB:', matchToDBMatch(newMatch));
      
      await saveMatch(matchToDBMatch(newMatch));
      console.log('✅ Partido guardado en DB');
      
      setMatches(prev => [...prev, newMatch]);
      console.log('✅ Partido agregado al estado');
    } catch (error) {
      console.error('❌ Error al guardar partido:', error);
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
    await saveMatch(matchToDBMatch(match));
    setMatches(prev => prev.map(m => m.id === id ? match : m));
  };

  const deleteMatchFn = async (id: string) => {
    await deleteMatch(id);
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const saveTeamsToLocalStorage = (updatedTeams: Team[]) => {
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    setTeams(updatedTeams);
  };

  const addTeam = (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    saveTeamsToLocalStorage([...teams, newTeam]);
  };

  const updateTeam = (id: string, teamData: Partial<Team>) => {
    const updatedTeams = teams.map((team) =>
      team.id === id
        ? { ...team, ...teamData, updatedAt: new Date().toISOString() }
        : team
    );
    saveTeamsToLocalStorage(updatedTeams);
  };

  const deleteTeam = (id: string) => {
    const filteredTeams = teams.filter((team) => team.id !== id);
    saveTeamsToLocalStorage(filteredTeams);
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