'use client';

// ============================================================
// ProgressBar — Barra de progreso fluida con animación CSS
// ============================================================

interface ProgressBarProps {
  porcentaje: number;        // 0-100
  preguntaActual: number;    // índice 0-based
  totalPreguntas: number;
}

export default function ProgressBar({
  porcentaje,
  preguntaActual,
  totalPreguntas,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Label superior */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
          Progreso del Diagnóstico
        </span>
        <span className="text-xs font-bold text-emerald-400">
          {preguntaActual} / {totalPreguntas} preguntas
        </span>
      </div>

      {/* Track de la barra */}
      <div className="relative h-2 w-full rounded-full bg-slate-700/60 overflow-hidden">
        {/* Relleno animado */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${porcentaje}%`,
            background: 'linear-gradient(90deg, #10b981, #06b6d4)',
          }}
        />
        {/* Shimmer effect */}
        <div
          className="absolute inset-y-0 rounded-full animate-shimmer"
          style={{
            width: `${porcentaje}%`,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Porcentaje textual */}
      <div className="mt-1 text-right">
        <span className="text-[10px] text-slate-500">{porcentaje}% completado</span>
      </div>
    </div>
  );
}
