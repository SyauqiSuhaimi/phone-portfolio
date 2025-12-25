"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type InferenceResponse = {
  text?: string;
  model?: string;
  error?: string;
};

const MAX_CONTEXT = 6;
const SYSTEM_PROMPT =
  "You are a helpful assistant responding in a friendly, concise tone.";
const STORAGE_KEY = "os-portfolio-chat";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore corrupted history.
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage errors (quota, privacy mode).
    }
  }, [messages, hasLoaded]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const nextMessages: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...nextMessages.slice(-MAX_CONTEXT),
          ],
          maxTokens: 200,
          temperature: 0.7,
        }),
      });

      const data = (await response.json()) as InferenceResponse;
      if (!response.ok) {
        throw new Error(data.error || "Inference failed.");
      }

      const reply = (data.text ?? "").trim();
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply || "I could not generate a response. Try again.",
        },
      ]);
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="text-white flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold">Chat</h2>
        <p className="text-os-text-muted text-sm">
          Ask anything and get a reply from Hugging Face.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-sm text-os-text-muted">
            Start the conversation by sending a message.
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
              message.role === "user"
                ? "self-end bg-os-accent text-white"
                : "self-start bg-white/10 text-white"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isSending && (
          <div className="max-w-[70%] rounded-2xl px-4 py-2 text-sm bg-white/10 text-os-text-muted">
            Thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="text-sm text-os-danger bg-os-danger/10 border border-os-danger/30 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-os-accent"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || isSending}
          className="rounded-xl bg-os-accent px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
