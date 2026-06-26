'use client';

// ============================================================
// ProgressBar — Modo Claro (paleta CAVALTEC)
// ============================================================

interface ProgressBarProps {
  porcentaje: number;  // 0-100
  preguntaActual: number;
  totalPreguntas: number;
}

export default function ProgressBar({ porcentaje, preguntaActual, totalPreguntas }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-[#64748B] font-mono">
          {preguntaActual}/{totalPreguntas} preguntas
        </span>
        <span className="text-[10px] font-bold text-[#0F172A]">{porcentaje}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
        <div
          className="h-full rounded-full animate-shimmer transition-all duration-500 ease-out"
          style={{
            width: `${porcentaje}%`,
            background: 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 40%, #3B82F6 60%, #2563EB 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  );
}
