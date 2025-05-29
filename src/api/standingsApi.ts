import { supabase } from './supabaseClient';

export async function getStandings(sport: string) {
  const { data, error } = await supabase
    .from('standings')
    .select('*')
    .eq('sport', sport);
  if (error) throw new Error('Error al obtener standings: ' + error.message);
  return data;
}

export async function saveStandings(sport: string, standings: any[]) {
  // Borra standings previos de ese deporte y sube los nuevos
  const { error: delError } = await supabase
    .from('standings')
    .delete()
    .eq('sport', sport);
  if (delError) throw new Error('Error al limpiar standings: ' + delError.message);

  if (standings.length > 0) {
    const { error: insError } = await supabase
      .from('standings')
      .insert(standings.map(row => ({ ...row, sport })));
    if (insError) throw new Error('Error al guardar standings: ' + insError.message);
  }
}
