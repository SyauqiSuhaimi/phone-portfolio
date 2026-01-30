"use client";
import { Analytics } from "@vercel/analytics/next";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LockScreen from "./components/OS/LockScreen";
import HomeScreen from "./components/OS/HomeScreen";
import AppWindow from "./components/Apps/AppWindow";
import FolderView from "./components/OS/FolderView";
import About from "./components/Apps/About";
import Chat from "./components/Apps/Chat";
import Camera from "./components/Apps/Camera";
import SkillsTree from "./components/Apps/SkillsTree";
import AppStore from "./components/Apps/AppStore";
import Settings from "./components/Apps/Settings";
import Contact from "./components/Apps/Contact";
import { Gallery } from "./components/Apps/Gallery";
import NotificationSystem from "./components/OS/NotificationSystem";
import BottomNav from "./components/OS/BottomNav";
import { useSwipe } from "./hooks/useSwipe";
import { useHaptics } from "./hooks/useHaptics";
import { apps } from "./config/apps";
import Skills from "./components/Apps/Skills";
import { useWallpaper } from "./context/WallpaperContext";

function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [folderOrigin, setFolderOrigin] = useState<DOMRect | null>(null);
  const { triggerHaptic } = useHaptics();
  const { wallpaper } = useWallpaper();

  const handleUnlock = () => {
    triggerHaptic();
    setIsLocked(false);
  };

  const handleAppClick = (appId: string, origin?: DOMRect) => {
    triggerHaptic([5]);
    const appConfig = apps.find((app) => app.id === appId);
    if (appConfig?.type === "folder") {
      setActiveAppId(null);
      setActiveFolderId(appId);
      setFolderOrigin(origin ?? null);
      return;
    }

    setActiveFolderId(null);
    setFolderOrigin(null);
    setActiveAppId(appId);
  };

  const handleCloseApp = () => {
    setActiveAppId(null);
  };

  const handleCloseFolder = () => {
    setActiveFolderId(null);
    setFolderOrigin(null);
  };

  const handleHome = () => {
    if (activeAppId) {
      handleCloseApp();
    }
    if (activeFolderId) {
      handleCloseFolder();
    }
    // Could also reset HomeScreen to index 0 here if needed
  };

  const handleBack = () => {
    if (activeAppId) {
      handleCloseApp();
    }
    if (activeFolderId) {
      handleCloseFolder();
    }
    // Could add navigation history here
  };

  const handleOptions = () => {
    triggerHaptic();
    setActiveFolderId(null);
    setFolderOrigin(null);
    setActiveAppId((prev) => (prev === "settings" ? null : "settings"));
  };

  const swipeHandlers = useSwipe({
    onSwipeUp: isLocked ? handleUnlock : undefined,
  });

  const getAppContent = (id: string) => {
    switch (id) {
      case "chat":
        return <Chat />;
      case "camera":
        return <Camera onOpenGallery={() => setActiveAppId("gallery")} />;
      case "about":
        return <About />;
      case "projects":
        return <AppStore />;
      case "skills":
        return <Skills />;
      case "gallery":
        return <Gallery />;
      case "contact":
        return <Contact />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div className="p-5 text-white">Content for {id} coming soon...</div>
        );
    }
  };

  const activeAppConfig = apps.find((app) => app.id === activeAppId);
  const activeFolderConfig = apps.find((app) => app.id === activeFolderId);

  return (
    <div
      className="w-full h-full bg-cover bg-center relative overflow-hidden transition-all duration-700"
      style={{ backgroundImage: `url(${wallpaper})` }}
      {...(isLocked ? swipeHandlers : {})}
    >
      <Analytics />
      <AnimatePresence>
        {isLocked && <LockScreen onUnlock={handleUnlock} />}
      </AnimatePresence>

      {!isLocked && (
        <>
          <motion.div
            animate={{ opacity: activeFolderId ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 ${
              activeFolderId ? "pointer-events-none" : ""
            }`}
          >
            <HomeScreen onAppClick={handleAppClick} />
          </motion.div>
          <AnimatePresence>
            {activeAppId && activeAppConfig && (
              <AppWindow app={activeAppConfig} onClose={handleCloseApp}>
                {getAppContent(activeAppId)}
              </AppWindow>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {activeFolderId && activeFolderConfig && (
              <FolderView
                folder={activeFolderConfig}
                origin={folderOrigin}
                onClose={handleCloseFolder}
                onAppClick={(appId) => {
                  handleCloseFolder();
                  handleAppClick(appId);
                }}
              />
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
