// ============================================================
// MetricCard — Tarjeta de métrica para el dashboard
// ============================================================

import type { NivelRiesgo } from '../../../lib/diagnostico/types';

interface MetricCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icono: string;
  nivelRiesgo?: NivelRiesgo | null;
  variante?: 'default' | 'conforme' | 'proceso' | 'critico';
}

const VARIANTE_STYLES = {
  default:   { bg: '#FFFFFF', border: '#E2E8F0', iconBg: '#EFF6FF',     iconColor: '#2563EB', textColor: '#0F172A' },
  conforme:  { bg: '#DCFCE7', border: '#BBF7D0', iconBg: '#16A34A20',  iconColor: '#16A34A', textColor: '#166534' },
  proceso:   { bg: '#FEF3C7', border: '#FDE68A', iconBg: '#F59E0B20',  iconColor: '#F59E0B', textColor: '#92400E' },
  critico:   { bg: '#FEE2E2', border: '#FECACA', iconBg: '#EF444420',  iconColor: '#EF4444', textColor: '#991B1B' },
};

function nivelToVariante(nivel: NivelRiesgo | null | undefined): MetricCardProps['variante'] {
  if (!nivel) return 'default';
  if (nivel === 'conforme')  return 'conforme';
  if (nivel === 'en_proceso') return 'proceso';
  return 'critico';
}

export default function MetricCard({ titulo, valor, subtitulo, icono, nivelRiesgo, variante }: MetricCardProps) {
  const v = variante ?? nivelToVariante(nivelRiesgo);
  const s = VARIANTE_STYLES[v ?? 'default'];

  return (
    <div
      className="rounded-2xl p-5 border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ background: s.bg, borderColor: s.border }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: '#64748B' }}>
            {titulo}
          </p>
          <p className="text-3xl font-black" style={{ color: s.textColor }}>
            {valor}
          </p>
          {subtitulo && (
            <p className="text-xs mt-1" style={{ color: '#64748B' }}>
              {subtitulo}
            </p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: s.iconBg }}
        >
          {icono}
        </div>
      </div>
    </div>
  );
}
