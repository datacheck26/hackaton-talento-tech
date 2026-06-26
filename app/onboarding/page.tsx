'use client';

// ============================================================
// /onboarding — Captura de datos de empresa antes del diagnóstico
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmpresa } from '../../lib/empresa/useEmpresa';
import { SECTORES, TAMANOS } from '../../lib/empresa/types';
import type { SectorEmpresa, TamanoEmpresa } from '../../lib/empresa/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { guardarEmpresa } = useEmpresa();

  const [nombre,  setNombre]  = useState('');
  const [nit,     setNit]     = useState('');
  const [sector,  setSector]  = useState<SectorEmpresa | ''>('');
  const [tamano,  setTamano]  = useState<TamanoEmpresa | ''>('');
  const [touched, setTouched] = useState({ nombre: false, nit: false, sector: false });
  const [loading, setLoading] = useState(false);

  const nitLimpio    = nit.replace(/\D/g, '');
  const nombreValido = nombre.trim().length >= 2;
  const nitValido    = nitLimpio.length >= 8;
  const sectorValido = sector !== '';
  const tamanoValido = tamano !== '';

  const handleNit = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;
    if (digits.length > 9) {
      formatted = `${digits.slice(0, 9)}-${digits.slice(9)}`;
    }
    setNit(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, nit: true, sector: true });
    if (!nombreValido || !nitValido || !sectorValido || !tamanoValido) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Simula guardado
    await guardarEmpresa({
      nombre: nombre.trim(),
      nit,
      sector: sector as SectorEmpresa,
      tamano: tamano as TamanoEmpresa,
      fechaRegistro: new Date().toISOString(),
    });
    router.push('/diagnostico');
  };

  const progreso = [nombre, nit, sector, tamano].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black shadow-sm"
            style={{ background: 'linear-gradient(135deg, #041C4A, #0A2E73)' }}
          >
            D
          </div>
          <div>
            <span className="text-[#0F172A] text-sm font-black">Datacheck</span>
            <span className="text-[#2563EB] text-sm font-black"> AI</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <span className="font-mono bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-1 rounded">
            Paso 1 de 2
          </span>
        </div>
      </header>

      {/* ── Contenido ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg animate-fade-slide-up">

          {/* Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl"
              style={{ background: 'linear-gradient(135deg, #041C4A, #0A2E73)' }}>
              🏢
            </div>
            <h1 className="text-2xl font-black text-[#0F172A]">Cuéntanos sobre tu empresa</h1>
            <p className="mt-2 text-sm text-[#64748B]">
              Esta información personaliza tu diagnóstico de cumplimiento de la Ley 1581
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
              <span>Información completada</span>
              <span className="font-semibold text-[#0F172A]">{progreso} / 4</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(progreso / 4) * 100}%`,
                  background: 'linear-gradient(90deg, #2563EB, #3B82F6)',
                }}
              />
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Card formulario */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4 shadow-sm">

              {/* Nombre */}
              <div className="space-y-1.5">
                <label htmlFor="empresa-nombre" className="block text-sm font-semibold text-[#0F172A]">
                  Nombre de la empresa <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  id="empresa-nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                  placeholder="Ejemplo: TechColombia S.A.S."
                  className={`input-base w-full px-4 py-3 text-sm ${
                    touched.nombre && !nombreValido ? 'border-[#EF4444]' : nombre ? 'border-[#16A34A]' : ''
                  }`}
                />
                {touched.nombre && !nombreValido && (
                  <p className="text-xs text-[#EF4444]">Ingrese el nombre de la empresa</p>
                )}
              </div>

              {/* NIT */}
              <div className="space-y-1.5">
                <label htmlFor="empresa-nit" className="block text-sm font-semibold text-[#0F172A]">
                  NIT <span className="text-[#EF4444]">*</span>
                  <span className="ml-1.5 text-xs font-normal text-[#64748B]">(sin dígito de verificación)</span>
                </label>
                <input
                  id="empresa-nit"
                  type="text"
                  inputMode="numeric"
                  value={nit}
                  onChange={(e) => handleNit(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, nit: true }))}
                  placeholder="900.123.456-7"
                  className={`input-base w-full px-4 py-3 text-sm font-mono ${
                    touched.nit && !nitValido ? 'border-[#EF4444]' : nit.length >= 8 ? 'border-[#16A34A]' : ''
                  }`}
                />
                {touched.nit && !nitValido && (
                  <p className="text-xs text-[#EF4444]">El NIT debe tener al menos 8 dígitos</p>
                )}
              </div>

              {/* Sector */}
              <div className="space-y-1.5">
                <label htmlFor="empresa-sector" className="block text-sm font-semibold text-[#0F172A]">
                  Sector industrial <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  id="empresa-sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value as SectorEmpresa)}
                  onBlur={() => setTouched((t) => ({ ...t, sector: true }))}
                  className={`input-base w-full px-4 py-3 text-sm ${
                    touched.sector && !sectorValido ? 'border-[#EF4444]' : sector ? 'border-[#16A34A]' : ''
                  }`}
                >
                  <option value="" disabled>Selecciona el sector</option>
                  {SECTORES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {touched.sector && !sectorValido && (
                  <p className="text-xs text-[#EF4444]">Seleccione el sector de su empresa</p>
                )}
              </div>

              {/* Tamaño */}
              <div className="space-y-1.5">
                <label htmlFor="empresa-tamano" className="block text-sm font-semibold text-[#0F172A]">
                  Tamaño de la empresa <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  id="empresa-tamano"
                  value={tamano}
                  onChange={(e) => setTamano(e.target.value as TamanoEmpresa)}
                  className={`input-base w-full px-4 py-3 text-sm ${
                    tamano ? 'border-[#16A34A]' : ''
                  }`}
                >
                  <option value="" disabled>Selecciona el tamaño</option>
                  {TAMANOS.map(({ value, label, descripcion }) => (
                    <option key={value} value={value}>{label} ({descripcion})</option>
                  ))}
                </select>
              </div>

              {/* Botón */}
              <div className="pt-2">
                <button
                  id="btn-iniciar-diagnostico"
                  type="submit"
                  disabled={loading || progreso < 4}
                  className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando información...
                    </>
                  ) : (
                    <>
                      Iniciar Diagnóstico →
                    </>
                  )}
                </button>
              </div>

            </div>

            <p className="text-center text-xs text-[#64748B]">
              🔒 Tu información se almacena de forma segura y no se comparte con terceros.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
