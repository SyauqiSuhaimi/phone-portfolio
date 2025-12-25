"use client";

import { useTheme } from "../../context/ThemeContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="text-black dark:text-white">
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
          <div className="w-10 h-6 bg-os-success rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
        <div className="p-4 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-between">
          <span>Bluetooth</span>
          <div className="w-10 h-6 bg-os-accent rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </div>
        
        <div className="mt-4 mb-2 text-sm text-black/50 dark:text-white/50 font-medium uppercase px-2">Display & Brightness</div>
        <div className="p-4 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-between cursor-pointer" onClick={toggleTheme}>
          <span>Dark Mode</span>
          <div className={`w-10 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-os-success' : 'bg-gray-400 dark:bg-gray-600'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
