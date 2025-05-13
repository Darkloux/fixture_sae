import React, { createContext, useContext, useState, useEffect } from 'react';
import { Match, SportType, SportsContextType, Team } from '../types/sports';

const SportsContext = createContext<SportsContextType | null>(null);

export const useSports = () => {
  const context = useContext(SportsContext);
  if (!context) {
    throw new Error('useSports must be used within a SportsProvider');
  }
  return context;
};

export const SportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const storedMatches = localStorage.getItem('matches');
    if (storedMatches) {
      setMatches(JSON.parse(storedMatches));
    }

    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  }, []);

  const saveToLocalStorage = (updatedMatches: Match[]) => {
    localStorage.setItem('matches', JSON.stringify(updatedMatches));
    setMatches(updatedMatches);
  };

  const addMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`,
    };
    saveToLocalStorage([...matches, newMatch]);
  };

  const updateMatch = (id: string, matchData: Partial<Match>) => {
    const updatedMatches = matches.map((match) =>
      match.id === id ? { ...match, ...matchData } : match
    );
    saveToLocalStorage(updatedMatches);
  };

  const deleteMatch = (id: string) => {
    const filteredMatches = matches.filter((match) => match.id !== id);
    saveToLocalStorage(filteredMatches);
  };

  const getMatchesByDate = (date: string) => {
    return matches.filter((match) => match.fecha.startsWith(date));
  };

  const getMatchesBySport = (sport: SportType) => {
    return matches.filter((match) => match.deporte === sport);
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

  return (
    <SportsContext.Provider value={{
      matches,
      addMatch,
      updateMatch,
      deleteMatch,
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