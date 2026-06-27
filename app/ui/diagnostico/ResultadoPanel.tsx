'use client';

// ============================================================
// ResultadoPanel — Modo Claro (paleta CAVALTEC)
// ============================================================

import type { ResultadoDiagnostico, NivelRiesgo } from '../../../lib/diagnostico/types';
import GaugeChart from './GaugeChart';
import PDFReportGenerator from '../shared/PDFReportGenerator';

interface ResultadoPanelProps {
  resultado: ResultadoDiagnostico;
  onReiniciar: () => void;
  onVerDashboard?: () => void;
  empresaNombre?: string;
  emailEvaluador?: string;
}

const NIVEL_CONFIG: Record<NivelRiesgo, { label: string; description: string; color: string; bg: string; border: string; icon: string }> = {
  riesgo_alto: {
    label: 'Riesgo Alto (0 - 49%)',
    description: 'Su organización enfrenta riesgos legales significativos. Se requieren acciones inmediatas y correctivas.',
    color: '#EF4444',
    bg: '#FEE2E2',
    border: '#FECACA',
    icon: '🚨',
  },
  riesgo_medio: {
    label: 'Riesgo Medio (50 - 69%)',
    description: 'Hay vacíos importantes en el cumplimiento. Necesita priorizar y asignar recursos pronto.',
    color: '#F59E0B',
    bg: '#FEF3C7',
    border: '#FDE68A',
    icon: '⚠️',
  },
  aceptable: {
    label: 'Aceptable (70 - 89%)',
    description: 'Va por buen camino. Sin embargo, existen brechas de cumplimiento que deben cerrarse.',
    color: '#059669',
    bg: '#D1FAE5',
    border: '#A7F3D0',
    icon: '👍',
  },
  excelente: {
    label: 'Excelente (90 - 100%)',
    description: '¡Felicitaciones! Su organización demuestra un alto y robusto nivel de cumplimiento.',
    color: '#16A34A',
    bg: '#DCFCE7',
    border: '#BBF7D0',
    icon: '🌟',
  },
};

const BLOQUE_ACCENT: Record<string, string> = {
  politica:          '#16A34A',
  privacidad_disenio: '#2563EB',
  gobernanza:        '#F59E0B',
};

