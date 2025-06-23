import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: query }],
      max_tokens: 100,
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}