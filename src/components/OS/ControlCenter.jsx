import React from 'react';
import { motion } from 'framer-motion';

const ControlCenter = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-0 left-0 w-full h-full bg-black/50 z-[500] flex justify-center items-end pb-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-[90%] bg-gray-900/90 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid grid-cols-4 gap-2.5">
          <div className="aspect-square bg-os-accent rounded-xl flex items-center justify-center text-xl cursor-pointer">📶</div>
          <div className="aspect-square bg-os-accent rounded-xl flex items-center justify-center text-xl cursor-pointer">✈️</div>
          <div className="aspect-square bg-white/10 rounded-xl flex items-center justify-center text-xl cursor-pointer">🌙</div>
          <div className="aspect-square bg-white/10 rounded-xl flex items-center justify-center text-xl cursor-pointer">🔋</div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 flex items-center gap-2.5">
          <span>🔆</span>
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="w-[70%] h-full bg-white" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">🎵</div>
          <div className="flex-1 flex flex-col">
            <span className="text-white text-sm">Not Playing</span>
            <span className="text-white/60 text-xs">Music App</span>
          </div>
          <div className="text-2xl">▶</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ControlCenter;
