"use client";

import { motion } from "framer-motion";
import { useClock } from "../../hooks/useClock";
import { useWallpaper } from "../../context/WallpaperContext";

type LockScreenProps = {
  onUnlock: () => void;
};

const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const { formattedTime, formattedDate } = useClock();
  const { wallpaper, type } = useWallpaper();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="absolute top-0 left-0 w-full h-full bg-cover bg-center flex flex-col items-center justify-between p-10 pt-16 pb-10 text-white z-[100] transition-all duration-700"
      style={{
        backgroundImage: type === 'image' ? `url(${wallpaper})` : undefined,
      }}
      onClick={onUnlock}
    >
      {type === 'video' && (
        <video
          src={wallpaper}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />
      )}
      <div className="flex-shrink-0 h-11" />
      
      <div className="text-center mt-10">
        <h1 className="text-7xl font-extralight tracking-tighter m-0">{formattedTime}</h1>
        <h2 className="text-xl font-normal mt-1 opacity-80">{formattedDate}</h2>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-start pt-10 gap-2.5">
        <div className="bg-white/15 backdrop-blur-xl p-4 rounded-2xl w-full max-w-[340px] flex items-center gap-4 shadow-lg">
          <div className="text-2xl bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center">
            👋
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Welcome to Syauqi Portfolio</span>
            <span className="text-xs opacity-80">Swipe up to unlock</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2.5 opacity-60 animate-pulse-slow">
        <div className="w-36 h-1.5 bg-white rounded-full" />
        <span className="text-sm">Swipe up to unlock</span>
      </div>
    </motion.div>
  );
};

export default LockScreen;
