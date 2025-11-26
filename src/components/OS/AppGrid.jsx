import React from 'react';
import { apps } from '../../config/apps';

const AppGrid = ({ onAppClick }) => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-5 gap-x-2.5 px-5 w-full mt-5">
      {apps.map((app) => (
        <div
          key={app.id}
          className="flex flex-col items-center gap-2 cursor-pointer active:scale-90 active:opacity-80 transition-transform duration-200"
          onClick={() => onAppClick(app.id)}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-md"
            style={{ background: app.color }}
          >
            {app.icon}
          </div>
          <span className="text-xs text-white text-shadow-sm font-medium">{app.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AppGrid;
