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

const API_URL = 'http://localhost:3001';

export async function getMatches(): Promise<DBMatch[]> {
  const res = await fetch(`${API_URL}/matches`);
  return await res.json();
}

export async function saveMatch(match: DBMatch): Promise<void> {
  console.log('🔄 Enviando partido a API:', match);
  
  const response = await fetch(`${API_URL}/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(match),
  });
  
  console.log('📡 Respuesta de API:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error en respuesta de API:', errorText);
    throw new Error(`Failed to save match: ${response.status} ${errorText}`);
  }
  
  const result = await response.json();
  console.log('✅ Resultado de API:', result);
}

export async function deleteMatch(id_partido: string): Promise<void> {
  await fetch(`${API_URL}/matches/${id_partido}`, { method: 'DELETE' });
}
