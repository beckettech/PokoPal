'use client'

import { useAppStore } from "@/lib/store";
import { ArrowLeft, Send, Coins, Sparkles, Lightbulb, MapPin, HelpCircle, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  { icon: MapPin, text: "Where can I find Tyranitar?", color: "bg-green-100 text-green-700" },
  { icon: Lightbulb, text: "How do I build a Hot Spring?", color: "bg-orange-100 text-orange-700" },
  { icon: HelpCircle, text: "What's the best habitat for Eevee?", color: "bg-purple-100 text-purple-700" },
  { icon: Sparkles, text: "Tips for rare Pokémon?", color: "bg-pink-100 text-pink-700" },
];

export function ChatPage() {
  const { setCurrentPage, coins, spendCoins } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content: "Hey there, Trainer! 👋 I'm Dexter, your Pokopia guide! I can help you find residents, build habitats, or explore the island. What would you like to know?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || coins < 1) return;

    // Spend a coin
    spendCoins(1);

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: messageText,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Where can I find Tyranitar?": "Great question! Tyranitar is a **Very Rare** Pokémon that can be found in the **Mossy Rest Spot** habitat. You'll need:\n\n• 4x Moss blocks\n• Patience (it may take several real-life days to appear!)\n\n💡 Tip: Building multiple Mossy Rest Spots increases your chances!",
        "How do I build a Hot Spring?": "To build a **Hot Spring** habitat, you'll need:\n\n🧱 2x Hot Spring Water tiles\n🪑 1x Shower\n💺 1x Any Seat\n\nThis habitat attracts **Psyduck, Golduck, and Torkoal**! Perfect for water-loving Pokémon.",
        "What's the best habitat for Eevee?": "Eevee loves the **Pretty Flower Bed** habitat! 🌸\n\n**Build Requirements:**\n• 4x Wildflowers\n\n**Special Note:** Eevee only appears in Palette Town! Make sure to build your habitat there.\n\nEevee can evolve into multiple forms based on different conditions!",
        "Tips for rare Pokémon?": "Here are my top tips for rare Pokémon! 🌟\n\n1. **Build Multiple Habitats** - More habitats = more spawn chances\n2. **Check Conditions** - Some need specific weather or time\n3. **Location Matters** - Palette Town has exclusive spawns\n4. **Be Patient** - Very Rare Pokémon can take days!\n5. **Use Weather Charms** - Castform items help control conditions",
      };

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: responses[messageText] || "I'd be happy to help with that! Let me look into it for you. 📚\n\nFeel free to ask about specific residents, habitats, or island-building tips!",
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-violet-600 to-purple-700">
      {/* Header */}
      <div className="pt-12 pb-2 px-4 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-white flex items-center gap-1">
              <Bot className="w-5 h-5" />
              Dexter
            </h1>
            <p className="text-[10px] text-white/60">Your Pokopia Guide</p>
          </div>

          <motion.button
            onClick={() => setCurrentPage("coin-shop")}
            className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-bold text-white">{coins}</span>
          </motion.button>
        </div>
      </div>

      {/* Messages Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] flex flex-col overflow-hidden min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === "user" 
                    ? "bg-purple-500" 
                    : "bg-gradient-to-br from-violet-500 to-purple-600"
                }`}>
                  {message.role === "user" 
                    ? <User className="w-4 h-4 text-white" />
                    : <Bot className="w-4 h-4 text-white" />
                  }
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[75%] rounded-2xl p-2.5 text-sm ${
                  message.role === "user" 
                    ? "bg-purple-500 text-white rounded-tr-md" 
                    : "bg-gray-100 text-gray-800 rounded-tl-md"
                }`}>
                  <div className="whitespace-pre-line text-xs leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-md p-2.5">
                <div className="flex gap-1">
                  <motion.span 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                  />
                  <motion.span 
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="px-3 pb-2 shrink-0">
            <p className="text-[10px] text-gray-500 mb-2">Suggested prompts:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSend(prompt.text)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-full ${prompt.color} flex items-center gap-1`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <prompt.icon className="w-3 h-3" />
                  {prompt.text}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={coins < 1 ? "No coins - tap shop above" : "Ask anything..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={coins < 1}
              className="flex-1 px-3 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50"
            />
            <motion.button
              onClick={() => handleSend()}
              disabled={!input.trim() || coins < 1}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-1.5">
            1 message = 1 coin • {coins} coins remaining
          </p>
        </div>
      </div>
    </div>
  );
}
