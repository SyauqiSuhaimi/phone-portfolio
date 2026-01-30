import { useEffect, useState, useCallback } from 'react';
import { initDB, getGalleryItems, saveMedia, deleteMedia } from '../lib/db';

export type GalleryItem = {
  id: number;
  url: string;
  type: 'image' | 'video';
  createdAt: number;
};

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      await initDB();
      const rawItems = await getGalleryItems();
      
      // Create object URLs for blobs
      const formattedItems = rawItems.reverse().map(item => ({
        id: item.id!,
        url: URL.createObjectURL(item.blob),
        type: item.type,
        createdAt: item.createdAt,
      }));
      
      setItems(formattedItems);
    } catch (error) {
      console.error('Failed to load gallery items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();

    // Cleanup URLs on unmount
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addMedia = async (blob: Blob, type: 'image' | 'video') => {
    try {
      await saveMedia(blob, type);
      await loadItems(); // Reload to get new item with ID
    } catch (error) {
      console.error('Failed to save media:', error);
    }
  };

  const removeMedia = async (id: number) => {
    try {
      await deleteMedia(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  return { items, loading, addMedia, removeMedia };
};
