import { NextRequest } from "next/server";
import { Message } from "ai";
import habitatData from "@/data/habitats-full.json";

import pokedexData from "@/data/pokedex.json";

import fs from "fs";
import path from "path";

import { OpenAI } from "openai";

import { z } from "zod";

const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  }
}

  if (!config.openai.apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
}

  const data = JSON.parse(habitatsData);
  const pokedexData = JSON.parse(pokedexData);
  
  // Build search index
  const habitatChunks = habitatData.habitats.filter(h => 
    h.id === h || h.name.toLowerCase().includes(query.toLowerCase())
  );
  const pokemonChunks = pokedexData.pokemon.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  // Generate embedding
  const embeddings = await openai.embeddings.create({
    input: `${h.name} Habitat: ${h.items.join(", ")}`,
    model: "text-embedding-3-small",
  });
  
  // Query
  const query = `How do I build the habitat for ${h.name}? What items are needed?`;
  const habitatEmbedding = await openai.embeddings.embed(query(
    `How do I build the habitat for ${h.name}? What items do I need and what are the spawn conditions?`,
    embedding,
  );
  
  // Return results
  return NextResponse.json({
    answer: question,
    relevantHabitats: habitatChunks.map(h => h.name),
    pokemonList: relevantPokemon.map(p => p.name),
    sources: habitatChunks.map(h => `https://game8.co/games/Pokemon-Pokopia/archives/585${habitat.id}`),
    confidence: number,
    explanation: habitat.build guide,
    items: items,
  })
}
