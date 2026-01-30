"use client";

const STORAGE_KEY = "os-portfolio.gallery";
const DEFAULT_WALLPAPER =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

const PROJECT_IMAGES = [
  "/projects/fms.png",
  "/projects/wise2.png",
  "/projects/aoikumo.png",
  "/projects/nft3.png",
  "/projects/basicimageeditor.png",
];

export const loadGalleryImages = () => {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  
  // Combine defaults
  const defaults = [...PROJECT_IMAGES, DEFAULT_WALLPAPER];

  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw);
    
    // Legacy support for single string
    if (typeof parsed === "string") {
      const upgraded = [parsed, ...defaults];
       window.localStorage.setItem(STORAGE_KEY, JSON.stringify(upgraded));
      return upgraded;
    }

    if (Array.isArray(parsed)) {
      // Filter valid strings
      let items = parsed.filter((item) => typeof item === "string");
      
      // Ensure all project images are present (deduplicated)
      const missingProjects = PROJECT_IMAGES.filter(img => !items.includes(img));
      if (missingProjects.length > 0) {
        items = [...items, ...missingProjects];
        // Optional: Update storage to sync
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }

      // Ensure default wallpaper is present
       if (!items.includes(DEFAULT_WALLPAPER)) {
        items.push(DEFAULT_WALLPAPER);
      }
      
      return items;
    }
  } catch {
    // Corrupt data, reset
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }

  return defaults;
};

export const saveGalleryImage = (dataUrl: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const existing = loadGalleryImages();
  // Avoid duplicates when saving
  const next = [dataUrl, ...existing.filter(i => i !== dataUrl)].slice(0, 60);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
