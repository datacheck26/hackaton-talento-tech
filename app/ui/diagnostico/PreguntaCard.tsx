'use client';

// ============================================================
// PreguntaCard — Modo Claro (paleta CAVALTEC) con Copilot Integrado
// ============================================================

import { useState, useEffect, useRef } from 'react';
import type { Pregunta, Bloque } from '../../../lib/diagnostico/types';
import { useEmpresa } from '../../../lib/empresa/useEmpresa';
import EvidenciaUploader from './EvidenciaUploader';

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

function renderMarkdown(text: string) {
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\* (.*?)$/gm, '• $1')
    .split('\n')
    .join('<br />');
  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}

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

  const [copilotAbierto, setCopilotAbierto] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([]);
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

  // Reset when question changes
  useEffect(() => {
    setCopilotAbierto(false);
    setMessages([]);
    setInputVal('');
    setEnviando(false);
  }, [pregunta.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || enviando) return;

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

      if (!res.ok) throw new Error();

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'assistant', text: data.respuesta }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: '❌ Error al conectar con Copilot. Inténtalo de nuevo.' }
      ]);
    } finally {
      setEnviando(false);
    }
  };

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

          {/* Subir Evidencia (opcional) */}
          <EvidenciaUploader 
            preguntaId={pregunta.id} 
            onUploadSuccess={(url) => {
              console.log('Evidencia subida:', url);
              // Podríamos inyectarlo al store global si fuese necesario
            }} 
          />

          {/* Copilot */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <button
              id={`btn-copilot-${pregunta.id}`}
              onClick={() => {
                setCopilotAbierto((prev) => !prev);
                if (onConsultarCopilot) onConsultarCopilot(pregunta);
              }}
              className={`group w-full flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 font-semibold text-sm transition-all duration-200 ${
                copilotAbierto
                  ? 'bg-[#2563EB] text-white border border-[#2563EB]'
                  : 'bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]'
              } hover:scale-[1.01] active:scale-[0.99]`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-base border transition-all ${
                copilotAbierto
                  ? 'bg-white/20 border-white/30 text-white'
                  : 'bg-[#BFDBFE] border-[#93C5FD] text-[#2563EB] group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white'
              }`}>
                🤖
              </span>
              <span>{copilotAbierto ? 'Ocultar Copilot IA' : 'Consultar Copilot IA'}</span>
              <span className={`ml-auto text-xs ${
                copilotAbierto ? 'text-white/70' : 'text-[#64748B] group-hover:text-white/70'
              }`}>
                {copilotAbierto ? 'Cerrar chat' : '¿Qué exige la ley?'}
              </span>
            </button>

            {/* Collapsible Copilot box */}
            {copilotAbierto && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-4 animate-scale-in">
                {/* Consejo rápido consolidado */}
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 text-xs space-y-2 text-[#0F172A]">
                  <div className="flex items-start gap-2">
                    <span className="text-sm flex-shrink-0">💡</span>
                    <p className="leading-relaxed">
                      <strong className="text-[#2563EB]">Consejo:</strong>{' '}
                      {pregunta.consejoCopilot.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 border-t border-[#BFDBFE]/60 pt-2">
                    <span className="text-sm flex-shrink-0">🏢</span>
                    <p className="leading-relaxed">
                      <strong className="text-[#2563EB]">Ejemplo:</strong>{' '}
                      {pregunta.ejemploPractico}
                    </p>
                  </div>
                </div>

                {/* Chatbox area */}
                <div className="space-y-3.5">
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    💬 Chat rápido con Copilot IA
                  </p>

                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {messages.length === 0 ? (
                      <p className="text-xs text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl p-3.5 text-center shadow-sm italic">
                        Pregúntame cualquier duda de cumplimiento técnico o legal sobre este requisito y te responderé de forma ultra directa.
                      </p>
                    ) : (
                      messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-2 max-w-[90%] ${
                            msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                          }`}
                        >
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-[#2563EB] text-white rounded-tr-none'
                                : 'bg-[#F1F5F9] text-[#0F172A] rounded-tl-none border border-[#E2E8F0] shadow-sm'
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
                      <div className="flex gap-2">
                        <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl rounded-tl-none px-3 py-2 text-xs flex items-center gap-1.5 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#64748B] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleSendMessage} className="flex gap-2" noValidate>
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Escribe tu duda sobre esta regla..."
                      className="input-base flex-1 px-3.5 py-2.5 text-xs text-[#0F172A] border-[#E2E8F0]"
                      disabled={enviando}
                    />
                    <button
                      type="submit"
                      disabled={!inputVal.trim() || enviando}
                      className="btn-primary px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Preguntar</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

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
