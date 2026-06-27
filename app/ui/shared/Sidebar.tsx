'use client';

// ============================================================
// Sidebar — Navegación lateral azul marino
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEmpresa } from '../../../lib/empresa/useEmpresa';

const NAV_ITEMS = [
  { href: '/dashboard',             icon: '🏠', label: 'Dashboard' },
  { href: '/diagnostico',           icon: '📋', label: 'Nuevo Diagnóstico' },
  { href: '/onboarding',            icon: '🏢', label: 'Mi Empresa' },
  { href: '/auditor',               icon: '🔎', label: 'Auditoría' },
  { href: '/admin',                 icon: '⚙️', label: 'Admin (Dev)' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { empresa } = useEmpresa();

  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #041C4A 0%, #0A2E73 100%)',
      }}
    >
      {/* ── Logo ── */}
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <span className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            🛡️ DataCheck<span className="text-[#60A5FA]">AI</span>
          </span>
        </Link>
      </div>

      {/* ── Empresa activa ── */}
      {empresa && (
        <div className="mx-4 mt-4 px-3 py-2.5 rounded-xl bg-white/8 border border-white/10">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-0.5">Empresa</p>
          <p className="text-xs font-bold text-white truncate">{empresa.nombre}</p>
          <p className="text-[10px] text-[#93C5FD] truncate">NIT: {empresa.nit}</p>
        </div>
      )}

      {/* ── Navegación ── */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          Menú principal
        </p>
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
              )}
            </Link>
          );
        })}

        <div className="pt-4 border-t border-white/10 mt-4 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            Recursos legales
          </p>
          <Link
            href="https://www.sic.gov.co/proteccion-de-datos-personales"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <span>⚖️</span>
            <span>SIC Colombia</span>
            <span className="ml-auto text-white/20 text-[10px]">↗</span>
          </Link>
          <Link
            href="https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=49981"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <span>📜</span>
            <span>Ley 1581 / 2012</span>
            <span className="ml-auto text-white/20 text-[10px]">↗</span>
          </Link>
        </div>
      </nav>

      {/* ── Footer del sidebar ── */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            {empresa?.nombre?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {empresa?.nombre ?? 'Mi Organización'}
            </p>
            <p className="text-white/40 text-[10px] truncate">Usuario activo</p>
          </div>
          <span className="text-white/20 group-hover:text-white/50 transition-colors text-xs">›</span>
        </div>
      </div>
    </aside>
  );
}
