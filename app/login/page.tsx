'use client';

// ============================================================
// /login — Página de inicio de sesión
// Layout: Split-screen | Branding izquierda | Formulario derecha
// ============================================================

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth/useAuth';
import LoginForm from '../ui/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, loading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const ok = await signInWithEmail(email, password);
    if (ok) router.push('/dashboard');
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
    // La redirección la maneja Supabase OAuth vía redirectTo
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Panel izquierdo — Branding ──────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #041C4A 0%, #0A2E73 60%, #1E40AF 100%)',
        }}
      >
        {/* Patrón de fondo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Esferas decorativas */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
        <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #60A5FA, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}>
              D
            </div>
            <div>
              <span className="text-white text-lg font-black tracking-tight">Datacheck</span>
              <span className="text-[#60A5FA] text-lg font-black tracking-tight"> AI</span>
            </div>
          </div>
          <p className="mt-2 text-[#93C5FD] text-xs font-mono tracking-widest uppercase">
            Cumplimiento Ley 1581 de 2012
          </p>
        </div>

        {/* Contenido central */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Conoce tu nivel de<br />
              <span className="text-[#60A5FA]">cumplimiento legal</span>
            </h1>
            <p className="mt-4 text-[#BFDBFE] text-base leading-relaxed max-w-md">
              Herramienta de autodiagnóstico basada en la Ley 1581 de 2012 con enfoque en
              <strong className="text-white"> Privacy by Design</strong>.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: '⚡', text: 'Diagnóstico en menos de 10 minutos' },
              { icon: '🔒', text: '11 preguntas clave con pesos legales reales' },
              { icon: '🤖', text: 'Copilot IA con asesoría por artículo' },
              { icon: '📄', text: 'Reporte descargable con plan de acción' },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}>
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base flex-shrink-0">
                  {icon}
                </span>
                <p className="text-[#BFDBFE] text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badge legal */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
            <span className="text-[#34D399] text-sm">⚖️</span>
            <span className="text-white/80 text-xs font-mono">SIC Colombia · CAVALTEC 2025</span>
          </div>
        </div>
      </div>

      {/* ── Panel derecho — Formulario ───────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 bg-[#F8FAFC]">
        {/* Logo mobile */}
        <div className="lg:hidden mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black shadow-lg"
            style={{ background: 'linear-gradient(135deg, #041C4A, #0A2E73)' }}>
            D
          </div>
          <div>
            <span className="text-[#0F172A] text-base font-black">Datacheck</span>
            <span className="text-[#2563EB] text-base font-black"> AI</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto animate-fade-slide-up">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#0F172A]">Bienvenido de nuevo</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Ingresa a tu cuenta para continuar con tu diagnóstico
            </p>
          </div>

          <LoginForm
            onSubmit={handleLogin}
            onGoogle={handleGoogle}
            loading={loading}
            error={error}
          />

          <p className="mt-6 text-center text-sm text-[#64748B]">
            ¿No tienes cuenta?{' '}
            <Link
              href="/registro"
              className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
