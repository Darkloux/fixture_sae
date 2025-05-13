import React from 'react';
import { Match, Team, SportType } from '../../types/sports';

interface DynamicStandingsTableProps {
  matches: Match[];
  teams: Team[];
  sport: SportType;
}

// Configuración de columnas y reglas por disciplina
const sportConfigs: Record<SportType, {
  columns: string[];
  rules: {
    PTS: (stats: any) => number;
    PJ: (stats: any) => number;
    DIF: (stats: any) => number;
    // Otros cálculos según deporte
  };
}> = {
  futbol_11_masculino: {
    columns: ['Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DIF', 'PTS'],
    rules: {
      PTS: (s) => s.PG * 3 + s.PE * 1,
      PJ: (s) => s.PG + s.PE + s.PP,
      DIF: (s) => s.GF - s.GC,
    },
  },
  futbol_7_femenino: {
    columns: ['Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DIF', 'PTS'],
    rules: {
      PTS: (s) => s.PG * 3 + s.PE * 1,
      PJ: (s) => s.PG + s.PE + s.PP,
      DIF: (s) => s.GF - s.GC,
    },
  },
  futbol_5_masculino: {
    columns: ['Equipo', 'PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DIF', 'PTS'],
    rules: {
      PTS: (s) => s.PG * 3 + s.PE * 1,
      PJ: (s) => s.PG + s.PE + s.PP,
      DIF: (s) => s.GF - s.GC,
    },
  },
  basquet_5x5_masculino: {
    columns: ['Equipo', 'PJ', 'PG', 'PP', 'PF', 'PC', 'DIF', 'PTS'],
    rules: {
      PTS: (s) => s.PG * 2 + s.PP * 1,
      PJ: (s) => s.PG + s.PP,
      DIF: (s) => s.PF - s.PC,
    },
  },
  basquet_5x5_femenino: {
    columns: ['Equipo', 'PJ', 'PG', 'PP', 'PF', 'PC', 'DIF', 'PTS'],
    rules: {
      PTS: (s) => s.PG * 2 + s.PP * 1,
      PJ: (s) => s.PG + s.PP,
      DIF: (s) => s.PF - s.PC,
    },
  },
  voley_masculino: {
    columns: ['Equipo', 'PJ', 'PG', 'PP', 'SG', 'SC', 'DIF', 'PTS'],
    rules: {
      PTS: (s) => s.PTS, // Se calcula partido a partido
      PJ: (s) => s.PG + s.PP,
      DIF: (s) => s.SG - s.SC,
    },
  },
  voley_femenino: {
    columns: ['Equipo', 'PJ', 'PG', 'PP', 'SG', 'SC', 'DIF', 'PTS'],
    rules: {
      PTS: (s) => s.PTS, // Se calcula partido a partido
      PJ: (s) => s.PG + s.PP,
      DIF: (s) => s.SG - s.SC,
    },
  },
};

// Utilidad para inicializar estadísticas por equipo
const getInitialStats = (columns: string[]) => {
  const base: any = {};
  columns.forEach(col => {
    if (col !== 'Equipo') base[col] = 0;
  });
  return base;
};

const DynamicStandingsTable: React.FC<DynamicStandingsTableProps> = ({ matches, teams, sport }) => {
  const config = sportConfigs[sport];
  if (!config) return <div>No hay configuración para este deporte.</div>;

  // Inicializar estadísticas por equipo
  const statsByTeam: Record<string, any> = {};
  teams.forEach(team => {
    statsByTeam[team.id] = { ...getInitialStats(config.columns), Equipo: team.nombre, id: team.id };
  });

  // Procesar partidos para calcular estadísticas
  matches.forEach(match => {
    const local = statsByTeam[match.equipoLocal.id];
    const visitante = statsByTeam[match.equipoVisitante.id];
    if (!local || !visitante) return;

    // Fútbol
    if (sport.startsWith('futbol')) {
      // Goles
      local.GF += match.resultado.local;
      local.GC += match.resultado.visitante;
      visitante.GF += match.resultado.visitante;
      visitante.GC += match.resultado.local;
      // Partidos jugados
      if (match.resultado.local > match.resultado.visitante) {
        local.PG += 1;
        visitante.PP += 1;
      } else if (match.resultado.local < match.resultado.visitante) {
        visitante.PG += 1;
        local.PP += 1;
      } else {
        local.PE += 1;
        visitante.PE += 1;
      }
    }
    // Básquet
    else if (sport.startsWith('basquet')) {
      local.PF += match.resultado.local;
      local.PC += match.resultado.visitante;
      visitante.PF += match.resultado.visitante;
      visitante.PC += match.resultado.local;
      if (match.resultado.local > match.resultado.visitante) {
        local.PG += 1;
        visitante.PP += 1;
      } else {
        visitante.PG += 1;
        local.PP += 1;
      }
    }
    // Vóley
    else if (sport.startsWith('voley')) {
      local.SG += match.resultado.local;
      local.SC += match.resultado.visitante;
      visitante.SG += match.resultado.visitante;
      visitante.SC += match.resultado.local;
      // Puntos por partido
      // 3 pts si gana 3-0 o 3-1, 2 pts si gana 3-2, 1 pt si pierde 2-3, 0 si pierde 1-3 o 0-3
      if (match.resultado.local > match.resultado.visitante) {
        local.PG += 1;
        visitante.PP += 1;
        if (match.resultado.local === 3 && match.resultado.visitante <= 1) {
          local.PTS += 3;
          visitante.PTS += 0;
        } else if (match.resultado.local === 3 && match.resultado.visitante === 2) {
          local.PTS += 2;
          visitante.PTS += 1;
        }
      } else {
        visitante.PG += 1;
        local.PP += 1;
        if (match.resultado.visitante === 3 && match.resultado.local <= 1) {
          visitante.PTS += 3;
          local.PTS += 0;
        } else if (match.resultado.visitante === 3 && match.resultado.local === 2) {
          visitante.PTS += 2;
          local.PTS += 1;
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
    // Goles/Puntos/Sets a favor
    if (sport.startsWith('futbol') && b.GF !== a.GF) return b.GF - a.GF;
    if (sport.startsWith('basquet') && b.PF !== a.PF) return b.PF - a.PF;
    if (sport.startsWith('voley') && b.SG !== a.SG) return b.SG - a.SG;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full text-sm border-collapse">
        <thead>
          <tr>
            {config.columns.map(col => (
              <th key={col} className="px-3 py-2 bg-gray-100 border-b font-semibold text-gray-700 text-center whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((stats: any, idx: number) => (
            <tr key={stats.id} className={idx === 0 ? 'bg-primary/10 font-bold' : ''}>
              {config.columns.map(col => (
                <td key={col} className="px-3 py-2 border-b text-center whitespace-nowrap">
                  {stats[col] ?? 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicStandingsTable;
