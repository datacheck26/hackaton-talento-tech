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

    </form>
  );
}
