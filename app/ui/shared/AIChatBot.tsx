'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';

export default function AIChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#041C4A] p-4 text-white">
        <h3 className="font-bold flex items-center gap-2">
          <span className="text-xl">🤖</span>
          Asistente Legal Ley 1581
        </h3>
        <p className="text-xs text-blue-200 mt-1">Respondo dudas concretas sobre protección de datos.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
        {messages.length === 0 && (
          <div className="text-center text-[#64748B] text-sm mt-10">
            ¡Hola! Pregúntame sobre los derechos ARCO, plazos de respuesta o manejo de datos sensibles.
          </div>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
              m.role === 'user' 
                ? 'bg-[#2563EB] text-white rounded-br-none' 
                : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E2E8F0] rounded-xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-[#E2E8F0] flex gap-2">
        <input
          className="flex-1 input-base px-3 py-2 text-sm"
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe tu consulta legal..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="btn-primary px-4 py-2 text-sm flex items-center justify-center disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
