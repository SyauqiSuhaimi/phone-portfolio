"use client";

import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { Slider } from "@/components/ui/slider";

type ControlCenterProps = {
  onClose: () => void;
};

const ControlCenter = ({ onClose }: ControlCenterProps) => {
  const { theme, toggleTheme, brightness, updateBrightness } = useTheme();

  const handleBrightnessChange = (value: number[]) => {
    updateBrightness(value[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 w-full h-full bg-black/50 z-[500] flex flex-col items-center pt-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-[90%] backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-4 shadow-2xl transition-colors ${
          theme === "dark" ? "bg-gray-900/90" : "bg-white/90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-4 gap-2.5">
          <div className="aspect-square bg-os-accent rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-os-accent/90 transition-colors">
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
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <div className="aspect-square bg-os-accent rounded-xl flex items-center justify-center text-white cursor-pointer hover:bg-os-accent/90 transition-colors">
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
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
          <div
            className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              theme === "dark"
                ? "bg-os-accent text-white"
                : "bg-black/5 hover:bg-black/10 text-black"
            }`}
            onClick={toggleTheme}
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
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
          <div
            className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              theme === "dark"
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-black/5 text-black hover:bg-black/10"
            }`}
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
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
              <line x1="23" y1="13" x2="23" y2="11" />
            </svg>
          </div>
        </div>

        <div
          className={`rounded-xl p-4 flex items-center gap-3 transition-colors ${
            theme === "dark"
              ? "bg-white/10 text-white"
              : "bg-black/5 text-black"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2" />
            <path d="M12 21v2" />
            <path d="M4.22 4.22l1.42 1.42" />
            <path d="M18.36 18.36l1.42 1.42" />
            <path d="M1 12h2" />
            <path d="M21 12h2" />
            <path d="M4.22 19.78l1.42-1.42" />
            <path d="M18.36 5.64l1.42-1.42" />
          </svg>
          <Slider
            value={[brightness]}
            onValueChange={handleBrightnessChange}
            min={20}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
        {/* 
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-black"
            }`}
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
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div className="flex-1 flex flex-col">
            <span
              className={`text-sm font-medium transition-colors ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Not Playing
            </span>
            <span
              className={`text-xs transition-colors ${
                theme === "dark" ? "text-white/60" : "text-black/60"
              }`}
            >
              Music App
            </span>
          </div>
          <div
            className={`cursor-pointer transition-colors ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div> */}
      </motion.div>
    </motion.div>
  );
};

export default ControlCenter;
