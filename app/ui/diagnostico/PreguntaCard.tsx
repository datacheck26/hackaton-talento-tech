'use client';

// ============================================================
// PreguntaCard — Tarjeta interactiva de una pregunta individual
// ============================================================

import type { Pregunta } from '../../../lib/diagnostico/types';
import type { Bloque } from '../../../lib/diagnostico/types';

interface PreguntaCardProps {
  pregunta: Pregunta;
  bloque: Bloque;
  numeroPregunta: number;          // 1-based display number
  totalPreguntas: number;
  esComplementaria: boolean;
  onResponder: (valor: 'si' | 'no') => void;
  onConsultarCopilot: (pregunta: Pregunta) => void;
}

const BLOQUE_COLORS: Record<string, { badge: string; accent: string; border: string }> = {
  politica: {
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    accent: 'emerald',
    border: 'border-emerald-500/20',
  },
  privacidad_disenio: {
    badge: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    accent: 'teal',
    border: 'border-teal-500/20',
  },
  gobernanza: {
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    accent: 'cyan',
    border: 'border-cyan-500/20',
  },
};

export default function PreguntaCard({
  pregunta,
  bloque,
  numeroPregunta,
  totalPreguntas,
  esComplementaria,
  onResponder,
  onConsultarCopilot,
}: PreguntaCardProps) {
  const colors = BLOQUE_COLORS[bloque.id] ?? BLOQUE_COLORS.politica;

  return (
    <div className="animate-fade-slide-up w-full max-w-2xl mx-auto">
      {/* Card principal */}
      <div
        className={`relative rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/60 ${colors.border} overflow-hidden shadow-2xl`}
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}
      >
        {/* Gradient accent top border */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background:
              bloque.id === 'politica'
                ? 'linear-gradient(90deg, transparent, #10b981, transparent)'
                : bloque.id === 'privacidad_disenio'
                ? 'linear-gradient(90deg, transparent, #14b8a6, transparent)'
                : 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
          }}
        />

        {/* Card body */}
        <div className="p-6 sm:p-8">
          {/* Encabezado: bloque + número */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{bloque.icono}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.badge}`}>
                {bloque.titulo}
              </span>
              {esComplementaria && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 border border-slate-600/40">
                  Complementaria
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {numeroPregunta} / {totalPreguntas}
            </span>
          </div>

          {/* Número de pregunta */}
          <div className="mb-4">
            <span
              className="text-6xl font-black leading-none"
              style={{
                WebkitTextStroke: '1px',
                color: 'transparent',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                backgroundImage:
                  bloque.id === 'politica'
                    ? 'linear-gradient(135deg, #10b981, #34d399)'
                    : bloque.id === 'privacidad_disenio'
                    ? 'linear-gradient(135deg, #14b8a6, #5eead4)'
                    : 'linear-gradient(135deg, #06b6d4, #67e8f9)',
              }}
            >
              {pregunta.id}
            </span>
          </div>

          {/* Texto de la pregunta */}
          <h2 className="text-white text-lg sm:text-xl font-semibold leading-relaxed mb-2">
            {pregunta.texto}
          </h2>

          {/* Peso legal (si aplica) */}
          {!esComplementaria && pregunta.peso > 0 && (
            <p className="text-xs text-slate-500 mb-6">
              Peso en cumplimiento global:{' '}
              <span className="text-emerald-400 font-bold">{pregunta.peso}%</span>
            </p>
          )}
          {esComplementaria && (
            <p className="text-xs text-slate-500 mb-6">
              Esta pregunta es <span className="text-slate-400 font-semibold">complementaria</span> y no suma
              directamente al puntaje, pero se registra en el diagnóstico.
            </p>
          )}

          {/* Botones de respuesta */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Botón SÍ */}
            <button
              id={`btn-si-${pregunta.id}`}
              onClick={() => onResponder('si')}
              className="group relative flex items-center justify-center gap-2.5 rounded-xl px-5 py-4 font-bold text-sm transition-all duration-200 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-400/70 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              style={{ boxShadow: '0 0 0 0 rgba(16,185,129,0)' }}
            >
              <span className="text-lg transition-transform group-hover:scale-110">✓</span>
              <span>Sí, cumplimos</span>
            </button>

            {/* Botón NO */}
            <button
              id={`btn-no-${pregunta.id}`}
              onClick={() => onResponder('no')}
              className="group relative flex items-center justify-center gap-2.5 rounded-xl px-5 py-4 font-bold text-sm transition-all duration-200 border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:border-red-400/70 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <span className="text-lg transition-transform group-hover:scale-110">✕</span>
              <span>No, aún no</span>
            </button>
          </div>

          {/* Separador */}
          <div className="border-t border-slate-700/50 pt-4">
            {/* Botón Copilot IA */}
            <button
              id={`btn-copilot-${pregunta.id}`}
              onClick={() => onConsultarCopilot(pregunta)}
              className="group w-full flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-teal-600/20 to-emerald-600/20 border border-teal-500/30 text-teal-300 hover:from-teal-600/35 hover:to-emerald-600/35 hover:border-teal-400/60 hover:text-teal-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <span className="w-6 h-6 rounded-lg bg-teal-500/25 flex items-center justify-center text-base border border-teal-500/30 transition-all group-hover:scale-110">
                🤖
              </span>
              <span>Consultar Copilot IA</span>
              <span className="ml-auto text-teal-500/60 text-xs">¿Qué exige la ley?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Artículo legal mini-tag debajo de la card */}
      <div className="mt-3 flex justify-center">
        <span className="text-[10px] text-slate-600 font-mono">
          📜 {pregunta.articuloLegal}
        </span>
      </div>
    </div>
  );
}
