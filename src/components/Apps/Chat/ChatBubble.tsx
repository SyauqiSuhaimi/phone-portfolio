"use client";

import { motion } from "framer-motion";

type ChatBubbleProps = {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
  };
};

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[15px] leading-snug shadow-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 dark:bg-zinc-800 text-black dark:text-white rounded-bl-none border border-black/5 dark:border-white/5"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
};
