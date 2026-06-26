'use client';

// ============================================================
// CopilotSidebar — Panel lateral del Asistente IA
// ============================================================

import { useState, useEffect } from 'react';
import type { Pregunta } from '../../../lib/diagnostico/types';

interface CopilotSidebarProps {
  abierto: boolean;
  pregunta: Pregunta | null;
  onCerrar: () => void;
}

export default function CopilotSidebar({ abierto, pregunta, onCerrar }: CopilotSidebarProps) {
  const [cargando, setCargando] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);

  // Simular carga de IA cuando cambia la pregunta activa
  useEffect(() => {
    if (abierto && pregunta) {
      setCargando(true);
      setMostrarContenido(false);
      const timer = setTimeout(() => {
        setCargando(false);
        setMostrarContenido(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [abierto, pregunta?.id]);

  return (
    <>
      {/* Overlay backdrop */}
      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onCerrar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="copilot-sidebar"
        className={`
          fixed top-0 right-0 z-40 h-full w-full max-w-md
          bg-slate-900/98 backdrop-blur-xl border-l border-slate-700/60
          flex flex-col shadow-2xl
          transition-transform duration-500 ease-out
          ${abierto ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ boxShadow: '-4px 0 40px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-white text-base">🤖</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Copilot IA</h2>
              <p className="text-[10px] text-teal-400 font-mono">Ley 1581 · Asesoría Legal</p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cargando ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="text-xs text-slate-400">{cargando ? 'Analizando...' : 'Listo'}</span>
            <button
              id="copilot-close-btn"
              onClick={onCerrar}
              className="ml-2 w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* Skeleton UI mientras carga */}
          {cargando && (
            <div className="space-y-4 animate-pulse">
              {/* Skeleton artículo */}
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-4 space-y-2">
                <div className="h-3 w-24 rounded bg-slate-700" />
                <div className="h-4 w-full rounded bg-slate-700" />
                <div className="h-4 w-4/5 rounded bg-slate-700" />
                <div className="h-4 w-3/5 rounded bg-slate-700" />
              </div>
              {/* Skeleton consejo */}
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/40 p-4 space-y-3">
                <div className="h-3 w-32 rounded bg-slate-700" />
                <div className="h-4 w-full rounded bg-slate-700" />
                <div className="h-4 w-full rounded bg-slate-700" />
                <div className="h-4 w-2/3 rounded bg-slate-700" />
                <div className="mt-3 h-16 w-full rounded-lg bg-slate-700" />
              </div>
            </div>
          )}

          {/* Contenido real */}
          {mostrarContenido && pregunta && (
            <div className="space-y-4 animate-fade-slide-up">
              {/* Pregunta referenciada */}
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 p-3">
                <p className="text-[10px] text-teal-400 font-mono uppercase tracking-wider mb-1">
                  Analizando · {pregunta.id}
                </p>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  &ldquo;{pregunta.texto}&rdquo;
                </p>
              </div>

              {/* Artículo legal */}
              <div className="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📜</span>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Marco Legal</p>
                    <p className="text-xs text-amber-400 font-mono font-semibold">{pregunta.articuloLegal}</p>
                  </div>
                </div>
                <blockquote className="text-slate-400 text-xs leading-relaxed border-l-2 border-amber-500/50 pl-3 italic">
                  {pregunta.textoLegal}
                </blockquote>
              </div>

              {/* Consejo del Copilot IA */}
              <div className="rounded-xl bg-gradient-to-br from-teal-950/60 to-emerald-950/40 border border-teal-500/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center text-sm border border-teal-500/30">
                    💡
                  </div>
                  <p className="text-[10px] text-teal-400 uppercase tracking-wider font-semibold">
                    Consejo Empresarial
                  </p>
                </div>
                {/* Renderizar markdown básico (bold) */}
                <div className="text-slate-300 text-xs leading-relaxed space-y-2">
                  {pregunta.consejoCopilot.split('\n').map((line, i) => (
                    <p key={i} dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-300">$1</strong>')
                    }} />
                  ))}
                </div>
              </div>

              {/* Ejemplo práctico */}
              <div className="rounded-xl bg-slate-800/40 border border-emerald-500/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">🏢</span>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                    Ejemplo Práctico
                  </p>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {pregunta.ejemploPractico}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg bg-slate-800/20 border border-slate-700/30 p-3">
                <p className="text-[10px] text-slate-600 leading-relaxed text-center">
                  ⚠️ Esta orientación es informativa. Consulte con un abogado especializado
                  para asesoría legal vinculante.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-700/60">
          <p className="text-[10px] text-slate-600 text-center">
            Powered by Datacheck AI · Ley 1581 de 2012 · Colombia
          </p>
        </div>
      </aside>
    </>
  );
}
