'use client';

// ============================================================
// ResultadoPanel — Panel final con desglose completo del diagnóstico
// ============================================================

import type { ResultadoDiagnostico, NivelRiesgo } from '../../../lib/diagnostico/types';
import GaugeChart from './GaugeChart';

interface ResultadoPanelProps {
  resultado: ResultadoDiagnostico;
  onReiniciar: () => void;
}

const NIVEL_CONFIG: Record<NivelRiesgo, { label: string; description: string; color: string; bg: string; border: string; icon: string }> = {
  critico: {
    label: 'Incumplimiento Crítico',
    description: 'Su organización enfrenta riesgos legales significativos. Se requieren acciones inmediatas.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: '🚨',
  },
  en_proceso: {
    label: 'En Proceso de Cumplimiento',
    description: 'Su organización ha iniciado el camino. Existen brechas importantes que cerrar.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: '⚠️',
  },
  conforme: {
    label: 'Conforme con la Ley 1581',
    description: '¡Felicitaciones! Su organización demuestra un alto nivel de cumplimiento.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: '✅',
  },
};

const BLOQUE_ACCENT: Record<string, string> = {
  politica: '#10b981',
  privacidad_disenio: '#14b8a6',
  gobernanza: '#06b6d4',
};

export default function ResultadoPanel({ resultado, onReiniciar }: ResultadoPanelProps) {
  const config = NIVEL_CONFIG[resultado.nivelRiesgo];
  const fecha = resultado.fechaCompletado.toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="animate-fade-slide-up w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hero de resultado */}
      <div className={`rounded-2xl ${config.bg} border ${config.border} p-6 sm:p-8`}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Gauge */}
          <div className="flex-shrink-0">
            <GaugeChart score={resultado.scoreTotal} nivelRiesgo={resultado.nivelRiesgo} />
          </div>

          {/* Texto */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
              <span className="text-2xl">{config.icon}</span>
              <span className={`text-xs font-mono uppercase tracking-widest ${config.color}`}>
                Resultado Final
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black mb-3 ${config.color}`}>
              {config.label}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              {config.description}
            </p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="text-center px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className={`text-2xl font-black ${config.color}`}>{resultado.scoreTotal}%</p>
                <p className="text-xs text-slate-500 mt-0.5">Score Global</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-2xl font-black text-slate-300">
                  {Object.values(resultado.respuestas).filter(r => r.valor === 'si' && !r.bloqueada).length}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Sí respondidas</p>
              </div>
              <div className="text-center px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-2xl font-black text-red-400">
                  {Object.values(resultado.respuestas).filter(r => r.valor === 'no' && !r.bloqueada).length}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Brechas</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-4">
              Diagnóstico completado el {fecha}
            </p>
          </div>
        </div>
      </div>

      {/* Desglose por Bloque */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
          Desglose por Bloque
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {resultado.resultadosPorBloque.map(({ bloque, scoreObtenido, scoreMaximo, porcentaje, preguntasRespondidas, preguntasBloqueadas }) => {
            const accentColor = BLOQUE_ACCENT[bloque.id] ?? '#10b981';
            return (
              <div
                key={bloque.id}
                className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-5 hover:border-slate-600/70 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{bloque.icono}</span>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{bloque.titulo}</p>
                    <p className="text-[10px] text-slate-500">Máx {bloque.pesoMaximo}% global</p>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-end gap-2 mb-3">
                  <span
                    className="text-3xl font-black"
                    style={{ color: accentColor }}
                  >
                    {scoreObtenido}
                  </span>
                  <span className="text-slate-500 text-sm mb-0.5">/ {scoreMaximo} pts</span>
                </div>

                {/* Barra del bloque */}
                <div className="h-2 w-full rounded-full bg-slate-700/60 mb-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${porcentaje}%`,
                      backgroundColor: accentColor,
                      boxShadow: `0 0 6px ${accentColor}80`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-500">
                  {porcentaje}% del bloque ·{' '}
                  {preguntasRespondidas} pregunta{preguntasRespondidas !== 1 ? 's' : ''} activa{preguntasRespondidas !== 1 ? 's' : ''}
                  {preguntasBloqueadas > 0 && (
                    <span className="text-amber-500/70"> · {preguntasBloqueadas} bloqueada{preguntasBloqueadas !== 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="text-base">📋</span>
          Plan de Acción Recomendado
        </h3>
        <ul className="space-y-3">
          {resultado.recomendaciones.map((rec, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 mt-0.5 font-mono">
                {i + 1}
              </span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-slate-800/20 border border-slate-700/30 p-4 text-center">
        <p className="text-xs text-slate-600 leading-relaxed">
          ⚠️ Este diagnóstico es una herramienta de autodiagnóstico con fines orientativos basada en la Ley 1581 de 2012.
          No constituye asesoría legal vinculante. Para situaciones específicas, consulte a un abogado especializado en
          protección de datos personales en Colombia.
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          id="btn-reiniciar"
          onClick={onReiniciar}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
        >
          🔄 Nuevo Diagnóstico
        </button>
        <button
          id="btn-descargar"
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-emerald-900/40"
        >
          📄 Exportar Resultado
        </button>
      </div>
    </div>
  );
}
