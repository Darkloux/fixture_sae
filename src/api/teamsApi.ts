import { supabase } from './supabaseClient';
import { Team } from '../types/sports';

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) throw new Error('Error al obtener equipos: ' + error.message);
  return data as Team[];
}

export async function addTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
  const now = new Date().toISOString();
  const newTeam = {
    ...team,
    id: `team-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  const { error } = await supabase
    .from('teams')
    .insert([newTeam]);
  if (error) throw new Error('Error al agregar equipo: ' + error.message);
}

export async function updateTeam(id: string, team: Partial<Team>): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .update({ ...team, updatedAt: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Error al actualizar equipo: ' + error.message);
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id);
  if (error) throw new Error('Error al borrar equipo: ' + error.message);
}
