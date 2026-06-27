'use client';

// ============================================================
// PreguntaCard — Modo Claro (paleta CAVALTEC) con Copilot Integrado
// ============================================================


import type { Pregunta, Bloque } from '../../../lib/diagnostico/types';
import { useEmpresa } from '../../../lib/empresa/useEmpresa';

interface PreguntaCardProps {
  pregunta: Pregunta;
  bloque: Bloque;
  numeroPregunta: number;
  totalPreguntas: number;
  esComplementaria: boolean;
  onResponder: (valor: 'si' | 'no') => void;
  onConsultarCopilot?: (pregunta: Pregunta) => void;
}

const BLOQUE_CONFIG: Record<string, { topBar: string; numGradient: string; badgeBg: string; badgeColor: string; badgeBorder: string }> = {
  politica: {
    topBar:       'linear-gradient(90deg, transparent, #16A34A, transparent)',
    numGradient:  'linear-gradient(135deg, #16A34A, #4ADE80)',
    badgeBg:      '#DCFCE7',
    badgeColor:   '#16A34A',
    badgeBorder:  '#BBF7D0',
  },
  privacidad_disenio: {
    topBar:       'linear-gradient(90deg, transparent, #2563EB, transparent)',
    numGradient:  'linear-gradient(135deg, #2563EB, #60A5FA)',
    badgeBg:      '#EFF6FF',
    badgeColor:   '#2563EB',
    badgeBorder:  '#BFDBFE',
  },
  gobernanza: {
    topBar:       'linear-gradient(90deg, transparent, #F59E0B, transparent)',
    numGradient:  'linear-gradient(135deg, #F59E0B, #FCD34D)',
    badgeBg:      '#FEF3C7',
    badgeColor:   '#F59E0B',
    badgeBorder:  '#FDE68A',
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
  const cfg = BLOQUE_CONFIG[bloque.id] ?? BLOQUE_CONFIG.politica;
  const { empresa } = useEmpresa();

  return (
    <div className="animate-fade-slide-up w-full max-w-2xl mx-auto">
      {/* Card principal */}
      <div className="relative rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-lg">
        {/* Borde superior de color */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: cfg.topBar }} />

        <div className="p-6 sm:p-8">
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">{bloque.icono}</span>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                style={{ background: cfg.badgeBg, color: cfg.badgeColor, borderColor: cfg.badgeBorder }}
              >
                {bloque.titulo}
              </span>
              {esComplementaria && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                  Complementaria
                </span>
              )}
            </div>
            <span className="text-xs text-[#64748B] font-mono">
              {numeroPregunta} / {totalPreguntas}
            </span>
          </div>

          {/* Número grande en gradiente */}
          <div className="mb-4">
            <span
              className="text-6xl font-black leading-none"
              style={{
                color: 'transparent',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                backgroundImage: cfg.numGradient,
              }}
            >
              {pregunta.id}
            </span>
          </div>

          {/* Texto de la pregunta */}
          <h2 className="text-[#0F172A] text-lg sm:text-xl font-semibold leading-relaxed mb-2">
            {pregunta.texto}
          </h2>

          {/* Peso */}
          {!esComplementaria && pregunta.peso > 0 && (
            <p className="text-xs text-[#64748B] mb-6">
              Peso en cumplimiento global:{' '}
              <span className="font-bold" style={{ color: cfg.badgeColor }}>{pregunta.peso}%</span>
            </p>
          )}
          {esComplementaria && (
            <p className="text-xs text-[#64748B] mb-6">
              Esta pregunta es <span className="text-[#0F172A] font-semibold">complementaria</span> y no suma
              directamente al puntaje, pero se registra en el diagnóstico.
            </p>
          )}

          {/* Botones Sí / No */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              id={`btn-si-${pregunta.id}`}
              onClick={() => onResponder('si')}
              className="group flex items-center justify-center gap-2.5 rounded-xl px-5 py-4 font-bold text-sm transition-all duration-200 border-2 border-[#BBF7D0] bg-[#DCFCE7] text-[#16A34A] hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-lg transition-transform group-hover:scale-110">✓</span>
              <span>Sí, cumplimos</span>
            </button>
            <button
              id={`btn-no-${pregunta.id}`}
              onClick={() => onResponder('no')}
              className="group flex items-center justify-center gap-2.5 rounded-xl px-5 py-4 font-bold text-sm transition-all duration-200 border-2 border-[#FECACA] bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-lg transition-transform group-hover:scale-110">✕</span>
              <span>No, aún no</span>
            </button>
          </div>

        </div>
      </div>

      {/* Artículo legal */}
      <div className="mt-3 flex justify-center">
        <span className="text-[10px] text-[#64748B] font-mono bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-full">
          📜 {pregunta.articuloLegal}
        </span>
      </div>
    </div>
  );
}
