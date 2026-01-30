import { openDB, type DBSchema } from 'idb';
import { loadGalleryImages } from './galleryStorage';

interface PortfolioDB extends DBSchema {
  gallery: {
    key: number;
    value: {
      id?: number;
      blob: Blob;
      type: 'image' | 'video';
      createdAt: number;
    };
    indexes: { 'by-date': number };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'os-portfolio-db';
const STORE_NAME = 'gallery';

const getDB = async () => {
  return openDB<PortfolioDB>(DB_NAME, 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-date', 'createdAt');
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });
};

export const initDB = async () => {
  const db = await getDB();

  // Check if we need to migrate from localStorage
  const count = await db.count(STORE_NAME);
  if (count === 0) {
    const legacyImages = loadGalleryImages();
    if (legacyImages.length > 0) {
      console.log('Migrating legacy images to IndexedDB...');
      
      const blobsToSave: { blob: Blob; type: 'image' | 'video'; createdAt: number }[] = [];

      // Fetch all blobs first (outside transaction)
      for (const imgUrl of legacyImages) {
        // Skip default wallpaper if it causes issues, or handle it
        if (imgUrl.startsWith('http')) continue; 
        
        try {
          const response = await fetch(imgUrl);
          const blob = await response.blob();
          blobsToSave.push({
            blob,
            type: 'image',
            createdAt: Date.now(),
          });
        } catch (e) {
          console.error('Failed to migrate image:', e);
        }
      }

      // Now save to DB in one transaction
      if (blobsToSave.length > 0) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        for (const item of blobsToSave) {
          tx.store.add(item);
        }
        await tx.done;
      }
      console.log('Migration complete');
    }
  }

  return db;
};

export const getGalleryItems = async () => {
  const db = await getDB();
  return db.getAllFromIndex(STORE_NAME, 'by-date');
};

export const saveMedia = async (blob: Blob, type: 'image' | 'video') => {
  const db = await getDB();
  return db.add(STORE_NAME, {
    blob,
    type,
    createdAt: Date.now(),
  });
};

export const deleteMedia = async (id: number) => {
  const db = await getDB();
  return db.delete(STORE_NAME, id);
};

export const getSetting = async (key: string) => {
  const db = await getDB();
  return db.get('settings', key);
};

export const setSetting = async (key: string, value: any) => {
  const db = await getDB();
  return db.put('settings', value, key);
};
