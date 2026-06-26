import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { AI_SYSTEM_PROMPT } from '../../../lib/ai/knowledgeBase';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: AI_SYSTEM_PROMPT,
      messages,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error en Chat API:', error);
    return new Response(JSON.stringify({ error: 'Error procesando la solicitud de IA' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
