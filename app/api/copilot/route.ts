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
1. Responde de manera concisa (máximo 150-200 palabras).
2. Enfócate estrictamente en el contexto de la Ley 1581 colombiana y cómo se aplica al sector/tamaño de la empresa si es relevante.
3. Brinda 1 o 2 recomendaciones prácticas concretas que la empresa pueda realizar (ej: redactar un clausulado, cifrar una base de datos, estructurar políticas, etc.).
4. Usa Markdown para dar formato al texto (negritas, listas cortas).
5. No repitas el disclaimer legal largo al final, mantén la respuesta directa y útil.`;

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
