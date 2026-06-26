'use client';

// ============================================================
// DiagnosticoWizard — Componente Orquestador Principal
// Layout: Split-screen | Wizard conversacional | Dark Mode
// ============================================================

import { useDiagnostico } from '../../../lib/diagnostico/useDiagnostico';
import { BLOQUES } from '../../../lib/diagnostico/preguntas';
import ProgressBar from './ProgressBar';
import GaugeChart from './GaugeChart';
import PreguntaCard from './PreguntaCard';
import CopilotSidebar from './CopilotSidebar';
import SkipNotice from './SkipNotice';
import ResultadoPanel from './ResultadoPanel';

export default function DiagnosticoWizard() {
  const {
    estado,
    preguntaActual,
    progresoPorcentaje,
    totalPreguntas,
    responder,
    cerrarSkipNotice,
    abrirCopilot,
    cerrarCopilot,
    reiniciar,
  } = useDiagnostico();

  const bloqueActual = preguntaActual
    ? BLOQUES.find((b) => b.id === preguntaActual.bloqueId)
    : null;

  return (
    <>
      {/* ── SKIP NOTICE MODAL ─────────────────────────────────── */}
      {estado.mostrandoSkipNotice && (
        <SkipNotice onClose={cerrarSkipNotice} />
      )}

      {/* ── COPILOT SIDEBAR ───────────────────────────────────── */}
      <CopilotSidebar
        abierto={estado.copilotAbierto}
        pregunta={estado.preguntaCopilot}
        onCerrar={cerrarCopilot}
      />

      {/* ── LAYOUT PRINCIPAL ──────────────────────────────────── */}
      <div className="min-h-screen bg-slate-950 text-white font-sans">
        {/* Background grid pattern */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.04) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Background gradient blob */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(ellipse, #10b98120 0%, #06b6d420 40%, transparent 70%)',
          }}
        />

        {/* ── HEADER ──────────────────────────────────────────── */}
        <header className="relative z-10 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-white text-sm font-black">D</span>
                </div>
                <div>
                  <span className="text-sm font-black text-white tracking-tight">Datacheck</span>
                  <span className="text-sm font-black text-emerald-400 tracking-tight"> AI</span>
                </div>
                <span className="hidden sm:block text-[10px] font-mono text-slate-500 border border-slate-700/50 rounded px-1.5 py-0.5">
                  Ley 1581/2012
                </span>
              </div>

              {/* Progress bar (centro) */}
              {!estado.completado && (
                <div className="flex-1 max-w-xs hidden md:block">
                  <ProgressBar
                    porcentaje={progresoPorcentaje}
                    preguntaActual={Object.keys(estado.respuestas).length}
                    totalPreguntas={totalPreguntas}
                  />
                </div>
              )}

              {/* Score mini (derecha) */}
              <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-xs text-slate-400">Score:</span>
                <span
                  className="text-sm font-black"
                  style={{
                    color:
                      estado.nivelRiesgo === 'critico'
                        ? '#ef4444'
                        : estado.nivelRiesgo === 'en_proceso'
                        ? '#f59e0b'
                        : '#10b981',
                  }}
                >
                  {estado.scoreActual}%
                </span>
              </div>
            </div>

            {/* Mobile progress bar */}
            {!estado.completado && (
              <div className="mt-2 md:hidden">
                <ProgressBar
                  porcentaje={progresoPorcentaje}
                  preguntaActual={Object.keys(estado.respuestas).length}
                  totalPreguntas={totalPreguntas}
                />
              </div>
            )}
          </div>
        </header>

        {/* ── MAIN CONTENT ────────────────────────────────────── */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {estado.completado && estado.resultado ? (
            /* ── RESULTADO FINAL ──────────────────────────── */
            <ResultadoPanel resultado={estado.resultado} onReiniciar={reiniciar} />
          ) : (
            /* ── WIZARD SPLIT-SCREEN ──────────────────────── */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
              {/* ── COLUMNA IZQUIERDA: Pregunta + Sidebar de Bloques ── */}
              <div className="space-y-5">
                {/* Mobile progress */}
                <div className="lg:hidden" />

                {/* Bloque actual pill */}
                {bloqueActual && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{bloqueActual.icono}</span>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-widest">Bloque actual</p>
                      <p className="text-sm font-bold text-white">{bloqueActual.titulo}</p>
                    </div>
                    <div className="ml-auto text-xs text-slate-500 font-mono">
                      Máx {bloqueActual.pesoMaximo}% del score
                    </div>
                  </div>
                )}

                {/* Tarjeta de pregunta */}
                {preguntaActual && bloqueActual ? (
                  <PreguntaCard
                    key={preguntaActual.id} // key fuerza re-mount para animación
                    pregunta={preguntaActual}
                    bloque={bloqueActual}
                    numeroPregunta={estado.preguntaActualIndex + 1}
                    totalPreguntas={totalPreguntas}
                    esComplementaria={preguntaActual.esComplementaria}
                    onResponder={responder}
                    onConsultarCopilot={abrirCopilot}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 rounded-2xl bg-slate-800/40 border border-slate-700/40">
                    <p className="text-slate-500">Cargando siguiente pregunta...</p>
                  </div>
                )}

                {/* Bloques completados (navegación visual) */}
                <div className="grid grid-cols-3 gap-3">
                  {BLOQUES.map((bloque) => {
                    const preguntasDelBloque = Array.from({ length: 11 })
                      .map((_, i) => `Q${i + 1}`)
                      .filter((id) => {
                        const p = id;
                        // Map IDs to bloques
                        if (bloque.id === 'politica') return ['Q1','Q2','Q3','Q4','Q5'].includes(p);
                        if (bloque.id === 'privacidad_disenio') return ['Q6','Q7','Q8'].includes(p);
                        return ['Q9','Q10','Q11'].includes(p);
                      });
                    const respondidas = preguntasDelBloque.filter((id) => estado.respuestas[id]).length;
                    const esActivo = bloqueActual?.id === bloque.id;

                    return (
                      <div
                        key={bloque.id}
                        className={`rounded-xl p-3 border transition-all duration-300 ${
                          esActivo
                            ? 'border-emerald-500/40 bg-emerald-500/10'
                            : respondidas > 0
                            ? 'border-slate-600/50 bg-slate-800/40'
                            : 'border-slate-700/30 bg-slate-800/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm">{bloque.icono}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {respondidas}/{preguntasDelBloque.length}
                          </span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 leading-tight">
                          {bloque.titulo}
                        </p>
                        <div className="mt-2 h-1 w-full rounded-full bg-slate-700/60 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(respondidas / preguntasDelBloque.length) * 100}%`,
                              background: esActivo
                                ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                                : '#475569',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── COLUMNA DERECHA: Gauge + Info ── */}
              <div className="space-y-4 lg:sticky lg:top-24">
                {/* Gauge Card */}
                <div
                  className="rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/60 p-5 shadow-xl"
                  style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Score en Tiempo Real
                    </p>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="flex justify-center">
                    <GaugeChart
                      score={estado.scoreActual}
                      nivelRiesgo={estado.nivelRiesgo}
                    />
                  </div>
                </div>

                {/* Info legal card */}
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span>⚖️</span> Marco Legal
                  </p>
                  <div className="space-y-2 text-[11px] text-slate-500 leading-relaxed">
                    <p>
                      <span className="text-slate-400 font-semibold">Ley 1581 de 2012</span> — Estatuto de
                      Protección de Datos Personales en Colombia.
                    </p>
                    <p>
                      <span className="text-slate-400 font-semibold">Decreto 1074 de 2015</span> — Reglamentación
                      del tratamiento de datos.
                    </p>
                    <p>
                      <span className="text-slate-400 font-semibold">Autoridad:</span> Superintendencia de Industria
                      y Comercio (SIC).
                    </p>
                  </div>
                </div>

                {/* Consejos de respuesta */}
                <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-4">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    💡 Use el botón{' '}
                    <span className="text-teal-400 font-semibold">Consultar Copilot IA</span> para
                    entender qué exige exactamente la ley para cada pregunta en lenguaje empresarial.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
