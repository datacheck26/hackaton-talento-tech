'use client';

// ============================================================
// RegistroForm — Formulario de registro de nuevo usuario
// ============================================================

import { useState } from 'react';

interface RegistroFormProps {
  onSubmit: (nombre: string, email: string, password: string) => Promise<void>;
  onGoogle: () => Promise<void>;
  onMicrosoft?: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

function evaluarFortaleza(p: string): { nivel: number; label: string; color: string } {
  if (p.length === 0)  return { nivel: 0, label: '',         color: '#E2E8F0' };
  if (p.length < 6)   return { nivel: 1, label: 'Débil',    color: '#EF4444' };
  if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p))
    return { nivel: 2, label: 'Regular', color: '#F59E0B' };
  return { nivel: 3, label: 'Fuerte',  color: '#16A34A' };
}

export default function RegistroForm({ onSubmit, onGoogle, onMicrosoft, loading, error }: RegistroFormProps) {
  const [nombre,    setNombre]    = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [autoriza,  setAutoriza]  = useState(false);
  const [touched,   setTouched]   = useState({ nombre: false, email: false, password: false, confirm: false, autoriza: false });

  const emailValido     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValida  = password.length >= 6;
  const confirmaIgual   = password === confirm && confirm.length > 0;
  const nombreValido    = nombre.trim().length >= 2;
  const fortaleza       = evaluarFortaleza(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nombre: true, email: true, password: true, confirm: true, autoriza: true });
    if (!nombreValido || !emailValido || !passwordValida || !confirmaIgual || !autoriza) return;
    await onSubmit(nombre.trim(), email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="animate-scale-in flex items-start gap-3 px-4 py-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA]">
          <span className="text-[#EF4444] text-lg leading-none mt-0.5">⚠</span>
          <p className="text-sm text-[#EF4444] font-medium leading-snug">{error}</p>
        </div>
      )}

      {/* Nombre */}
      <div className="space-y-1.5">
        <label htmlFor="reg-nombre" className="block text-sm font-semibold text-[#0F172A]">
          Nombre completo
        </label>
        <input
          id="reg-nombre"
          type="text"
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
          placeholder="Juan Pérez"
          className={`input-base w-full px-4 py-3 text-sm ${
            touched.nombre && !nombreValido ? 'border-[#EF4444]' : ''
          }`}
        />
        {touched.nombre && !nombreValido && (
          <p className="text-xs text-[#EF4444]">Ingrese al menos 2 caracteres</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="reg-email" className="block text-sm font-semibold text-[#0F172A]">
          Correo electrónico
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="tucorreo@empresa.com"
          className={`input-base w-full px-4 py-3 text-sm ${
            touched.email && !emailValido ? 'border-[#EF4444]' : ''
          }`}
        />
        {touched.email && !emailValido && (
          <p className="text-xs text-[#EF4444]">Ingrese un correo electrónico válido</p>
        )}
      </div>

      {/* Contraseña */}
      <div className="space-y-1.5">
        <label htmlFor="reg-password" className="block text-sm font-semibold text-[#0F172A]">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPass ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="Mínimo 6 caracteres"
            className={`input-base w-full px-4 py-3 pr-12 text-sm ${
              touched.password && !passwordValida ? 'border-[#EF4444]' : ''
            }`}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors text-sm p-1"
          >
            {showPass ? '🙈' : '👁️'}
          </button>
        </div>
        {/* Indicador de fortaleza */}
        {password.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1 h-1">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: fortaleza.nivel >= n ? fortaleza.color : '#E2E8F0' }}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: fortaleza.nivel > 0 ? fortaleza.color : '#64748B' }}>
              {fortaleza.label && `Contraseña ${fortaleza.label.toLowerCase()}`}
            </p>
          </div>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-1.5">
        <label htmlFor="reg-confirm" className="block text-sm font-semibold text-[#0F172A]">
          Confirmar contraseña
        </label>
        <input
          id="reg-confirm"
          type={showPass ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          placeholder="Repite tu contraseña"
          className={`input-base w-full px-4 py-3 text-sm ${
            touched.confirm && !confirmaIgual ? 'border-[#EF4444]' : ''
          } ${touched.confirm && confirmaIgual ? 'border-[#16A34A]' : ''}`}
        />
        {touched.confirm && !confirmaIgual && (
          <p className="text-xs text-[#EF4444]">Las contraseñas no coinciden</p>
        )}
        {touched.confirm && confirmaIgual && (
          <p className="text-xs text-[#16A34A]">✓ Las contraseñas coinciden</p>
        )}
      </div>

      {/* Checkbox Políticas */}
      <div className="space-y-1.5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoriza}
            onChange={(e) => setAutoriza(e.target.checked)}
            className={`mt-1 w-4 h-4 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB] ${
              touched.autoriza && !autoriza ? 'border-[#EF4444]' : ''
            }`}
          />
          <span className="text-xs text-[#64748B] leading-relaxed">
            Autorizo de manera previa, expresa e informada a CAVALTEC S.A.S., como responsable de la plataforma DataCheck AI, para realizar el tratamiento de mis datos personales conforme a la{' '}
            <a href="/politicas" target="_blank" className="text-[#2563EB] hover:underline">Política de Tratamiento de Datos Personales</a>. Declaro haber leído y comprendido dicha política y conozco mis derechos como titular de la información.
          </span>
        </label>
        {touched.autoriza && !autoriza && (
          <p className="text-xs text-[#EF4444]">Debe aceptar las políticas para continuar</p>
        )}
      </div>

      {/* Botón */}
      <button
        id="btn-registro-email"
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta gratuita'
        )}
      </button>

      {/* Separador */}
      <div className="relative flex items-center justify-center mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2E8F0]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#64748B]">O registrarse con</span>
        </div>
      </div>

      {/* Botones Sociales */}
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onGoogle}
          disabled={loading}
          className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 text-sm font-semibold text-[#0F172A]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
      </div>

    </form>
  );
}
