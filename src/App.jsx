import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import LockScreen from './components/OS/LockScreen';
import HomeScreen from './components/OS/HomeScreen';
import AppWindow from './components/Apps/AppWindow';
import About from './components/Apps/About';
import Projects from './components/Apps/Projects';
import Skills from './components/Apps/Skills';
import { Gallery, Contact, Settings } from './components/Apps/Placeholders';
import NotificationSystem from './components/OS/NotificationSystem';
import BottomNav from './components/OS/BottomNav';
import { useSwipe } from './hooks/useSwipe';
import { useHaptics } from './hooks/useHaptics';
import { apps } from './config/apps';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [activeAppId, setActiveAppId] = useState(null);
  const homeScreenRef = useRef(null);
  const { triggerHaptic } = useHaptics();

  const handleUnlock = () => {
    triggerHaptic();
    setIsLocked(false);
  };

  const handleAppClick = (appId) => {
    triggerHaptic([5]);
    setActiveAppId(appId);
  };

  const handleCloseApp = () => {
    setActiveAppId(null);
  };

  const handleHome = () => {
    if (activeAppId) {
      handleCloseApp();
    }
    // Could also reset HomeScreen to index 0 here if needed
  };

  const handleBack = () => {
    if (activeAppId) {
      handleCloseApp();
    }
    // Could add navigation history here
  };

  const handleOptions = () => {
    // Open settings or options
    handleAppClick('settings');
  };

  const swipeHandlers = useSwipe({
    onSwipeUp: isLocked ? handleUnlock : undefined,
  });

  const getAppContent = (id) => {
    switch (id) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'gallery':
        return <Gallery />;
      case 'contact':
        return <Contact />;
      case 'settings':
        return <Settings />;
      default:
        return <div className="p-5 text-white">Content for {id} coming soon...</div>;
    }
  };

  const activeAppConfig = apps.find(a => a.id === activeAppId);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden" {...(isLocked ? swipeHandlers : {})}>
      <AnimatePresence>
        {isLocked && <LockScreen onUnlock={handleUnlock} />}
      </AnimatePresence>

      {!isLocked && (
        <>
          <HomeScreen ref={homeScreenRef} onAppClick={handleAppClick} />
          <AnimatePresence>
            {activeAppId && activeAppConfig && (
              <AppWindow app={activeAppConfig} onClose={handleCloseApp}>
                {getAppContent(activeAppId)}
              </AppWindow>
            )}
          </AnimatePresence>
          <NotificationSystem />
          <BottomNav 
            onHome={handleHome}
            onBack={handleBack}
            onOptions={handleOptions}
          />
        </>
      )}
    </div>
  );
}

export default App;
