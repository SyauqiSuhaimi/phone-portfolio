"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useNotification } from "../../context/NotificationContext";

const NotificationSystem = () => {
  const { notifications } = useNotification();

  return (
    <div className="absolute top-16 left-0 w-full flex flex-col items-center gap-2.5 z-[1000] pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-4 py-3 rounded-2xl w-[90%] max-w-[350px] flex items-center gap-3 shadow-lg text-black dark:text-white pointer-events-auto border border-black/5 dark:border-white/5"
          >
            {n.icon && <div className="text-xl">{n.icon}</div>}
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{n.title}</span>
              <span className="text-xs opacity-80">{n.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
