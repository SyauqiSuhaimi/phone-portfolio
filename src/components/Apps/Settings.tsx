"use client";

import { useTheme } from "../../context/ThemeContext";
import { Smartphone, Terminal } from "lucide-react";
import { apps } from "../../config/apps";
import packageJson from "../../../package.json";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const buildDate =
    process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString().slice(0, 10);
  const stack = ["Next.js", "React", "TypeScript", "Tailwind"].join(" · ");

  return (
    <div className="text-black dark:text-white">
      {/* Header Profile / Device Info */}
      <div className="mb-6 bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-black/5 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3 shadow-inner">
            <Smartphone
              size={32}
              className="text-gray-400 dark:text-gray-500"
            />
          </div>
          <h1 className="text-xl font-bold">Phone OS</h1>
          <p className="text-xs text-black/40 dark:text-white/40 font-mono uppercase tracking-widest">
            v{packageJson.version}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-black/5 dark:border-white/5">
            <span className="text-[10px] uppercase text-black/40 dark:text-white/40 font-bold tracking-wider">
              Build
            </span>
            <span className="text-xs font-semibold font-mono">{buildDate}</span>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-black/5 dark:border-white/5">
            <span className="text-[10px] uppercase text-black/40 dark:text-white/40 font-bold tracking-wider">
              Total Apps
            </span>
            <span className="text-xs font-semibold font-mono">
              {apps.length} Installed
            </span>
          </div>
        </div>

        <div className="mt-3 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={14} className="text-black/40 dark:text-white/40" />
            <span className="text-[10px] uppercase text-black/40 dark:text-white/40 font-bold tracking-wider">
              Tech Stack
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Next.js", "React", "TypeScript", "Tailwind"].map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-1 bg-white dark:bg-white/10 rounded-md shadow-sm border border-black/5 dark:border-white/5 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-3">Settings</h2>
      <div className="flex flex-col gap-2.5">
        <div className="p-4 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-between">
          <span>Airplane Mode</span>
          <div className="w-10 h-6 bg-gray-400 dark:bg-gray-600 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
        <div className="p-4 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-between">
          <span>Wi-Fi</span>
          <div className="w-10 h-6 bg-os-accent rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
        <div className="p-4 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-between">
          <span>Bluetooth</span>
          <div className="w-10 h-6 bg-os-accent rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>

        <div className="mt-4 mb-2 text-sm text-black/50 dark:text-white/50 font-medium uppercase px-2">
          Display & Brightness
        </div>
        <div
          className="p-4 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-between cursor-pointer"
          onClick={toggleTheme}
        >
          <span>Dark Mode</span>
          <div
            className={`w-10 h-6 rounded-full relative transition-colors ${theme === "dark" ? "bg-os-accent" : "bg-gray-400 dark:bg-gray-600"}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === "dark" ? "right-1" : "left-1"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
