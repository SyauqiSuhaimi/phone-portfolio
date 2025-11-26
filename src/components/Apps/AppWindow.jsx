import React from 'react';
import { motion } from 'framer-motion';
import { useSwipe } from '../../hooks/useSwipe';

const AppWindow = ({ app, onClose, children }) => {
  const swipeHandlers = useSwipe({
    onSwipeRight: onClose, // Swipe right to close
    threshold: 80,
  });

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute top-0 left-0 w-full h-full bg-black z-[200] flex flex-col"
      {...swipeHandlers}
    >
      <div className="h-12 flex items-center justify-center px-4 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <span className="font-semibold text-white">{app.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-20 bg-gray-950">
        {children}
      </div>
    </motion.div>
  );
};

export default AppWindow;
