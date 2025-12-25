"use client";

import { useEffect, useState } from "react";
import { loadGalleryImages } from "../../lib/galleryStorage";

export const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    setImages(loadGalleryImages());
  }, []);

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-3">Gallery</h2>
      <p className="text-os-text-muted mb-5">Photos and memories.</p>
      {images.length === 0 ? (
        <div className="rounded-xl bg-white/10 p-4 text-sm text-white/80">
          No photos yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="aspect-square rounded-xl overflow-hidden bg-black/50"
            >
              <img
                src={src}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
