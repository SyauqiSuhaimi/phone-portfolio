import { motion } from 'framer-motion';
import { useState } from 'react';

export const WindowPhysicsDemo = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-full h-full bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-0 w-full text-center pointer-events-none z-0">
                <span className="text-sm font-bold text-blue-300 uppercase tracking-widest opacity-30 text-[100px] leading-none">
                    SPRING
                </span>
            </div>

            <motion.div
                layout
                drag
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                dragElastic={0.2}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                    scale: isOpen ? 1 : 0.8, 
                    opacity: isOpen ? 1 : 0,
                    y: isOpen ? 0 : 50
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-48 h-32 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden relative z-10 cursor-grab active:cursor-grabbing border border-black/5 dark:border-white/10"
            >
                {/* Window Header */}
                <div className="h-6 bg-gray-100 dark:bg-zinc-700/50 flex items-center px-3 border-b border-black/5 dark:border-white/5">
                    <div className="flex gap-1.5">
                         <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                         <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                </div>
                
                {/* Window Content */}
                 <div className="p-4 flex flex-col items-center justify-center flex-1">
                    <p className="text-xs text-center text-gray-500">
                        Drag me around!<br/>
                        <span className="text-[10px] opacity-70">Release to bounce back</span>
                    </p>
                    <button 
                        className="mt-2 text-[10px] bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Reset position visually
                        }}
                    >
                        Reset
                    </button>
                 </div>
            </motion.div>

            {/* Controls */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-4 z-20">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 bg-white dark:bg-zinc-800 shadow-lg rounded-full text-xs font-bold active:scale-95 transition-transform border border-gray-200 dark:border-white/10"
                >
                    {isOpen ? 'Close Window' : 'Open Window'}
                </button>
            </div>
        </div>
    );
};
