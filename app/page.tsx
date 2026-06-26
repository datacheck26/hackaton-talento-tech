// ============================================================
// Root Page — Redirige al login (flujo de auth)
// ============================================================

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/login');
}
