// ============================================================
// /dashboard/diagnostico — Página del Wizard (área autenticada)
// ============================================================

import type { Metadata } from 'next';
import DiagnosticoWizard from '../../ui/diagnostico/DiagnosticoWizard';

export const metadata: Metadata = {
  title: 'Diagnóstico de Cumplimiento | Datacheck AI',
  description:
    'Herramienta de autodiagnóstico de cumplimiento de la Ley 1581 de 2012 (Protección de Datos Personales en Colombia). Evalúe su organización con Privacy by Design.',
  robots: 'noindex',
};

export default function DiagnosticoEnDashboard() {
  return <DiagnosticoWizard />;
}
