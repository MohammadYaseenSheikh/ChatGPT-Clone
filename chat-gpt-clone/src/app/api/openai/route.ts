import { NextResponse } from 'next/server'; // Correct import for Next.js route handlers
import OpenAI from 'openai'; // Import the default export

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Ensure this is set in your environment variables
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use the desired model
      messages: [{ role: 'user', content: query }], // Updated to use the chat API
      max_tokens: 100, // Adjust token limit as needed
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function askAI(query: string) {
  try {
    const response = await fetch('/api/openai/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data); // Debugging
    return data.response || "No response from AI"; // Fallback if response is missing
  } catch (error) {
    console.error('Failed to fetch AI response:', error);
    return 'Error fetching AI response';
  }
}