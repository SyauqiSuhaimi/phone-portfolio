import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBar from './StatusBar';
import AppGrid from './AppGrid';
import Dock from './Dock';
import ControlCenter from './ControlCenter';
import SearchPanel from './SearchPanel';
import Projects from '../Apps/Projects';
import Skills from '../Apps/Skills';
import { useSwipe } from '../../hooks/useSwipe';

const HomeScreen = ({ onAppClick }) => {
  const [overlay, setOverlay] = useState(null); // 'control', 'search', null
  const [screenIndex, setScreenIndex] = useState(0); // -1: Projects, 0: Home, 1: Skills
  const prevScreenIndex = useRef(0);

  const handleSwipeUp = () => {
   if (screenIndex === 0) setOverlay('search');
  };

  const handleSwipeDown = () => {
    
     if (screenIndex === 0) setOverlay('control');
  };

  const handleSwipeLeft = () => {
    if (screenIndex < 1) {
      prevScreenIndex.current = screenIndex;
      setScreenIndex(prev => prev + 1);
    }
  };

  const handleSwipeRight = () => {
    if (screenIndex > -1) {
      prevScreenIndex.current = screenIndex;
      setScreenIndex(prev => prev - 1);
    }
  };

  const closeOverlay = () => {
    setOverlay(null);
  };

  const swipeHandlers = useSwipe({
    onSwipeUp: handleSwipeUp,
    onSwipeDown: handleSwipeDown,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  // Calculate direction based on screen index change
  const getDirection = (current, previous) => {
    return current > previous ? 1 : -1;
  };

  const direction = getDirection(screenIndex, prevScreenIndex.current);

  const pageVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  return (
    <div
      className="w-full h-full bg-cover bg-center flex flex-col relative overflow-hidden"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }}
      {...swipeHandlers}
    >
      <StatusBar theme="light" />
      
      <div className="flex-1 w-full relative">
        <AnimatePresence initial={false} custom={direction}>
          {screenIndex === 0 && (
            <motion.div
              key="home"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute top-0 left-0 w-full h-full flex flex-col"
            >
              <div className="flex-1 pt-11 flex flex-col justify-start">
                <AppGrid onAppClick={onAppClick} />
              </div>
              {/* <Dock onAppClick={onAppClick} /> */}
            </motion.div>
          )}

          {screenIndex === -1 && (
            <motion.div
              key="projects"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute top-0 left-0 w-full h-full flex flex-col pt-16 px-5 pb-5 overflow-y-auto"
            >
              <div className="mb-5">
                <h2 className="text-white text-2xl font-bold">Recent Projects</h2>
              </div>
              <Projects />
            </motion.div>
          )}

          {screenIndex === 1 && (
            <motion.div
              key="skills"
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
              className="absolute top-0 left-0 w-full h-full flex flex-col pt-16 px-5 pb-5 overflow-y-auto"
            >
              <div className="mb-5">
                <h2 className="text-white text-2xl font-bold">Skills Timeline</h2>
              </div>
              <Skills />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-[6rem] left-0 w-full flex justify-center gap-2 pointer-events-none z-50">
        <div className={`w-2 h-2 rounded-full transition-all ${screenIndex === -1 ? 'bg-white scale-125' : 'bg-white/30'}`} />
        <div className={`w-2 h-2 rounded-full transition-all ${screenIndex === 0 ? 'bg-white scale-125' : 'bg-white/30'}`} />
        <div className={`w-2 h-2 rounded-full transition-all ${screenIndex === 1 ? 'bg-white scale-125' : 'bg-white/30'}`} />
      </div>

      <AnimatePresence>
        {overlay === 'control' && <ControlCenter onClose={closeOverlay} />}
        {/* {overlay === 'search' && <SearchPanel onClose={closeOverlay} />} */}
      </AnimatePresence>
    </div>
  );
};

export default HomeScreen;
