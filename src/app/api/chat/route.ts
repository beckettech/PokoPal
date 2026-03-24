import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const MODEL = "openai/gpt-4o-mini"; // Cheap and fast

// Dexter's system prompt
const SYSTEM_PROMPT = `You are Dexter, a friendly but neutral Pokédex assistant for the game Pokémon Pokopia. You help trainers with:

- Finding where to catch specific Pokémon
- How to build habitats and what items they need
- Item locations and how to get them
- Game mechanics and tips

Guidelines:
- Be concise but helpful (1-3 sentences for simple questions, more for complex ones)
- When mentioning something the user can view in-app, use this format: [[Dex: Pikachu]] or [[Habitat: Mossy Hot Spring]] or [[Items: Honey]]
- If the user asks about something they haven't unlocked yet, gently mention it but still help if they insist
- Use the user's progress data to personalize answers
- Never mention LLMs, tokens, or AI - you're just Dexter the Pokédex assistant

Current data context will be provided with each query.`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context, userProgress } = await req.json();

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Build the context string
    const contextString = buildContext(context, userProgress);

    // Prepare messages for OpenRouter
    const apiMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `User's progress:\n${userProgress}\n\nRelevant data:\n${contextString}` },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    // Call OpenRouter (non-streaming for now to debug)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://pokopia-guide.vercel.app",
        "X-Title": "Pokopia Guide - Dexter Chat",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter error:", response.status, error);
      return NextResponse.json(
        { error: `OpenRouter error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in response:", data);
      return NextResponse.json({ error: "No response content" }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildContext(context: any, userProgress: string): string {
  // This will be populated with relevant JSON data based on the query
  // For now, return a summary
  let result = "";
  
  if (context.pokemon) {
    result += `Pokemon: ${JSON.stringify(context.pokemon)}\n`;
  }
  if (context.habitat) {
    result += `Habitat: ${JSON.stringify(context.habitat)}\n`;
  }
  if (context.items) {
    result += `Items: ${JSON.stringify(context.items.slice(0, 5))}...\n`;
  }
  
  return result || "No specific data loaded for this query.";
}
