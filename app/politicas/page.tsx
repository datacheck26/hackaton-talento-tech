'use client';

import Link from 'next/link';

export default function PoliticasPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-[#0F172A]">
      <div className="mb-6">
        <Link href="/" onClick={(e) => { e.preventDefault(); window.history.back(); }} className="text-[#2563EB] hover:underline flex items-center gap-2 text-sm font-semibold">
          <span>←</span> Volver atrás
        </Link>
      </div>
      <h1 className="text-3xl font-black mb-8">Políticas y Privacidad de DataCheck AI</h1>

      <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
        <h2 className="text-xl font-bold mb-4 text-[#2563EB]">1. Política de Tratamiento de Datos Personales</h2>
        
        <h3 className="font-semibold mt-4 mb-2">Responsable del Tratamiento</h3>
        <p className="text-sm text-[#64748B] mb-2"><strong>CAVALTEC S.A.S.</strong><br/>Responsable de la plataforma DataCheck AI.</p>
        <ul className="list-disc list-inside text-sm text-[#64748B] mb-4">
          <li>Correo: privacidad@datacheckai.com</li>
          <li>Correo: habeasdata@datacheckai.com</li>
          <li>Sitio web: www.datacheckai.com</li>
        </ul>

        <h3 className="font-semibold mt-4 mb-2">Finalidades del Tratamiento</h3>
        <p className="text-sm text-[#64748B] mb-2">DataCheck AI recopila información con las siguientes finalidades:</p>
        <ul className="list-disc list-inside text-sm text-[#64748B] mb-4 space-y-1">
          <li><strong>Gestión de usuarios:</strong> Registro, autenticación mediante Google/Microsoft, administración de cuentas.</li>
          <li><strong>Prestación del servicio:</strong> Realización de autodiagnósticos, generación de resultados, reportes y planes de acción.</li>
          <li><strong>Seguridad:</strong> Control de accesos, auditoría, prevención de fraude, gestión de incidentes.</li>
          <li><strong>Comunicación:</strong> Envío de resultados, informes, recordatorios y soporte técnico.</li>
        </ul>

        <h3 className="font-semibold mt-4 mb-2">Derechos del Titular</h3>
        <p className="text-sm text-[#64748B]">
          Los titulares podrán: Conocer sus datos, Actualizarlos, Rectificarlos, Solicitar prueba de autorización, 
          Revocar autorización y Solicitar supresión.
        </p>
      </section>

      <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
        <h2 className="text-xl font-bold mb-4 text-[#2563EB]">2. Política de Privacidad</h2>
        <p className="text-sm text-[#64748B] mb-4">
          <strong>Compromiso:</strong> DataCheck AI implementa el principio de Privacidad desde el Diseño y Privacidad por Defecto. 
          La plataforma solo recopilará los datos estrictamente necesarios para registrar usuarios, gestionar diagnósticos y mantener la seguridad.
        </p>
        <h3 className="font-semibold mt-4 mb-2">Transferencia y Transmisión</h3>
        <p className="text-sm text-[#64748B] mb-2">
          Los datos podrán ser tratados mediante proveedores tecnológicos (Supabase, OpenAI API, Resend, Microsoft/Google OAuth), 
          quienes cuentan con mecanismos de protección adecuados.
        </p>
      </section>

      <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
        <h2 className="text-xl font-bold mb-4 text-[#2563EB]">3. Política de Derechos ARCO</h2>
        <ul className="list-disc list-inside text-sm text-[#64748B] mb-4">
          <li><strong>Consultas:</strong> 10 días hábiles (prórroga 5 días).</li>
          <li><strong>Reclamos (Actualización, corrección, eliminación):</strong> 15 días hábiles (prórroga 8 días).</li>
          <li><strong>Canal de Atención:</strong> habeasdata@datacheckai.com</li>
        </ul>
      </section>

      <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
        <h2 className="text-xl font-bold mb-4 text-[#2563EB]">4. Política de Seguridad de la Información</h2>
        <p className="text-sm text-[#64748B] mb-4">Objetivo: Garantizar Confidencialidad, Integridad y Disponibilidad.</p>
        <ul className="list-disc list-inside text-sm text-[#64748B] mb-4">
          <li><strong>Acceso:</strong> OAuth Google/Microsoft, Roles y permisos.</li>
          <li><strong>Protección:</strong> HTTPS, TLS, Row Level Security (RLS) y Separación multiempresa.</li>
          <li><strong>Monitoreo y Respaldo:</strong> Registro de accesos, auditoría, backups automáticos y recuperación ante desastres.</li>
        </ul>
      </section>

      <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
        <h2 className="text-xl font-bold mb-4 text-[#2563EB]">5. Política de Uso de Inteligencia Artificial</h2>
        <p className="text-sm text-[#64748B] mb-4">
          La IA se utiliza para explicar preguntas, generar recomendaciones e identificar brechas. <br/><br/>
          <strong>Restricciones:</strong> No sustituye asesoría jurídica ni emite conceptos vinculantes. <br/><br/>
          <strong>Protección de Datos:</strong> Antes de enviar información a motores de IA, se aplicarán mecanismos de 
          anonimización y minimización de datos (eliminando nombres, correos, teléfonos).
        </p>
      </section>
    </div>
  );
}
