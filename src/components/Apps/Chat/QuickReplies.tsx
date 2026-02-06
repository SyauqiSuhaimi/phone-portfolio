"use client";

import { motion } from "framer-motion";

type QuickRepliesProps = {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
};

export const QuickReplies = ({ options, onSelect, disabled }: QuickRepliesProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide mask-fade-sides">
      {options.map((option, index) => (
        <motion.button
          key={option}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="flex-shrink-0 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-sm font-medium rounded-full text-black dark:text-white border border-black/5 dark:border-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-sm"
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
};
