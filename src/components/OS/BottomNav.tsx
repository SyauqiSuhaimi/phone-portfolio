"use client";

import { useTheme } from "../../context/ThemeContext";

type BottomNavProps = {
  onHome: () => void;
  onBack: () => void;
  onOptions: () => void;
};

const BottomNav = ({ onHome, onBack, onOptions }: BottomNavProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 h-14 backdrop-blur-xl border rounded-full flex items-center justify-center gap-10 px-8 z-[300] shadow-2xl transition-all ${
        theme === "dark"
          ? "bg-black/40 border-white/10 text-white"
          : "bg-white/60 border-black/5 text-black"
      }`}
    >
      <button
        onClick={onBack}
        className={`transition-all active:scale-90 p-2 ${theme === "dark" ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}`}
        aria-label="Back"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={onHome}
        className={`transition-all active:scale-90 p-2 ${theme === "dark" ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}`}
        aria-label="Home"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>
      </button>

      <button
        onClick={onOptions}
        className={`transition-all active:scale-90 p-2 ${theme === "dark" ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"}`}
        aria-label="Options"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
    </div>
  );
};

export default BottomNav;
