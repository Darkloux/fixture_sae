import { supabase } from './supabaseClient';

export interface DBMatch {
  id_partido: string;
  deporte: string;
  type_sport: string;
  equipoLocal: {
    id: string;
    nombre: string;
    logo: string;
  };
  equipoVisitante: {
    id: string;
    nombre: string;
    logo: string;
  };
  goles_equipo_1: number;
  goles_equipo_2: number;
  estado: string;
  name_partido: string;
  name_cancha: string;
  fecha: string;
  hora: string;
  id_equipo_local: string;
  id_equipo_visitante: string;
  icon_equipo_local: string;
  icon_equipo_visitante: string;
}

export async function getMatches(): Promise<DBMatch[]> {
  const { data, error } = await supabase
    .from('matches')
    .select('*');
  if (error) throw new Error('Error al obtener partidos: ' + error.message);
  return data as DBMatch[];
}

export async function saveMatch(match: DBMatch): Promise<void> {
  // upsert: inserta o actualiza según id_partido
  const { error } = await supabase
    .from('matches')
    .upsert([match], { onConflict: 'id_partido' });
  if (error) throw new Error('Error al guardar partido: ' + error.message);
}

export async function deleteMatch(id_partido: string): Promise<void> {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id_partido', id_partido);
  if (error) throw new Error('Error al borrar partido: ' + error.message);
}
