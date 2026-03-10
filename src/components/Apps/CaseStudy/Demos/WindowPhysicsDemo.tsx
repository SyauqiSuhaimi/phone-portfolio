import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

export const WindowPhysicsDemo = () => {
  const [isAppOpen, setIsAppOpen] = useState(false);

  return (
    <div className="w-full h-full bg-slate-100 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-[320px] h-full max-h-[420px] rounded-[28px] border border-black/10 dark:border-white/10 overflow-hidden shadow-2xl bg-black relative">
        <motion.div
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-indigo-500/20"
        >
          <div className="h-full flex flex-col items-center justify-center gap-4 text-white">
            <p className="text-sm font-semibold">Home Screen</p>
            <button
              type="button"
              onClick={() => setIsAppOpen(true)}
              className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 text-xs"
            >
              Open App
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isAppOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={SPRING}
              className="absolute inset-0 bg-white dark:bg-zinc-900 z-30 text-black dark:text-white"
            >
              <div className="h-10 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-3">
                <span className="text-xs font-semibold">App Window</span>
                <button
                  type="button"
                  onClick={() => setIsAppOpen(false)}
                  className="text-xs px-2 py-1 rounded bg-black/5 dark:bg-white/10"
                >
                  Close
                </button>
              </div>
              <div className="p-4 text-xs opacity-80">
                Demo: app opens from bottom and closes back down with spring animation.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
