'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminDashboardPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'crm'>('general');

  useEffect(() => {
    async function loadStats() {
      // En un caso real, esto requeriría rol de administrador
      // Por MVP y demostración, cargamos las empresas (depende de RLS)
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

  const handleDeleteEmpresa = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente la empresa "${nombre}" y todos sus diagnósticos?`)) {
      return;
    }

    try {
      // Eliminamos registros relacionados primero por si no hay CASCADE en DB
      await supabase.from('diagnosticos').delete().eq('empresa_id', id);
      await supabase.from('user_empresas').delete().eq('empresa_id', id);
      
      // Eliminamos la empresa
      const { error } = await supabase.from('empresas').delete().eq('id', id);
      
      if (error) {
        alert('Error al eliminar la empresa: ' + error.message);
        return;
      }
      
      // Actualizamos la UI localmente
      setEmpresas(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error inesperado al eliminar la empresa.');
    }
  };

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
      // Tomamos el score del último diagnóstico (asumiendo que vienen ordenados, o usamos max/avg)
      const ultimoDiag = diags.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
      
      sumaPromedios += ultimoDiag.score_total;
      
      if (ultimoDiag.nivel_riesgo === 'critico') {
        empresasEnRiesgo++;
      }
    }
  });

  const promedioGlobal = totalEmpresas > 0 ? Math.round(sumaPromedios / totalEmpresas) : 0;

  // Cálculos para CRM
  const oportunidades = empresas.map(emp => {
    const diags = emp.diagnosticos || [];
    const ultimoDiag = diags.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const riesgo = ultimoDiag ? ultimoDiag.nivel_riesgo : 'sin_evaluar';
    
    // Algoritmo de Lead Scoring Simplificado
    let score = 0;
    
    // 1. Tamaño empresa (más grande = más presupuesto)
    if (emp.tamano === '+200') score += 50;
    else if (emp.tamano === '51-200') score += 30;
    else if (emp.tamano === '11-50') score += 10;
    
    // 2. Nivel de Riesgo Legal (más riesgo = más urgencia de compra)
    if (riesgo === 'critico') score += 50;
    else if (riesgo === 'en_proceso') score += 20;
    
    // 3. Sector (Sectores regulados suman más)
    const sectoresCriticos = ['Salud', 'Financiero', 'Tecnología', 'Educación'];
    if (sectoresCriticos.includes(emp.sector)) score += 20;

    let prioridad = 'Baja (Cold)';
    let color = 'bg-[#F1F5F9] text-[#64748B]';
    
    if (score >= 80) {
      prioridad = 'Alta (Hot Lead)';
      color = 'bg-[#FEE2E2] text-[#EF4444] border-[#FECACA] border';
    } else if (score >= 40) {
      prioridad = 'Media (Warm)';
      color = 'bg-[#FEF3C7] text-[#F59E0B] border-[#FDE68A] border';
    }

    return { ...emp, leadScore: score, prioridad, color, riesgo };
  }).sort((a, b) => b.leadScore - a.leadScore);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-slide-up">
      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-[#64748B] font-mono uppercase tracking-widest mb-1">
          Control Central
        </p>
        <h1 className="text-2xl font-black text-[#0F172A]">
          Panel Ejecutivo (Super Admin)
        </h1>
        <p className="text-sm text-[#64748B]">
          Vista gerencial y benchmarking de cumplimiento de la Ley 1581 en las empresas registradas.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-[#E2E8F0] pb-px">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'general' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Visión General
        </button>
        <button
          onClick={() => setActiveTab('crm')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'crm' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          CRM & Oportunidades
          <span className="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.5 rounded-full">Pro</span>
        </button>
      </div>

      {activeTab === 'general' ? (
        <>
          {/* ── Métricas Globales ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col items-center shadow-sm">
          <span className="text-3xl mb-2">🏢</span>
          <span className="text-2xl font-black text-[#0F172A]">{totalEmpresas}</span>
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mt-1">Empresas Evaluadas</span>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col items-center shadow-sm">
          <span className="text-3xl mb-2">📊</span>
          <span className="text-2xl font-black text-[#2563EB]">{promedioGlobal}%</span>
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mt-1">Promedio General</span>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#FECACA] bg-[#FEE2E2] p-5 flex flex-col items-center shadow-sm">
          <span className="text-3xl mb-2">🚨</span>
          <span className="text-2xl font-black text-[#EF4444]">{empresasEnRiesgo}</span>
          <span className="text-xs font-semibold text-[#EF4444] uppercase tracking-wide mt-1">Empresas Críticas</span>
        </div>
      </div>

      {/* ── Tabla de Ranking / Empresas ── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Directorio de Empresas</h2>
        </div>
        
        {empresas.length === 0 ? (
          <div className="p-8 text-center text-[#64748B] text-sm">
            No hay empresas registradas aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="px-5 py-3">Empresa</th>
                  <th className="px-5 py-3">Sector</th>
                  <th className="px-5 py-3">Diagnósticos</th>
                  <th className="px-5 py-3">Último Score</th>
                  <th className="px-5 py-3 text-right">Riesgo</th>
                  <th className="px-5 py-3 text-center">Acción</th>
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
                      <td className="px-5 py-4 text-xs font-medium text-[#0F172A]">{diags.length} eval.</td>
                      <td className="px-5 py-4">
                        {ultimoDiag ? (
                          <span className="text-sm font-bold text-[#0F172A]">{ultimoDiag.score_total}%</span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">Sin evaluar</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {ultimoDiag ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ultimoDiag.nivel_riesgo === 'critico' ? 'bg-[#FEE2E2] text-[#EF4444]' :
                            ultimoDiag.nivel_riesgo === 'conforme' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                            'bg-[#FEF3C7] text-[#F59E0B]'
                          }`}>
                            {ultimoDiag.nivel_riesgo.toUpperCase()}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleDeleteEmpresa(emp.id, emp.nombre)}
                          className="p-1.5 text-[#EF4444] hover:bg-[#FEE2E2] rounded transition-colors tooltip-trigger"
                          title="Eliminar empresa"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      ) : (
        /* ── CRM Lead Scoring ── */
        <div className="animate-fade-slide-up space-y-6">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-5 rounded-2xl flex items-start gap-4">
            <span className="text-2xl mt-1">🎯</span>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Motor de Lead Scoring (Ventas)</h3>
              <p className="text-xs text-[#64748B] mt-1">
                El sistema cruza automáticamente el <strong>nivel de riesgo legal</strong> con el <strong>tamaño de la empresa</strong> y su <strong>sector</strong> para priorizar a los prospectos con mayor urgencia y capacidad de compra de consultoría.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h2 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Oportunidades de Negocio</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="px-5 py-3">Prospecto</th>
                    <th className="px-5 py-3">Tamaño</th>
                    <th className="px-5 py-3">Urgencia Legal</th>
                    <th className="px-5 py-3 text-center">Score Comercial</th>
                    <th className="px-5 py-3 text-right">Prioridad de Cierre</th>
                  </tr>
                </thead>
                <tbody>
                  {oportunidades.map(op => (
                    <tr key={op.id} className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-sm text-[#0F172A]">{op.nombre}</p>
                        <p className="text-[10px] text-[#64748B] font-mono mt-0.5">{op.sector}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-[#64748B]">{op.tamano} emp.</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold ${op.riesgo === 'critico' ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
                          {op.riesgo.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-lg font-black text-[#0F172A]">{op.leadScore}</span>
                        <span className="text-[10px] text-[#94A3B8]">/120</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${op.color}`}>
                          {op.prioridad}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
