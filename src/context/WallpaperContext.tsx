"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSetting, setSetting } from "../lib/db";

const STORAGE_KEY = "wallpaper";
const DEFAULT_WALLPAPER =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

interface WallpaperContextType {
  wallpaper: string;
  type: "image" | "video";
  loading: boolean;
  setWallpaper: (source: Blob | string) => Promise<boolean>;
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

export const WallpaperProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallpaper, setWallpaperState] = useState<string>(DEFAULT_WALLPAPER);
  const [type, setType] = useState<"image" | "video">("image");
  const [loading, setLoading] = useState(true);

  // Load wallpaper on mount
  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        const stored = await getSetting(STORAGE_KEY);
        if (stored) {
          // If stored is a Blob (from user upload/photos), create URL
          if (stored instanceof Blob) {
            setWallpaperState(URL.createObjectURL(stored));
            // Basic detection from blob type
            setType(stored.type.startsWith("video") ? "video" : "image");
          } else if (typeof stored === "string") {
            setWallpaperState(stored);
            setType("image");
          }
        }
      } catch (e) {
        console.error("Failed to load wallpaper:", e);
      } finally {
        setLoading(false);
      }
    };

    loadWallpaper();
  }, []);

  const setWallpaper = async (source: Blob | string) => {
    try {
      // Save deep copy/blob to DB
      await setSetting(STORAGE_KEY, source);

      // Update local state immediately
      if (source instanceof Blob) {
        setWallpaperState(URL.createObjectURL(source));
        setType(source.type.startsWith("video") ? "video" : "image");
      } else {
        setWallpaperState(source);
        setType("image");
      }
      return true;
    } catch (e) {
      console.error("Failed to set wallpaper:", e);
      return false;
    }
  };

  return (
    <WallpaperContext.Provider value={{ wallpaper, type, loading, setWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (context === undefined) {
    throw new Error("useWallpaper must be used within a WallpaperProvider");
  }
  return context;
};
