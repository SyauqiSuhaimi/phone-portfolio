import React from 'react';

const BottomNav = ({ onHome, onBack, onOptions }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-900/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-4 z-[300]">
      <button 
        onClick={onOptions}
        className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors active:scale-95"
      >
        <span className="text-xl">⚙️</span>
        <span className="text-xs">Options</span>
      </button>
      <button 
        onClick={onHome}
        className="flex flex-col items-center gap-1 text-white hover:text-os-accent transition-colors active:scale-95"
      >
        <span className="text-xl">🏠</span>
        <span className="text-xs font-medium">Home</span>
      </button>
      <button 
        onClick={onBack}
        className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors active:scale-95"
      >
        <span className="text-xl">◀️</span>
        <span className="text-xs">Back</span>
      </button>
    </div>
  );
};

export default BottomNav;
