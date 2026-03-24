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

    // Call OpenRouter with streaming
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
        stream: true,
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

    // Stream the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

            for (const line of lines) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
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
