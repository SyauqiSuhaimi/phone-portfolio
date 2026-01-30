"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
// import { useSwipe } from "../../hooks/useSwipe";
import type { AppConfig } from "../../config/apps";

type AppWindowProps = {
  app: AppConfig;
  onClose: () => void;
  children: ReactNode;
};

const AppWindow = ({ app, onClose, children }: AppWindowProps) => {


  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black z-[200] flex flex-col"

    >
      <div className="h-12 flex items-center justify-center px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-black/5 dark:border-white/10">
        <span className="font-semibold text-black dark:text-white">{app.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-20 bg-gray-50 dark:bg-gray-950">
        {children}
      </div>
    </motion.div>
  );
};

export default AppWindow;
