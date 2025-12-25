"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { AppConfig } from "../../config/apps";
import { useTheme } from "../../context/ThemeContext";

type FolderViewProps = {
  folder: AppConfig;
  origin?: DOMRect | null;
  onClose: () => void;
  onAppClick: (appId: string) => void;
};

const getOriginOffset = (origin?: DOMRect | null) => {
  if (!origin || typeof window === "undefined") {
    return { x: 0, y: 0, scale: 0.9 };
  }

  const centerX = origin.left + origin.width / 2;
  const centerY = origin.top + origin.height / 2;
  const targetX = window.innerWidth / 2;
  const targetY = window.innerHeight / 2;

  return {
    x: centerX - targetX,
    y: centerY - targetY,
    scale: Math.max(origin.width / window.innerWidth, 0.18),
  };
};

const FolderView = ({ folder, origin, onClose, onAppClick }: FolderViewProps) => {
  const { theme } = useTheme();
  const originOffset = useMemo(() => getOriginOffset(origin), [origin]);
  const apps = folder.apps ?? [];

  return (
    <motion.div
      initial={{
        x: originOffset.x,
        y: originOffset.y,
        scale: originOffset.scale,
        opacity: 0.6,
      }}
      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      exit={{
        x: originOffset.x,
        y: originOffset.y,
        scale: originOffset.scale,
        opacity: 0,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="absolute inset-0 z-[180] flex flex-col bg-white/20 backdrop-blur-3xl"
    >
      <div className="flex items-center justify-between px-5 pt-10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
            Folder
          </p>
          <h2 className="text-2xl font-bold text-white">{folder.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors text-sm"
        >
          Close
        </button>
      </div>

      <div className="flex-1 px-5 pb-10 overflow-y-auto">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {apps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onAppClick(app.id)}
              className="group flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-xl border border-white/10 ${
                  theme === "dark"
                    ? "bg-black/40 text-white group-hover:bg-black/60"
                    : "bg-white text-black group-hover:bg-white/80"
                } transition-colors`}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={app.iconPath} />
                </svg>
              </div>
              <span
                className={`text-xs font-medium ${
                  theme === "dark" ? "text-white" : "text-white"
                }`}
              >
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FolderView;
