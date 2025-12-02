import React from 'react';
import { apps } from '../../config/apps';
import { useTheme } from '../../context/ThemeContext';

const AppGrid = ({ onAppClick }) => {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-5 gap-x-2.5 px-5 w-full mt-5">
      {apps.map((app) => (
        <div
          key={app.id}
          className="group flex flex-col items-center gap-2 cursor-pointer active:scale-90 active:opacity-80 transition-transform duration-200 "
          onClick={() => onAppClick(app.id)}
        >
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-xl border border-white/10  ${theme === 'dark' ? 'bg-black/40 hover:bg-black/10 text-white group-hover:bg-black/50' : 'bg-white text-black group-hover:bg-white/50'} transition-colors`}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={app.iconPath} />
            </svg>
          </div>
          <span className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-black'} text-shadow-sm font-medium`}>{app.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AppGrid;
