'use client';

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { enviarReporteEmail } from '../../actions/enviarReporte';

interface PDFReportProps {
  empresaNombre: string;
  scoreTotal: number;
  nivelRiesgo: string;
  fecha: string;
  resultadosPorBloque: any[];
  recomendaciones: string[];
  planAccion?: any[];
  emailEvaluador: string;
}

export default function PDFReportGenerator({
  empresaNombre,
  scoreTotal,
  nivelRiesgo,
  fecha,
  resultadosPorBloque,
  recomendaciones,
  planAccion,
  emailEvaluador,
}: PDFReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [generando, setGenerando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const generatePDFBase64 = async () => {
    if (!reportRef.current) return null;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    return pdf.output('datauristring').split(',')[1]; // Return only base64 data
  };

  const handleDownloadPDF = async () => {
    setGenerando(true);
    setStatusMsg('Generando PDF...');
    try {
      if (!reportRef.current) return;
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate standard A4 size
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Reporte_Ley_1581_${empresaNombre.replace(/\s+/g, '_')}.pdf`);
      setStatusMsg('¡PDF descargado!');
    } catch (err) {
      console.error(err);
      setStatusMsg('Error al generar PDF');
    } finally {
      setGenerando(false);
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  const handleSendEmail = async () => {
    setEnviando(true);
    setStatusMsg('Preparando correo...');
    try {
      const base64 = await generatePDFBase64();
      if (!base64) throw new Error('No se pudo generar el PDF');
      
      setStatusMsg('Enviando...');
      const res = await enviarReporteEmail(base64, empresaNombre, emailEvaluador);
      if (res.success) {
        setStatusMsg('¡Correo enviado exitosamente!');
      } else {
        setStatusMsg(res.error?.message || 'Error enviando el correo.');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Error en el proceso de envío.');
    } finally {
      setEnviando(false);
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  const colorRiesgo = nivelRiesgo === 'critico' ? '#EF4444' : nivelRiesgo === 'en_proceso' ? '#F59E0B' : '#16A34A';

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleDownloadPDF}
          disabled={generando || enviando}
          className="btn-primary py-2 px-4 text-sm font-semibold flex items-center gap-2"
        >
          {generando ? 'Cargando...' : '📄 Descargar Reporte PDF'}
        </button>
        <button
          onClick={handleSendEmail}
          disabled={generando || enviando}
          className="py-2 px-4 text-sm font-semibold flex items-center gap-2 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
        >
          {enviando ? 'Enviando...' : '✉️ Enviar por Correo'}
        </button>
        {statusMsg && <span className="text-sm font-medium text-[#2563EB] self-center">{statusMsg}</span>}
      </div>

      {/* ── CONTENEDOR OCULTO PARA EL REPORTE PDF ── */}
      <div className="overflow-hidden h-0 w-0">
        <div ref={reportRef} className="bg-white p-10 text-[#0F172A]" style={{ width: '800px' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-black text-[#041C4A]">DataCheck AI</h1>
              <p className="text-sm text-[#64748B]">Auditoría Ley 1581 de Protección de Datos</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{empresaNombre}</p>
              <p className="text-xs text-[#64748B]">Fecha: {new Date(fecha).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Resumen Ejecutivo */}
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Resumen Ejecutivo</h2>
            <div className="flex items-center gap-8 bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0]">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Nivel de Cumplimiento</p>
                <p className="text-4xl font-black" style={{ color: colorRiesgo }}>{scoreTotal}%</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Estado de Riesgo</p>
                <p className="text-xl font-bold uppercase tracking-wider" style={{ color: colorRiesgo }}>
                  {nivelRiesgo.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Detalles por Bloque */}
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Detalle por Categoría</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F1F5F9] border-y border-[#E2E8F0]">
                  <th className="py-2 px-4 text-sm font-semibold">Módulo</th>
                  <th className="py-2 px-4 text-sm font-semibold">Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {resultadosPorBloque.map((b: any, i: number) => (
                  <tr key={i} className="border-b border-[#E2E8F0]">
                    <td className="py-3 px-4 text-sm">{b.bloqueTitulo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-48 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563EB]" style={{ width: `${b.porcentaje}%` }} />
                        </div>
                        <span className="text-xs font-bold">{b.porcentaje}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plan de Acción Automático (IA) */}
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Plan de Acción Sugerido (IA)</h2>
            {planAccion && planAccion.length > 0 ? (
              <ul className="space-y-3">
                {planAccion.map((act: any, i: number) => (
                  <li key={i} className="bg-white p-4 rounded-lg border border-[#E2E8F0]">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-[#0F172A]">{act.actividad}</span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${act.prioridad === 'Alta' ? 'bg-[#FEE2E2] text-[#EF4444]' : act.prioridad === 'Media' ? 'bg-[#FEF3C7] text-[#F59E0B]' : 'bg-[#DCFCE7] text-[#16A34A]'}`}>
                        Prioridad {act.prioridad}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B]">{act.descripcion}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 list-disc list-inside text-sm text-[#475569]">
                {recomendaciones.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-[#94A3B8] border-t pt-4">
            Generado automáticamente por DataCheck AI.<br/>
            Este documento no constituye asesoría legal vinculante.
          </div>
        </div>
      </div>
    </div>
  );
}
