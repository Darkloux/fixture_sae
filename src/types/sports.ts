export type SportType = 'futbol' | 'baloncesto' | 'voleibol';

export interface Team {
  id: string;
  nombre: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchScore {
  local: number;
  visitante: number;
}

export type MatchStatus = 'programado' | 'en_curso' | 'finalizado';

export interface Match {
  id: string;
  deporte: SportType;
  equipoLocal: Team;
  equipoVisitante: Team;
  resultado: MatchScore;
  estado: MatchStatus;
  fecha: string;
}

export interface SportsContextType {
  matches: Match[];
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  getMatchesByDate: (date: string) => Match[];
  teams: Team[];
  addTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  getTeamById: (id: string) => Team | undefined;
  getMatchesBySport: (sport: SportType) => Match[];
}