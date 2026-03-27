import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const MODEL = "openai/gpt-4o-mini";

// Load data files at startup
let pokemonData: any[] = [];
let habitatData: any[] = [];
let itemData: any[] = [];

try {
  const pokemonPath = path.join(process.cwd(), "public", "pokemon.json");
  const habitatPath = path.join(process.cwd(), "public", "habitats.json");
  const itemsPath = path.join(process.cwd(), "public", "items.json");
  
  if (fs.existsSync(pokemonPath)) {
    pokemonData = JSON.parse(fs.readFileSync(pokemonPath, "utf-8"));
  }
  if (fs.existsSync(habitatPath)) {
    habitatData = JSON.parse(fs.readFileSync(habitatPath, "utf-8"));
  }
  if (fs.existsSync(itemsPath)) {
    const itemsJson = JSON.parse(fs.readFileSync(itemsPath, "utf-8"));
    itemData = itemsJson.flatMap((cat: any) => cat.items || []);
  }
} catch (e) {
  console.error("Failed to load data files:", e);
}

// Dexter's system prompt
const SYSTEM_PROMPT = `You are Dexter, a friendly but neutral Pokédex assistant for the game Pokémon Pokopia. You help trainers with:

- Finding where to catch specific Pokémon
- How to build habitats and what items they need
- Item locations and how to get them
- Game mechanics and tips

Guidelines:
- Be concise but helpful (1-3 sentences for simple questions, more for complex ones)
- When mentioning something the user can view in-app, use this format: [[Dex: Pikachu]] or [[Habitat: Mossy Hot Spring]] or [[Items: Honey]]
- Use the provided data to give accurate, specific answers
- Never mention LLMs, tokens, or AI - you're just Dexter the Pokédex assistant
- If you don't know something from the data, say so honestly`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userProgress } = await req.json();

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Get the last user message to search for relevant context
    const lastUserMessage = [...messages].reverse().find((m: ChatMessage) => m.role === "user")?.content || "";
    
    // Build context based on the query
    const contextString = buildContext(lastUserMessage);

    // Prepare messages for OpenRouter
    const apiMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `User's progress: ${userProgress}\n\n${contextString}` },
      ...messages.slice(-10),
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://pokopal.com",
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

function buildContext(query: string): string {
  const q = query.toLowerCase();
  const parts: string[] = [];
  
  // Search for relevant Pokemon
  if (pokemonData.length > 0) {
    const relevantPokemon = pokemonData.filter((p: any) => {
      const name = (p.name || "").toLowerCase();
      const locations = (p.locations || []).join(" ").toLowerCase();
      const obtainMethod = (p.obtainMethod || "").toLowerCase();
      return q.includes(name) || name.includes(q.split(" ")[0]) || 
             (q.includes("where") && locations.length > 0 && q.split(" ").some(w => locations.includes(w))) ||
             obtainMethod.includes(q);
    }).slice(0, 3);
    
    if (relevantPokemon.length > 0) {
      parts.push(`Relevant Pokemon:\n${JSON.stringify(relevantPokemon, null, 2)}`);
    }
    
    // If asking "where is X" or "how to get X", search for that Pokemon
    const whereMatch = q.match(/where (?:can i find |is |are )?(?:a )?(\w+)/);
    const howToMatch = q.match(/how (?:do i |to )?(?:get |find |obtain |catch )?(?:a )?(\w+)/);
    const legendaryMatch = q.match(/(?:articuno|zapdos|moltres|mewtwo|mew|lugia|ho-?oh|raikou|entei|suicune)/);
    
    if (whereMatch || howToMatch || legendaryMatch) {
      const searchName = (whereMatch?.[1] || howToMatch?.[1] || legendaryMatch?.[0] || "").toLowerCase();
      const found = pokemonData.find((p: any) => 
        (p.name || "").toLowerCase().includes(searchName) ||
        (p.obtainMethod || "").toLowerCase().includes(searchName)
      );
      if (found && !relevantPokemon.includes(found)) {
        parts.push(`Pokemon "${found.name}":\n${JSON.stringify(found, null, 2)}`);
      }
    }
    
    // Special handling for legendary queries
    if (q.includes("legendary") || q.includes("how to get") || q.includes("how do i get")) {
      const legendaries = pokemonData.filter((p: any) => p.rarity === "Legendary");
      parts.push(`All Legendary Pokemon:\n${JSON.stringify(legendaries.map((p: any) => ({
        name: p.name,
        obtainMethod: p.obtainMethod,
        habitatBuilt: p.habitatBuilt
      })), null, 2)}`);
    }
  }
  
  // Search for relevant Habitats
  if (habitatData.length > 0) {
    const relevantHabitats = habitatData.filter((h: any) => {
      const name = (h.name || "").toLowerCase();
      const pokemon = (h.pokemon || []).join(" ").toLowerCase();
      return q.includes(name) || name.includes(q.split(" ")[0]) ||
             (q.includes("habitat") && pokemon.length > 0) ||
             (q.includes("build") && name.length > 0);
    }).slice(0, 2);
    
    if (relevantHabitats.length > 0) {
      parts.push(`Relevant Habitats:\n${JSON.stringify(relevantHabitats, null, 2)}`);
    }
  }
  
  // Search for relevant Items
  if (itemData.length > 0) {
    const relevantItems = itemData.filter((item: any) => {
      const name = (item.name || item.slug || "").toLowerCase();
      const source = (item.source || "").toLowerCase();
      return q.includes(name) || name.includes(q.split(" ")[0]) ||
             (q.includes("how to get") && source.length > 0);
    }).slice(0, 5);
    
    if (relevantItems.length > 0) {
      parts.push(`Relevant Items:\n${JSON.stringify(relevantItems, null, 2)}`);
    }
    
    // Search for feathers specifically
    if (q.includes("feather")) {
      const feathers = itemData.filter((item: any) => 
        (item.name || "").toLowerCase().includes("feather")
      );
      if (feathers.length > 0) {
        parts.push(`Feathers:\n${JSON.stringify(feathers, null, 2)}`);
      }
    }
  }
  
  if (parts.length === 0) {
    // Return a sample of data for general queries
    return `Available data summary:\n- ${pokemonData.length} Pokemon in database\n- ${habitatData.length} Habitats\n- ${itemData.length} Items\n\nAsk about specific Pokemon, habitats, or items for detailed info.`;
  }
  
  return parts.join("\n\n");
}
