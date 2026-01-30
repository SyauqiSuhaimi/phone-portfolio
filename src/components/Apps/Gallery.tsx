"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Info, Heart, Play, Trash2 } from "lucide-react";
import { useGallery, type GalleryItem } from "../../hooks/useGallery";

export const Gallery = () => {
  const { items: images, loading, removeMedia } = useGallery();
  const [selectedImage, setSelectedImage] = useState<{ src: string; index: number; type: 'image' | 'video'; id: number } | null>(null);

  return (
    <div className="h-full flex flex-col text-gray-900 dark:text-white relative font-sans select-none">
      {/* Header */}
      <div className="absolute top-0 inset-x-0 h-16 backdrop-blur-xl z-10 flex items-center justify-between px-6 border-b border-black/5 dark:border-white/5">
        <div>
          <h2 className="text-lg font-semibold tracking-wide">Gallery</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
            {loading ? "Loading..." : `${images.length} Items`}
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-20 pb-10 px-4 scrollbar-hide">
        {images.length === 0 && !loading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-zinc-500">
             <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center mb-4">
                <Info size={24} className="opacity-50" />
             </div>
            <p className="text-sm font-medium">No media yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`image-${item.id}`}
                onClick={() => setSelectedImage({ src: item.url, index, type: item.type, id: item.id })}
                className="aspect-square relative overflow-hidden rounded-xl cursor-pointer group bg-gray-100 dark:bg-zinc-900"
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full relative">
                    <video 
                      src={item.url} 
                      className="w-full h-full object-cover" 
                      muted 
                      playsInline 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                        <Play size={16} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex flex-col bg-black"
          >
             {/* Lightbox Header */}
            <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-end px-4 z-20 bg-gradient-to-b from-black/60 to-transparent">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Main Image */}
            <div 
                className="flex-1 flex items-center justify-center p-2 cursor-grab active:cursor-grabbing"
                onClick={() => setSelectedImage(null)}
            >
                 <motion.div
                    layoutId={`image-${selectedImage.id}`}
                    className="w-full h-full flex items-center justify-center"
                    drag
                    dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={(_, info) => {
                        const swipeId = info.offset.y;
                        const swipeX = info.offset.x;
                        const threshold = 100;

                        // Vertical swipe to close
                        if (Math.abs(swipeId) > threshold) {
                            setSelectedImage(null);
                            return;
                        }

                        // Horizontal swipe to navigate
                        if (Math.abs(swipeX) > threshold) {
                            if (swipeX > 0) {
                                // Swipe Right -> Previous
                                if (selectedImage.index > 0) {
                                    const prevItem = images[selectedImage.index - 1];
                                    setSelectedImage({ 
                                      src: prevItem.url, 
                                      index: selectedImage.index - 1,
                                      type: prevItem.type,
                                      id: prevItem.id
                                    });
                                }
                            } else {
                                // Swipe Left -> Next
                                if (selectedImage.index < images.length - 1) {
                                    const nextItem = images[selectedImage.index + 1];
                                    setSelectedImage({ 
                                      src: nextItem.url, 
                                      index: selectedImage.index + 1,
                                      type: nextItem.type,
                                      id: nextItem.id
                                    });
                                }
                            }
                        }
                    }}
                 >
                    {selectedImage.type === 'video' ? (
                      <video 
                        src={selectedImage.src} 
                        className="max-w-full max-h-full shadow-2xl" 
                        controls 
                        autoPlay 
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <img
                        src={selectedImage.src}
                        alt="Selected"
                        className="max-w-full max-h-full object-contain shadow-2xl select-none pointer-events-none"
                      />
                    )}
                 </motion.div>
            </div>

            {/* Lightbox Footer */}
             <div 
                className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-around pb-4 z-20"
                onClick={(e) => e.stopPropagation()} 
             >
                <button className="p-3 text-white/80 hover:text-white transition-colors flex flex-col items-center gap-1 group">
                    <Share2 size={20} className="group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-medium">Share</span>
                </button>
                 <button className="p-3 text-white/80 hover:text-pink-500 transition-colors flex flex-col items-center gap-1 group">
                     <Heart size={20} className="group-hover:fill-current group-hover:scale-110 transition-transform" />
                     <span className="text-[10px] font-medium">Favorite</span>
                 </button>
                 <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this item?')) {
                        removeMedia(selectedImage.id);
                        setSelectedImage(null);
                      }
                    }}
                    className="p-3 text-white/80 hover:text-red-500 transition-colors flex flex-col items-center gap-1 group"
                 >
                     <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                     <span className="text-[10px] font-medium">Delete</span>
                 </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
