import { Match, Team, SportType } from '../types/sports';
import { sportConfigs } from '../components/standings/DynamicStandingsTable';

export function calcularStandings(matches: Match[], teams: Team[], sport: SportType) {
  const config = sportConfigs[sport];
  if (!config) return [];
  // Inicializar estadísticas por equipo
  const statsByTeam: Record<string, any> = {};
  teams.forEach(team => {
    statsByTeam[team.id] = { id: team.id, Equipo: team.nombre, ...getInitialStats(config.columns) };
  });
  // Procesar partidos finalizados
  matches.filter(m => m.deporte === sport && m.estado === 'finalizado').forEach(match => {
    const local = statsByTeam[match.equipoLocalId];
    const visitante = statsByTeam[match.equipoVisitanteId];
    if (!local || !visitante) return;
    // Fútbol
    if (sport.startsWith('futbol')) {
      local.GF += match.golesLocal;
      local.GC += match.golesVisitante;
      visitante.GF += match.golesVisitante;
      visitante.GC += match.golesLocal;
      if (match.golesLocal > match.golesVisitante) {
        local.PG += 1; visitante.PP += 1;
      } else if (match.golesLocal < match.golesVisitante) {
        visitante.PG += 1; local.PP += 1;
      } else {
        local.PE += 1; visitante.PE += 1;
      }
    } else if (sport.startsWith('basquet')) {
      local.PF += match.golesLocal;
      local.PC += match.golesVisitante;
      visitante.PF += match.golesVisitante;
      visitante.PC += match.golesLocal;
      if (match.golesLocal > match.golesVisitante) {
        local.PG += 1; visitante.PP += 1;
      } else {
        visitante.PG += 1; local.PP += 1;
      }
    } else if (sport.startsWith('voley')) {
      // Si tienes campos específicos para voley, cámbialos aquí
      local.SG += match.golesLocal;
      local.SC += match.golesVisitante;
      visitante.SG += match.golesVisitante;
      visitante.SC += match.golesLocal;
      if (match.golesLocal > match.golesVisitante) {
        local.PG += 1; visitante.PP += 1;
        if (match.golesLocal === 3 && match.golesVisitante <= 1) {
          local.PTS += 3; visitante.PTS += 0;
        } else if (match.golesLocal === 3 && match.golesVisitante === 2) {
          local.PTS += 2; visitante.PTS += 1;
        }
      } else {
        visitante.PG += 1; local.PP += 1;
        if (match.golesVisitante === 3 && match.golesLocal <= 1) {
          visitante.PTS += 3; local.PTS += 0;
        } else if (match.golesVisitante === 3 && match.golesLocal === 2) {
          visitante.PTS += 2; local.PTS += 1;
        }
      }
    }
  });
  // Calcular PJ, DIF, PTS según reglas
  Object.values(statsByTeam).forEach((stats: any) => {
    stats.PJ = config.rules.PJ(stats);
    stats.DIF = config.rules.DIF(stats);
    if (!sport.startsWith('voley')) {
      stats.PTS = config.rules.PTS(stats);
    }
  });
  // Ordenar equipos
  const sorted = Object.values(statsByTeam).sort((a: any, b: any) => {
    if (b.PTS !== a.PTS) return b.PTS - a.PTS;
    if (b.DIF !== a.DIF) return b.DIF - a.DIF;
    if (sport.startsWith('futbol') && b.GF !== a.GF) return b.GF - a.GF;
    if (sport.startsWith('basquet') && b.PF !== a.PF) return b.PF - a.PF;
    if (sport.startsWith('voley') && b.SG !== a.SG) return b.SG - a.SG;
    return 0;
  });
  return sorted;
}

function getInitialStats(columns: string[]) {
  const base: any = {};
  columns.forEach(col => {
    if (col !== 'Equipo') base[col] = 0;
  });
  return base;
}
