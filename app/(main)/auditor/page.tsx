'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AuditorDashboardPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id, nombre, nit, sector,
          diagnosticos(score_total, nivel_riesgo, created_at)
        `);
      
      if (!error && data) {
        setEmpresas(data);
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex justify-center items-center h-64">
        <span className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Cálculos agregados
  const totalEmpresas = empresas.length;
  let sumaPromedios = 0;
  let empresasEnRiesgo = 0;

  empresas.forEach(emp => {
    const diags = emp.diagnosticos || [];
    if (diags.length > 0) {
      const ultimoDiag = diags.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      
      sumaPromedios += ultimoDiag.score_total;
      
      if (ultimoDiag.nivel_riesgo === 'riesgo_alto' || ultimoDiag.nivel_riesgo === 'riesgo_medio') {
        empresasEnRiesgo++;
      }
    }
  });

  const promedioGlobal = totalEmpresas > 0 ? Math.round(sumaPromedios / totalEmpresas) : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-slide-up">
      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-[#64748B] font-mono uppercase tracking-widest mb-1">
          Módulo de Auditoría
        </p>
        <h1 className="text-2xl font-black text-[#0F172A]">
          Revisión de Cumplimiento Ley 1581
        </h1>
        <p className="text-sm text-[#64748B]">
          Vista de solo lectura para el análisis legal, validación de cumplimiento y brechas de las empresas.
        </p>
      </div>

      {/* ── Métricas Globales ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col items-center shadow-sm">
          <span className="text-3xl mb-2">🏢</span>
          <span className="text-2xl font-black text-[#0F172A]">{totalEmpresas}</span>
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mt-1">Empresas Auditadas</span>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col items-center shadow-sm">
          <span className="text-3xl mb-2">📊</span>
          <span className="text-2xl font-black text-[#2563EB]">{promedioGlobal}%</span>
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mt-1">Nivel General</span>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#FECACA] bg-[#FEE2E2] p-5 flex flex-col items-center shadow-sm">
          <span className="text-3xl mb-2">⚠️</span>
          <span className="text-2xl font-black text-[#EF4444]">{empresasEnRiesgo}</span>
          <span className="text-xs font-semibold text-[#EF4444] uppercase tracking-wide mt-1">Alertas de Brecha</span>
        </div>
      </div>

      {/* ── Tabla de Evaluaciones ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Histórico de Evaluaciones</h2>
        </div>
        
        {empresas.length === 0 ? (
          <div className="p-8 text-center text-[#64748B] text-sm">
            No hay empresas evaluadas para auditar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3">Empresa Auditada</th>
                  <th className="px-5 py-3">Sector</th>
                  <th className="px-5 py-3 text-center">Score de Cumplimiento</th>
                  <th className="px-5 py-3 text-right">Diagnóstico (Nivel de Riesgo)</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((emp, i) => {
                  const diags = emp.diagnosticos || [];
                  const ultimoDiag = diags.sort((a: any, b: any) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  )[0];
                  
                  return (
                    <tr key={emp.id} className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-sm text-[#0F172A]">{emp.nombre}</p>
                        <p className="text-[10px] text-[#64748B] font-mono mt-0.5">NIT: {emp.nit}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-[#64748B]">{emp.sector}</td>
                      <td className="px-5 py-4 text-center">
                        {ultimoDiag ? (
                          <span className="text-sm font-bold text-[#0F172A]">{ultimoDiag.score_total}%</span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">Sin evaluar</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {ultimoDiag ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ultimoDiag.nivel_riesgo === 'riesgo_alto' ? 'bg-[#FEE2E2] text-[#EF4444]' :
                            ultimoDiag.nivel_riesgo === 'riesgo_medio' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                            ultimoDiag.nivel_riesgo === 'aceptable' ? 'bg-[#D1FAE5] text-[#059669]' :
                            'bg-[#DCFCE7] text-[#16A34A]'
                          }`}>
                            {ultimoDiag.nivel_riesgo.replace('_', ' ').toUpperCase()}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
