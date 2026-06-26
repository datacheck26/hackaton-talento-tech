// ============================================================
// /diagnostico — Server Component Shell (App Router)
// ============================================================

import type { Metadata } from 'next';
import DiagnosticoWizard from '../ui/diagnostico/DiagnosticoWizard';

export const metadata: Metadata = {
  title: 'Diagnóstico de Cumplimiento | Datacheck AI',
  description:
    'Herramienta de autodiagnóstico de cumplimiento de la Ley 1581 de 2012 (Protección de Datos Personales en Colombia). Evalúe su organización con Privacy by Design.',
  keywords: ['Ley 1581', 'protección de datos', 'Colombia', 'cumplimiento', 'GDPR', 'privacy by design', 'diagnóstico'],
  robots: 'index, follow',
  openGraph: {
    title: 'Datacheck AI — Diagnóstico Ley 1581',
    description: 'Autodiagnóstico de cumplimiento de protección de datos en Colombia',
    type: 'website',
    locale: 'es_CO',
  },
};

export default function DiagnosticoPage() {
  return <DiagnosticoWizard />;
}
