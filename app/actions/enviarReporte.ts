'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarReporteEmail(
  pdfBufferBase64: string,
  nombreEmpresa: string,
  emailEvaluador: string
) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: { message: 'La función de envío por correo no está configurada (Falta RESEND_API_KEY).' } };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Datacheck AI <onboarding@resend.dev>', // Usando el dominio de prueba de Resend
      to: ['datacheck26@gmail.com', emailEvaluador], // Envía al admin (datacheck26) y al evaluador
      subject: `Nuevo Reporte de Diagnóstico Ley 1581 - ${nombreEmpresa}`,
      html: `
        <h2>Diagnóstico Completado: ${nombreEmpresa}</h2>
        <p>Se ha generado un nuevo reporte de cumplimiento de la Ley 1581.</p>
        <p>Adjunto a este correo encontrará el informe detallado en formato PDF.</p>
        <br/>
        <p>Atentamente,</p>
        <p><strong>Datacheck AI</strong></p>
      `,
      attachments: [
        {
          filename: `Reporte_${nombreEmpresa.replace(/\s+/g, '_')}.pdf`,
          content: pdfBufferBase64,
        },
      ],
    });

    if (error) {
      console.error('Error enviando correo Resend:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Excepción enviando correo:', err);
    return { success: false, error: err };
  }
}
