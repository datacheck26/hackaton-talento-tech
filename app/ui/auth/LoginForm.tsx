'use client';

// ============================================================
// LoginForm — Formulario de inicio de sesión
// Diseño: modo claro, paleta CAVALTEC
// ============================================================

import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogle: () => Promise<void>;
  onMicrosoft?: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function LoginForm({ onSubmit, onGoogle, onMicrosoft, loading, error }: LoginFormProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched]   = useState({ email: false, password: false });

  const emailValido    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValida = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValido || !passwordValida) return;
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Error global */}
      {error && (
        <div className="animate-scale-in flex items-start gap-3 px-4 py-3 rounded-xl bg-[#FEE2E2] border border-[#FECACA]">
          <span className="text-[#EF4444] text-lg leading-none mt-0.5">⚠</span>
          <p className="text-sm text-[#EF4444] font-medium leading-snug">{error}</p>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="block text-sm font-semibold text-[#0F172A]">
          Correo electrónico
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="tucorreo@empresa.com"
          className={`input-base w-full px-4 py-3 text-sm ${
            touched.email && !emailValido
              ? 'border-[#EF4444] focus:border-[#EF4444]'
              : ''
          }`}
        />
        {touched.email && !emailValido && (
          <p className="text-xs text-[#EF4444]">Ingrese un correo electrónico válido</p>
        )}
      </div>

      {/* Contraseña */}
      <div className="space-y-1.5">
        <label htmlFor="login-password" className="block text-sm font-semibold text-[#0F172A]">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="••••••••"
            className={`input-base w-full px-4 py-3 pr-12 text-sm ${
              touched.password && !passwordValida
                ? 'border-[#EF4444] focus:border-[#EF4444]'
                : ''
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
        {touched.password && !passwordValida && (
          <p className="text-xs text-[#EF4444]">La contraseña debe tener al menos 6 caracteres</p>
        )}
      </div>

      {/* Olvidé mi contraseña */}
      <div className="text-right">
        <button
          type="button"
          className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Botón principal */}
      <button
        id="btn-login-email"
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Ingresando...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span className="text-xs text-[#64748B] font-medium">o continúa con</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      {/* Botones Sociales */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoogle}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors shadow-sm disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={onMicrosoft}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-xl text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] transition-colors shadow-sm disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 21 21">
            <path fill="#f25022" d="M0 0h10v10H0z"/>
            <path fill="#7fba00" d="M11 0h10v10H11z"/>
            <path fill="#00a4ef" d="M0 11h10v10H0z"/>
            <path fill="#ffb900" d="M11 11h10v10H11z"/>
          </svg>
          Microsoft
        </button>
      </div>
    </form>
  );
}
