"use client";

const STORAGE_KEY = "os-portfolio.gallery";
const DEFAULT_WALLPAPER =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

export const loadGalleryImages = () => {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") {
      return [parsed];
    }
    if (Array.isArray(parsed)) {
      const items = parsed.filter((item) => typeof item === "string");
      if (!items.includes(DEFAULT_WALLPAPER)) {
        items.push(DEFAULT_WALLPAPER);
      }
      return items;
    }
  } catch {
    if (raw.startsWith("data:image/")) {
      return raw === DEFAULT_WALLPAPER ? [raw] : [raw, DEFAULT_WALLPAPER];
    }
    return [];
  }

  return [DEFAULT_WALLPAPER];
};

export const saveGalleryImage = (dataUrl: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const existing = loadGalleryImages();
  const next = [dataUrl, ...existing].slice(0, 60);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
