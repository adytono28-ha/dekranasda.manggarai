// IndexedDB Key-Value Storage Helper for persistent local storage of larger assets/settings
const DB_NAME = 'dekranasda_local_db';
const STORE_NAME = 'key_value_store';

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const dbStorage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => {
          resolve(request.result !== undefined ? (request.result as T) : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.warn('IndexedDB getItem failed, reverting to localStorage:', e);
      const val = localStorage.getItem(key);
      if (val) {
        try {
          return JSON.parse(val) as T;
        } catch (_) {
          return null;
        }
      }
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const db = await getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);
        request.onsuccess = () => {
          // Attempt a sync fallback to localStorage
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (_) {
            // Silently ignore localStorage QuotaExceededError since IndexedDB successfully saved it!
          }
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('IndexedDB setItem failed, falling back to localStorage:', e);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error('LocalStorage write failed as well:', err);
      }
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      const db = await getDB();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);
        request.onsuccess = () => {
          try {
            localStorage.removeItem(key);
          } catch (_) {}
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('IndexedDB removeItem failed:', e);
      try {
        localStorage.removeItem(key);
      } catch (_) {}
    }
  }
};
