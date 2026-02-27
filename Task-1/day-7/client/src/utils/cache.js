const DB_NAME = 'searchpoint-cache';
const DB_VERSION = 1;
const STORE_NAME = 'cache';
const METADATA_STORE = 'metadata';

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!database.objectStoreNames.contains(METADATA_STORE)) {
        database.createObjectStore(METADATA_STORE, { keyPath: 'key' });
      }
    };
  });
};

export const cacheData = async (key, data, type = 'data') => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const cacheEntry = {
      key,
      data: typeof data === 'string' ? data : JSON.stringify(data),
      type,
      timestamp: Date.now()
    };

    store.put(cacheEntry);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Cache write error:', error);
    return false;
  }
};

export const getCachedData = async (key) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        if (request.result) {
          try {
            resolve(JSON.parse(request.result.data));
          } catch {
            resolve(request.result.data);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

export const hasCachedData = async (key) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return false;
  }
};

export const clearCache = async (type = null) => {
  try {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    if (type) {
      const index = store.index('type');
      const request = index.openCursor(IDBKeyRange.only(type));
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } else {
      store.clear();
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

export const getCacheMetadata = async (key) => {
  try {
    const database = await openDB();
    const tx = database.transaction(METADATA_STORE, 'readonly');
    const store = tx.objectStore(METADATA_STORE);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return null;
  }
};

export const setCacheMetadata = async (key, metadata) => {
  try {
    const database = await openDB();
    const tx = database.transaction(METADATA_STORE, 'readwrite');
    const store = tx.objectStore(METADATA_STORE);

    store.put({ key, ...metadata, updatedAt: Date.now() });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    return false;
  }
};

export default {
  cacheData,
  getCachedData,
  hasCachedData,
  clearCache,
  getCacheMetadata,
  setCacheMetadata
};
