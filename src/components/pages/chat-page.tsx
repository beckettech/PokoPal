'use client'

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Coins, Sparkles, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

// Dexter avatar
const DEXTER_AVATAR = "🤖";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function ChatPage() {
  const { setCurrentPage, coins, chatMessages, addChatMessage, spendCoins, addCoins, capturedPokemon, ownedItems, discoveredHabitats } = useAppStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Build user progress summary for context
  const getUserProgress = () => {
    return `Friends: ${capturedPokemon.length}, Items owned: ${ownedItems.length}, Habitats discovered: ${discoveredHabitats.length}`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (coins < 100) {
      alert("Not enough coins! You need 100 coins per question.");
      return;
    }

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    addChatMessage({ role: "user", content: userMessage });

    setIsLoading(true);

    let coinDeducted = false;
    try {
      // Build context based on query
      const context = await buildContext(userMessage);
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, { role: "user", content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          })),
          context,
          userProgress: getUserProgress(),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("API error:", response.status, errText);
        throw new Error(`API error ${response.status}`);
      }

      // Only deduct coins on success
      spendCoins(100);
      coinDeducted = true;

      // Parse JSON response
      const data = await response.json();
      const fullContent = data.content;

      if (!fullContent) throw new Error("Empty response");

      // Add assistant message
      addChatMessage({ role: "assistant", content: fullContent });
    } catch (error) {
      console.error("Chat error:", error);
      addChatMessage({ role: "assistant", content: "Hmm, I couldn't reach my knowledge base. Please try again!" });
      // Refund coins if we already deducted but got no response
      if (coinDeducted) addCoins(100);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse message for [[links]]
  const renderMessage = (content: string) => {
    const linkRegex = /\[\[(Dex|Habitat|Items): ([^\]]+)\]\]/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      
      const [full, type, name] = match;
      const handleClick = () => {
        if (type === "Dex") {
          setCurrentPage("dex");
        } else if (type === "Habitat") {
          setCurrentPage("habitat-dex");
        } else if (type === "Items") {
          setCurrentPage("items");
        }
      };
      
      parts.push(
        <button
          key={match.index}
          onClick={handleClick}
          className="text-cyan-600 font-medium hover:underline"
        >
          {name}
        </button>
      );
      lastIndex = match.index + full.length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-600 to-blue-700">
      {/* Header */}
      <div className="pt-6 pb-3 px-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setCurrentPage("home")}
            className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
              {DEXTER_AVATAR}
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Dexter</h1>
              <p className="text-[10px] text-white/70">Your Pokédex Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1.5 rounded-full">
            <Coins className="w-4 h-4 text-yellow-800" />
            <span className="text-sm font-bold text-yellow-900">{coins}</span>
          </div>
        </div>

        {/* Cost indicator */}
        <div className="flex items-center justify-center gap-1 text-white/60 text-xs">
          <Sparkles className="w-3 h-3" />
          <span>100 coins per question</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-t-[2rem] overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Welcome message */}
          {chatMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                {DEXTER_AVATAR}
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Hi, I'm Dexter!</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Ask me about Pokémon locations, habitats, items, or anything Pokopia!
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Where can I find Pikachu?", "How do I build a hot spring?", "What items do I need for a garden?"].map(q => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-xs bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 hover:bg-gray-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{renderMessage(msg.content)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask Dexter anything..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || coins < 100}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isLoading && coins >= 100
                ? "bg-cyan-500 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {coins < 100 && (
          <p className="text-xs text-red-500 text-center mt-2">Not enough coins! Visit the shop to get more.</p>
        )}
      </div>
    </div>
  );
}

// Build context based on query keywords
async function buildContext(query: string): Promise<any> {
  const q = query.toLowerCase();
  const context: any = {};

  // Load data based on query keywords
  if (q.includes("pokemon") || q.includes("find") || q.includes("catch") || q.includes("where")) {
    try {
      const res = await fetch("/pokemon-data.json");
      context.pokemon = await res.json();
    } catch {}
  }

  if (q.includes("habitat") || q.includes("build") || q.includes("home") || q.includes("house")) {
    try {
      const res = await fetch("/habitats.json");
      const data = await res.json();
      context.habitat = data.slice(0, 50); // Limit for context
    } catch {}
  }

  if (q.includes("item") || q.includes("get") || q.includes("material") || q.includes("need")) {
    try {
      const res = await fetch("/items.json");
      const data = await res.json();
      context.items = data.flatMap((c: any) => c.items).slice(0, 100);
    } catch {}
  }

  return context;
}
