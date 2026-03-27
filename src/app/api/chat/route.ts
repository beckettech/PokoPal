import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const MODEL = "google/gemini-2.0-flash-001";

// Load data files at startup
let pokemonData: any[] = [];
let habitatData: any[] = [];
let itemData: any[] = [];
let locationData: any[] = [];
let recipeData: any[] = [];
let cookingRecipeData: any[] = [];

try {
  const basePath = path.join(process.cwd(), "public");
  const files: Record<string, string> = {
    pokemon: "pokemon.json",
    habitats: "habitats.json",
    items: "items.json",
    locations: "locations.json",
    recipes: "recipes.json",
    cookingRecipes: "cooking-recipes.json",
  };

  for (const [key, file] of Object.entries(files)) {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
      const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      if (key === "items") {
        itemData = raw.flatMap((cat: any) => cat.items || []);
      } else {
        switch (key) {
          case "pokemon": pokemonData = raw; break;
          case "habitats": habitatData = raw; break;
          case "locations": locationData = raw; break;
          case "recipes": recipeData = raw; break;
          case "cookingRecipes": cookingRecipeData = raw; break;
        }
      }
    }
  }
  console.log(`Loaded: ${pokemonData.length} pokemon, ${habitatData.length} habitats, ${itemData.length} items, ${locationData.length} locations, ${recipeData.length} recipes, ${cookingRecipeData.length} cooking recipes`);
} catch (e) {
  console.error("Failed to load data files:", e);
}

// Dexter's system prompt
const SYSTEM_PROMPT = `You are Dexter, a friendly Pokédex assistant for the game Pokémon Pokopia. You have access to comprehensive game data including:
- All 300+ Pokémon with their types, locations, habitats, obtain methods, and specialties
- All habitats with required items and Pokémon that appear in them
- All locations/areas and which Pokémon appear there
- All items with descriptions and how to obtain them
- All crafting and cooking recipes

Guidelines:
- Be concise but thorough (2-4 sentences for simple questions, more for complex ones)
- When mentioning something the user can view in-app, use this format: [[Dex: Pikachu]] or [[Habitat: Mossy Hot Spring]] or [[Items: Honey]]
- Use the provided data to give accurate, specific answers — if you have the data, use it
- For questions about building habitats, list the exact items needed
- For questions about finding Pokémon, mention the specific location and any requirements
- For questions about quests/story events, provide what you know from the data
- Never mention LLMs, tokens, or AI — you're just Dexter the Pokédex assistant
- If you truly don't have information about something, say so honestly rather than guessing`;

const STOP_WORDS = new Set([
  "how", "to", "at", "the", "a", "is", "do", "i", "can", "what", "where",
  "why", "for", "in", "of", "and", "or", "on", "with", "it", "its",
  "an", "are", "be", "this", "that", "from", "by", "my", "me", "you",
  "get", "find", "catch", "make", "build", "need", "have", "has", "was",
]);

function getQueryWords(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function textToSearchStr(obj: any): string {
  const parts: string[] = [];
  for (const val of Object.values(obj)) {
    if (typeof val === "string") parts.push(val);
    else if (Array.isArray(val)) parts.push(val.join(" "));
  }
  return parts.join(" ").toLowerCase();
}

function scoreEntry(entry: any, queryWords: string[]): number {
  const text = textToSearchStr(entry);
  return queryWords.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

function topMatches(data: any[], queryWords: string[], limit: number = 5): any[] {
  const scored = data.map(entry => ({ entry, score: scoreEntry(entry, queryWords) }));
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(s => s.entry);
}

function findLocationByName(query: string): any | undefined {
  const q = query.toLowerCase();
  return locationData.find((loc: any) => {
    const name = (loc.name || "").toLowerCase();
    return name.length > 3 && q.includes(name);
  });
}

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

    const lastUserMessage = [...messages].reverse().find((m: ChatMessage) => m.role === "user")?.content || "";
    const contextString = buildContext(lastUserMessage);

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
        max_tokens: 800,
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
  const queryWords = getQueryWords(query);
  if (queryWords.length === 0) {
    return `Available data: ${pokemonData.length} Pokemon, ${habitatData.length} habitats, ${itemData.length} items, ${locationData.length} locations, ${recipeData.length} recipes, ${cookingRecipeData.length} cooking recipes.`;
  }

  const parts: string[] = [];

  // Location name match
  const namedLocation = findLocationByName(query);
  if (namedLocation) {
    parts.push(`Location "${namedLocation.name}":\n${JSON.stringify(namedLocation, null, 2)}`);
  }

  // Pokemon matches
  const pokemonMatches = topMatches(pokemonData, queryWords, 5);
  if (pokemonMatches.length > 0) {
    parts.push(`Relevant Pokemon:\n${JSON.stringify(pokemonMatches, null, 2)}`);
  }

  // Habitat matches
  const habitatMatches = topMatches(habitatData, queryWords, 5);
  if (habitatMatches.length > 0) {
    parts.push(`Relevant Habitats:\n${JSON.stringify(habitatMatches, null, 2)}`);
  }

  // Item matches
  const itemMatches = topMatches(itemData, queryWords, 5);
  if (itemMatches.length > 0) {
    parts.push(`Relevant Items:\n${JSON.stringify(itemMatches, null, 2)}`);
  }

  // Location matches
  const locationMatches = topMatches(locationData, queryWords, 5);
  if (locationMatches.length > 0) {
    parts.push(`Relevant Locations:\n${JSON.stringify(locationMatches, null, 2)}`);
  }

  // Recipe matches
  if (recipeData.length > 0) {
    const recipeMatches = topMatches(recipeData, queryWords, 5);
    if (recipeMatches.length > 0) {
      parts.push(`Relevant Recipes:\n${JSON.stringify(recipeMatches, null, 2)}`);
    }
  }

  // Cooking recipe matches
  if (cookingRecipeData.length > 0) {
    const cookingMatches = topMatches(cookingRecipeData, queryWords, 5);
    if (cookingMatches.length > 0) {
      parts.push(`Relevant Cooking Recipes:\n${JSON.stringify(cookingMatches, null, 2)}`);
    }
  }

  if (parts.length === 0) {
    return `Available data: ${pokemonData.length} Pokemon, ${habitatData.length} habitats, ${itemData.length} items, ${locationData.length} locations, ${recipeData.length} recipes, ${cookingRecipeData.length} cooking recipes. No specific matches found — try asking about a specific Pokemon, location, item, or recipe.`;
  }

  return parts.join("\n\n");
}
