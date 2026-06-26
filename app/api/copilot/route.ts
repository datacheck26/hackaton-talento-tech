import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pregunta, mensajeUsuario, empresa } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key de OpenAI no configurada en el servidor.' },
        { status: 500 }
      );
    }

    const systemPrompt = `Eres un asesor legal de Inteligencia Artificial experto en la Ley 1581 de 2012 de Protección de Datos Personales en Colombia y en los principios de Privacidad por Diseño (Privacy by Design).
Tu objetivo es responder de forma profesional, práctica, y con lenguaje empresarial claro.

Información sobre la pregunta actual del cuestionario:
- ID: ${pregunta?.id || 'N/A'}
- Pregunta: ${pregunta?.texto || 'N/A'}
- Marco Legal: ${pregunta?.articuloLegal || 'N/A'}
- Cita Legal: ${pregunta?.textoLegal || 'N/A'}

Información de la empresa que consulta:
- Nombre: ${empresa?.nombre || 'Mi Organización'}
- Sector: ${empresa?.sector || 'No especificado'}
- Tamaño: ${empresa?.tamano || 'No especificado'} empleados

Instrucciones para la respuesta:
1. Responde de manera extremadamente concisa, directa y al grano (máximo 50-70 palabras, unas 2 o 3 oraciones).
2. NO incluyas introducciones largas, saludos, preámbulos ni disclaimers repetitivos. Ve directo al consejo práctico.
3. Brinda 1 recomendación práctica concreta aplicable al sector de la empresa.
4. Usa Markdown básico (negrita en palabras clave).`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: mensajeUsuario }
        ],
        temperature: 0.5,
        max_tokens: 450,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI API Error:', errText);
      return NextResponse.json({ error: 'Error al comunicarse con la API de OpenAI.' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'No se pudo generar una respuesta.';

    return NextResponse.json({ respuesta: reply });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
