// ============================================================
// Root Page — Landing / Redirect to /diagnostico
// ============================================================

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/diagnostico');
}
