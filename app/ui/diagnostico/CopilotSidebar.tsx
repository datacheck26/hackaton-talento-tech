'use client';

// ============================================================
// CopilotSidebar — Modo Claro (paleta CAVALTEC) con Chat Activo
// ============================================================

import { useState, useEffect, useRef } from 'react';
import type { Pregunta } from '../../../lib/diagnostico/types';
import { useEmpresa } from '../../../lib/empresa/useEmpresa';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface CopilotSidebarProps {
  abierto: boolean;
  pregunta: Pregunta | null;
  onCerrar: () => void;
}

function renderMarkdown(text: string) {
  // Simple conversion of bold and newlines for styling the AI chat reply
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\* (.*?)$/gm, '• $1')
    .split('\n')
    .join('<br />');
  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}

export default function CopilotSidebar({ abierto, pregunta, onCerrar }: CopilotSidebarProps) {
  const { empresa } = useEmpresa();
  const [cargando, setCargando] = useState(false);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [enviando, setEnviando] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0 || enviando) {
      scrollToBottom();
    }
  }, [messages, enviando]);

  useEffect(() => {
    if (abierto && pregunta) {
      setCargando(true);
      setMostrarContenido(false);
      setMessages([]);
      setInputVal('');
      setEnviando(false);
      
      const timer = setTimeout(() => {
        setCargando(false);
        setMostrarContenido(true);
      }, 1400);
      
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [abierto, pregunta?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || enviando || !pregunta) return;

    const userMsg = inputVal.trim();
    setInputVal('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setEnviando(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pregunta: {
            id: pregunta.id,
            texto: pregunta.texto,
            articuloLegal: pregunta.articuloLegal,
            textoLegal: pregunta.textoLegal,
          },
          mensajeUsuario: userMsg,
          empresa: empresa ? {
            nombre: empresa.nombre,
            sector: empresa.sector,
            tamano: empresa.tamano
          } : null,
        }),
      });

      if (!res.ok) throw new Error('Error al conectar con la IA');

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'assistant', text: data.respuesta }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: '❌ Lo siento, no logré procesar tu solicitud. Por favor intenta de nuevo.' }
      ]);
    } finally {
      setEnviando(false);
    }
  };

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

              {/* ── SECCIÓN CHAT INTERACTIVO ───────────────────── */}
              <div className="border-t border-[#E2E8F0] my-6 pt-6 space-y-4">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <span className="text-sm">💬</span> Chat Interactivo Copilot
                </h3>

                {/* Historial de mensajes */}
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-xs text-[#64748B] italic bg-white border border-[#E2E8F0] rounded-xl p-4 text-center shadow-sm">
                      ¿Tienes dudas sobre esta pregunta o sobre cómo implementarla en tu empresa? Escríbela abajo y te responderé en tiempo real.
                    </p>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 max-w-[85%] ${
                          msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                        }`}
                      >
                        {msg.sender === 'assistant' && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#041C4A] to-[#0A2E73] flex items-center justify-center text-white text-[10px] flex-shrink-0">
                            🤖
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-[#2563EB] text-white rounded-tr-none'
                              : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-none shadow-sm'
                          }`}
                        >
                          {msg.sender === 'assistant' ? (
                            renderMarkdown(msg.text)
                          ) : (
                            <p>{msg.text}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {enviando && (
                    <div className="flex gap-2.5 max-w-[85%]">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#041C4A] to-[#0A2E73] flex items-center justify-center text-white text-[10px] flex-shrink-0">
                        🤖
                      </div>
                      <div className="bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-none px-3.5 py-3 text-xs shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
                {/* Ref for auto scrolling */}
                <div ref={messagesEndRef} />
              </div>

            </div>
          )}
        </div>

        {/* Footer con Formulario del Chat */}
        <div className="px-4 py-3.5 border-t border-[#E2E8F0] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          {pregunta && mostrarContenido && !cargando ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Pregunta a la IA sobre este requisito..."
                className="input-base flex-1 px-3.5 py-2.5 text-xs text-[#0F172A] border-[#E2E8F0]"
                disabled={enviando}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || enviando}
                className="btn-primary px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Enviar</span>
                <span>➔</span>
              </button>
            </form>
          ) : (
            <p className="text-[10px] text-[#64748B] text-center">
              Powered by Datacheck AI · Ley 1581 de 2012 · Colombia
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

