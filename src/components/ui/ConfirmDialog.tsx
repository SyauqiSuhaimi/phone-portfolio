"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "danger";
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
}: ConfirmDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-black/5 dark:divide-white/5 border-t border-black/5 dark:border-white/5">
              <button
                onClick={onCancel}
                className="p-4 text-sm font-medium text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`p-4 text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                  type === "danger"
                    ? "text-red-500"
                    : "text-blue-500 dark:text-blue-400"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