export default function ResultadoPanel({ resultado, onReiniciar, onVerDashboard, empresaNombre = 'Mi Empresa', emailEvaluador = '' }: ResultadoPanelProps) {
  const config = NIVEL_CONFIG[resultado.nivelRiesgo];
  const fecha  = resultado.fechaCompletado.toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="animate-fade-slide-up w-full max-w-4xl mx-auto space-y-6 pb-12">

      {/* ── Hero ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 border"
        style={{ background: config.bg, borderColor: config.border }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <GaugeChart score={resultado.scoreTotal} nivelRiesgo={resultado.nivelRiesgo} />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
              <span className="text-2xl">{config.icon}</span>
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color: config.color }}>
                Resultado Final
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: config.color }}>
              {config.label}
            </h2>
            <p className="text-[#64748B] text-sm leading-relaxed mb-4">
              {config.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {[
                { val: `${resultado.scoreTotal}%`, label: 'Score Global', color: config.color },
                {
                  val: Object.values(resultado.respuestas).filter(r => r.valor === 'si' && !r.bloqueada).length,
                  label: 'Sí respondidas',
                  color: '#16A34A',
                },
                {
                  val: Object.values(resultado.respuestas).filter(r => r.valor === 'no' && !r.bloqueada).length,
                  label: 'Brechas',
                  color: '#EF4444',
                },
              ].map(({ val, label, color }) => (
                <div key={label} className="text-center px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                  <p className="text-2xl font-black" style={{ color }}>{val}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#64748B] mt-4">Diagnóstico completado el {fecha}</p>
          </div>
        </div>
      </div>

      {/* ── Desglose por bloque ── */}
      <div>
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest mb-3 px-1">
          Desglose por Bloque
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {resultado.resultadosPorBloque.map(({ bloque, scoreObtenido, scoreMaximo, porcentaje, preguntasRespondidas, preguntasBloqueadas }) => {
            const accent = BLOQUE_ACCENT[bloque.id] ?? '#2563EB';
            return (
              <div
                key={bloque.id}
                className="rounded-xl bg-white border border-[#E2E8F0] p-5 hover:border-[#BFDBFE] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{bloque.icono}</span>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A] leading-tight">{bloque.titulo}</p>
                    <p className="text-[10px] text-[#64748B]">Máx {bloque.pesoMaximo}% global</p>
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-black" style={{ color: accent }}>
                    {scoreObtenido}
                  </span>
                  <span className="text-[#64748B] text-sm mb-0.5">/ {scoreMaximo} pts</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E2E8F0] mb-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${porcentaje}%`, backgroundColor: accent }}
                  />
                </div>
                <p className="text-xs text-[#64748B]">
                  {porcentaje}% del bloque ·{' '}
                  {preguntasRespondidas} pregunta{preguntasRespondidas !== 1 ? 's' : ''} activa{preguntasRespondidas !== 1 ? 's' : ''}
                  {preguntasBloqueadas > 0 && (
                    <span className="text-[#F59E0B]"> · {preguntasBloqueadas} bloqueada{preguntasBloqueadas !== 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Plan de Mejora 30-60-90 ── */}
      <div className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-widest flex items-center gap-2">
            <span className="text-base">📅</span>
            Plan de Mejora a 30, 60 y 90 días
          </h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              dias: 30,
              titulo: 'Corto Plazo (Inmediato)',
              color: '#EF4444',
              bg: '#FEE2E2',
              recs: resultado.recomendaciones.filter((r, i) => r.startsWith('✅') ? true : i % 3 === 0),
            },
            {
              dias: 60,
              titulo: 'Mediano Plazo',
              color: '#F59E0B',
              bg: '#FEF3C7',
              recs: resultado.recomendaciones.filter((r, i) => !r.startsWith('✅') && i % 3 === 1),
            },
            {
              dias: 90,
              titulo: 'Largo Plazo',
              color: '#16A34A',
              bg: '#DCFCE7',
              recs: resultado.recomendaciones.filter((r, i) => !r.startsWith('✅') && i % 3 === 2),
            },
          ].map((columna) => (
            <div key={columna.dias} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black" style={{ background: columna.bg, color: columna.color }}>
                  {columna.dias} DÍAS
                </span>
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">{columna.titulo}</span>
              </div>
              
              {columna.recs.length === 0 ? (
                <p className="text-xs text-[#94A3B8] italic">No hay acciones pendientes para esta fase.</p>
              ) : (
                <ul className="space-y-3 flex-1">
                  {columna.recs.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#0F172A] leading-relaxed">
                      <span className="flex-shrink-0 text-[#64748B] mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 text-center">
        <p className="text-xs text-[#64748B] leading-relaxed">
          ⚠️ Este diagnóstico es una herramienta de autodiagnóstico con fines orientativos basada en la Ley 1581 de 2012.
          No constituye asesoría legal vinculante. Para situaciones específicas, consulte a un abogado especializado en
          protección de datos personales en Colombia.
        </p>
      </div>

      {/* ── Acciones ── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          id="btn-reiniciar"
          onClick={onReiniciar}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-semibold text-sm transition-all duration-200 hover:scale-[1.02] shadow-sm"
        >
          🔄 Nuevo Diagnóstico
        </button>
        {onVerDashboard && (
          <button
            id="btn-ver-dashboard"
            onClick={onVerDashboard}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] font-semibold text-sm transition-all duration-200 hover:scale-[1.02] shadow-sm"
          >
            🏠 Ver Dashboard
          </button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-center">
        <PDFReportGenerator
          empresaNombre={empresaNombre}
          scoreTotal={resultado.scoreTotal}
          nivelRiesgo={resultado.nivelRiesgo}
          fecha={resultado.fechaCompletado.toISOString()}
          resultadosPorBloque={resultado.resultadosPorBloque}
          recomendaciones={resultado.recomendaciones}
          emailEvaluador={emailEvaluador}
        />
      </div>
    </div>
  );
}
