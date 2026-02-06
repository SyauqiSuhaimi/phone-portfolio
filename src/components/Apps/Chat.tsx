"use client";

import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "./Chat/ChatBubble";
import { QuickReplies } from "./Chat/QuickReplies";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { useHaptics } from "../../hooks/useHaptics";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

const SYSTEM_PROMPT = `You are Syauqi's digital assistant. You are helpful, energetic, and slightly humorous. 
You love using emojis 🚀. 
If asked about skills, projects, or experience, use the context provided to answer accurately but with a fun tone.
If the context doesn't have the answer, admit it playfully. 
Keep answers concise (under 3 sentences usually).`;

const INITIAL_MESSAGE: Message = {
  id: "init-1",
  role: "assistant",
  content: "Hey there! 🌟 I'm Syauqi's digital sidekick. What can I help you with today? (I promise I'm friendly!)",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTIONS = [
  "Tell me about your skills",
  "Show me your projects",
  "How can I contact you?",
  "Work experience?",
  "What is this OS?",
];

const KEYWORD_RESPONSES: Record<string, string> = {
  skills: "Oh, where do I start? 🚀 Syauqi is a wizard with **React, Next.js, and TypeScript**. He also speaks fluent Tailwind CSS and has dabbled in the dark arts of Backend wizardry! 🧙‍♂️",
  project: "He's built some absolute bangers! 💥 Check out the **App Store** or **Projects** app to see the magic. (Spoiler: They are awesome)",
  contact: "Want to say hi? You can slide into his emails at **contact@syauqisuhaimi.com** 📧. Or just stalk him professionally on LinkedIn via the **Contact** app! 😉",
  email: "Sending an email? Classic! 📬 It's **contact@syauqisuhaimi.com**. Don't be shy!",
  experience: "He's been around the block! 🌍 A seasoned **Frontend Developer** and **Full Stack Engineer**. Poke the **About** app to read the serious stuff (it's impressive, I swear).",
  os: "Do you like it? 😍 It's a whole fake phone in your browser! Built with React and pure caffeine. ☕",
  hello: "Hello! 👋 You look great today! (I can't see you, but I just know it)",
  hi: "Hi friend! Ready to explore? 🚀",
  joke: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛 (I know, I know... I'll stick to coding)",
  default: "Haha, I have absolutely NO idea what you're talking about! 🤷‍♂️ I'm just a simple portfolio bot, not a superintelligence (yet). Try asking about **skills**, **projects**, or how to **contact** the boss!",
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHaptics();

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    triggerHaptic();
    
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // AI First Approach
    try {
      const response = await fetch("/api/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.slice(-4), // Context window
              { role: "user", content: text }
          ],
          maxTokens: 150,
        }),
      });
      
      if (!response.ok) throw new Error("API Failed");
      
      const data = await response.json();
      const responseContent = data.text || KEYWORD_RESPONSES.default;

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      // Fallback: Local Keyword Check
      const lowerText = text.toLowerCase();
      let fallbackContent = KEYWORD_RESPONSES.default;

      for (const [key, value] of Object.entries(KEYWORD_RESPONSES)) {
        if (lowerText.includes(key) && key !== "default") {
          fallbackContent = value;
          break;
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
      triggerHaptic(); // Haptic on receive
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white relative">
      {/* Header */}
      <div className="flex-none h-16 px-4 flex items-center justify-between border-b border-gray-100 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            AI
          </div>
          <div>
            <h2 className="font-semibold leading-none">Portfolio Bot</h2>
            <span className="text-xs text-green-500 font-medium">Active now</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-blue-500">
          <Phone size={22} className="opacity-50 cursor-not-allowed" />
          <Video size={24} className="opacity-50 cursor-not-allowed" />
          <MoreVertical size={22} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <div className="text-center text-xs text-gray-400 my-4 font-medium uppercase tracking-wide">
          Today
        </div>
        
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-gray-200 dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
             </div>
           </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none pb-safe">
        <QuickReplies 
          options={SUGGESTIONS} 
          onSelect={handleSend} 
          disabled={isTyping} 
        />
        
        <div className="p-3 bg-gray-50 dark:bg-zinc-900 border-t border-black/5 dark:border-white/5 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="iMessage"
            className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 shadow-sm"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
