'use client';

// ============================================================
// SkipNotice — Aviso animado cuando Q1=No salta Q2-Q5
// ============================================================

import { useEffect } from 'react';

interface SkipNoticeProps {
  onClose: () => void;
}

export default function SkipNotice({ onClose }: SkipNoticeProps) {
  // Auto-cerrar después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="animate-fade-slide-up fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        className="pointer-events-auto relative max-w-lg w-full rounded-2xl border border-amber-500/40 bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xl"
        style={{ boxShadow: '0 0 40px rgba(245,158,11,0.2), 0 25px 50px rgba(0,0,0,0.5)' }}
      >
        {/* Icono */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl border border-amber-500/30">
            ⚡
          </div>
          <div className="flex-1">
            <h3 className="text-amber-400 font-bold text-base mb-2">
              Requisitos derivados calculados automáticamente
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Al no poseer una{' '}
              <span className="text-amber-400 font-semibold">Política de Datos Personales</span>,
              los requisitos derivados (Preguntas 2 a 5) se han calculado en{' '}
              <span className="text-red-400 font-bold">0%</span> para mitigar riesgos
              de incumplimiento. Avanzamos al siguiente bloque técnico.
            </p>
          </div>
        </div>

        {/* Artículo legal referenciado */}
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400/80 font-mono">
            📜 Ref: Art. 13 y 17, Ley 1581/2012 — Política de tratamiento obligatoria
          </p>
        </div>

        {/* Barra de progreso de auto-cierre */}
        <div className="mt-4 h-1 w-full rounded-full bg-slate-700/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ animation: 'shrink-width 4s linear forwards' }}
          />
        </div>

        {/* Botón de cierre */}
        <button
          id="skip-notice-close"
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-all text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
