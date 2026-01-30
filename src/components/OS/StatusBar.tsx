"use client";

import { useClock } from "../../hooks/useClock";
import { useTheme } from "../../context/ThemeContext";

const StatusBar = () => {
  const { formattedTime } = useClock();
  const { theme } = useTheme();

  return (
    <div className={`fixed top-0 left-0 w-full h-11 flex justify-between items-center px-5 text-sm font-semibold z-[1000] transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <div className="flex-1">
        <span className="text-sm">{formattedTime}</span>
      </div>
      <div className="flex gap-3 items-center text-base">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
          <line x1="23" y1="13" x2="23" y2="11" />
        </svg>
      </div>
    </div>
  );
};

export default StatusBar;
