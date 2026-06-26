'use client';

// ============================================================
// CopilotSidebar — Modo Claro (paleta CAVALTEC)
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
      {/* Backdrop */}
      {abierto && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={onCerrar}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        id="copilot-sidebar"
        className={`
          fixed top-0 right-0 z-40 h-full w-full max-w-md
          bg-white border-l border-[#E2E8F0]
          flex flex-col shadow-2xl
          transition-transform duration-500 ease-out
          ${abierto ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]"
          style={{ background: 'linear-gradient(135deg, #041C4A, #0A2E73)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <span className="text-white text-base">🤖</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Copilot IA</h2>
              <p className="text-[10px] text-[#93C5FD] font-mono">Ley 1581 · Asesoría Legal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${cargando ? 'animate-pulse bg-[#F59E0B]' : 'bg-[#4ADE80]'}`} />
            <span className="text-xs text-white/60">{cargando ? 'Analizando...' : 'Listo'}</span>
            <button
              id="copilot-close-btn"
              onClick={onCerrar}
              className="ml-2 w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/70 hover:text-white transition-all text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#F8FAFC]">
          {/* Skeleton */}
          {cargando && (
            <div className="space-y-4 animate-pulse">
              <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 space-y-2">
                <div className="h-3 w-24 rounded bg-[#E2E8F0]" />
                <div className="h-4 w-full rounded bg-[#E2E8F0]" />
                <div className="h-4 w-4/5 rounded bg-[#E2E8F0]" />
                <div className="h-4 w-3/5 rounded bg-[#E2E8F0]" />
              </div>
              <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 space-y-3">
                <div className="h-3 w-32 rounded bg-[#E2E8F0]" />
                <div className="h-4 w-full rounded bg-[#E2E8F0]" />
                <div className="h-4 w-full rounded bg-[#E2E8F0]" />
                <div className="h-4 w-2/3 rounded bg-[#E2E8F0]" />
                <div className="mt-3 h-16 w-full rounded-lg bg-[#E2E8F0]" />
              </div>
            </div>
          )}

          {/* Contenido real */}
          {mostrarContenido && pregunta && (
            <div className="space-y-4 animate-fade-slide-up">
              {/* Pregunta referenciada */}
              <div className="rounded-xl bg-white border border-[#E2E8F0] p-3 shadow-sm">
                <p className="text-[10px] text-[#2563EB] font-mono uppercase tracking-wider mb-1">
                  Analizando · {pregunta.id}
                </p>
                <p className="text-[#64748B] text-xs leading-relaxed italic">
                  &ldquo;{pregunta.texto}&rdquo;
                </p>
              </div>

              {/* Artículo legal */}
              <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📜</span>
                  <div>
                    <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Marco Legal</p>
                    <p className="text-xs text-[#F59E0B] font-mono font-semibold">{pregunta.articuloLegal}</p>
                  </div>
                </div>
                <blockquote className="text-[#64748B] text-xs leading-relaxed border-l-2 border-[#F59E0B] pl-3 italic">
                  {pregunta.textoLegal}
                </blockquote>
              </div>

              {/* Consejo IA */}
              <div className="rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#2563EB] flex items-center justify-center text-sm">
                    💡
                  </div>
                  <p className="text-[10px] text-[#2563EB] uppercase tracking-wider font-bold">
                    Consejo Empresarial
                  </p>
                </div>
                <div className="text-[#0F172A] text-xs leading-relaxed space-y-2">
                  {pregunta.consejoCopilot.split('\n').map((line, i) => (
                    <p key={i} dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#2563EB]">$1</strong>')
                    }} />
                  ))}
                </div>
              </div>

              {/* Ejemplo práctico */}
              <div className="rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">🏢</span>
                  <p className="text-[10px] text-[#16A34A] uppercase tracking-wider font-bold">
                    Ejemplo Práctico
                  </p>
                </div>
                <p className="text-[#166534] text-xs leading-relaxed">
                  {pregunta.ejemploPractico}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="rounded-lg bg-white border border-[#E2E8F0] p-3">
                <p className="text-[10px] text-[#64748B] leading-relaxed text-center">
                  ⚠️ Esta orientación es informativa. Consulte con un abogado especializado
                  para asesoría legal vinculante.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-white">
          <p className="text-[10px] text-[#64748B] text-center">
            Powered by Datacheck AI · Ley 1581 de 2012 · Colombia
          </p>
        </div>
      </aside>
    </>
  );
}
