import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Datacheck AI — Cumplimiento Ley 1581',
    template: '%s | Datacheck AI',
  },
  description:
    'Plataforma SaaS de autodiagnóstico de cumplimiento de la Ley 1581 de 2012 (Protección de Datos Personales en Colombia). Diseñada con enfoque Privacy by Design.',
  keywords: ['protección de datos', 'Ley 1581', 'Colombia', 'cumplimiento legal', 'SaaS', 'privacidad'],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  themeColor: '#041C4A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F8FAFC] text-[#0F172A]">{children}</body>
    </html>
  );
}
