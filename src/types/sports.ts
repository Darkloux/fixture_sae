export type SportType =
  | 'futbol_11_masculino'
  | 'futbol_7_femenino'
  | 'futbol_5_masculino'
  | 'basquet_5x5_masculino'
  | 'basquet_5x5_femenino'
  | 'voley_masculino'
  | 'voley_femenino';

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
  equipoLocalId: string; // ID del equipo local
  equipoVisitanteId: string; // ID del equipo visitante
  golesLocal: number;
  golesVisitante: number;
  estado: MatchStatus;
  fecha: string;
  name_partido?: string;
  name_cancha?: string;
  // Los siguientes campos son legacy y deben eliminarse
  // canchaNombre?: string;
  // canchaUbicacion?: string;
  // Opcional: para uso en la UI, no persistidos
  // Estos campos no deben enviarse a la base de datos, solo se usan en el frontend para el join visual
  // Si accidentalmente se envían, deben ser filtrados en la función que guarda el partido
  // equipoLocal?: Team; // SOLO FRONTEND/UI
  // equipoVisitante?: Team; // SOLO FRONTEND/UI
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