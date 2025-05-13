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
    const local = statsByTeam[match.equipoLocal.id];
    const visitante = statsByTeam[match.equipoVisitante.id];
    if (!local || !visitante) return;
    // Fútbol
    if (sport.startsWith('futbol')) {
      local.GF += match.resultado.local;
      local.GC += match.resultado.visitante;
      visitante.GF += match.resultado.visitante;
      visitante.GC += match.resultado.local;
      if (match.resultado.local > match.resultado.visitante) {
        local.PG += 1; visitante.PP += 1;
      } else if (match.resultado.local < match.resultado.visitante) {
        visitante.PG += 1; local.PP += 1;
      } else {
        local.PE += 1; visitante.PE += 1;
      }
    } else if (sport.startsWith('basquet')) {
      local.PF += match.resultado.local;
      local.PC += match.resultado.visitante;
      visitante.PF += match.resultado.visitante;
      visitante.PC += match.resultado.local;
      if (match.resultado.local > match.resultado.visitante) {
        local.PG += 1; visitante.PP += 1;
      } else {
        visitante.PG += 1; local.PP += 1;
      }
    } else if (sport.startsWith('voley')) {
      local.SG += match.resultado.local;
      local.SC += match.resultado.visitante;
      visitante.SG += match.resultado.visitante;
      visitante.SC += match.resultado.local;
      if (match.resultado.local > match.resultado.visitante) {
        local.PG += 1; visitante.PP += 1;
        if (match.resultado.local === 3 && match.resultado.visitante <= 1) {
          local.PTS += 3; visitante.PTS += 0;
        } else if (match.resultado.local === 3 && match.resultado.visitante === 2) {
          local.PTS += 2; visitante.PTS += 1;
        }
      } else {
        visitante.PG += 1; local.PP += 1;
        if (match.resultado.visitante === 3 && match.resultado.local <= 1) {
          visitante.PTS += 3; local.PTS += 0;
        } else if (match.resultado.visitante === 3 && match.resultado.local === 2) {
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
