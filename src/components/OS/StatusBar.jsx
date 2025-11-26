import React from 'react';
import { useClock } from '../../hooks/useClock';

const StatusBar = ({ theme = 'light' }) => {
  const { formattedTime } = useClock();

  return (
    <div className={`fixed top-0 left-0 w-full h-11 flex justify-between items-center px-5 text-sm font-semibold z-[1000] ${theme === 'light' ? 'text-white' : 'text-black'}`}>
      <div className="flex-1">
        <span className="text-sm">{formattedTime}</span>
      </div>
      <div className="flex gap-2 text-base">
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>
  );
};

export default StatusBar;
