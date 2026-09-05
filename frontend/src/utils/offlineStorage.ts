// src/utils/offlineStorage.ts
import { api } from '../services/api';

const DB_NAME = 'GramSwasthyaOfflineDB';
const STORE_NAME = 'pending_requests';

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const queueOfflineRequest = async (endpoint: string, payload: any) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.add({ endpoint, payload, timestamp: new Date().toISOString() });
  console.log(`[OfflineSync] Queued action locally for ${endpoint}`);
};

export const syncOfflineRequests = async () => {
  if (!navigator.onLine) return;

  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const getAllRequest = store.getAll();

  getAllRequest.onsuccess = async () => {
    const requests = getAllRequest.result;
    if (requests.length === 0) return;

    console.log(`[OfflineSync] Flushing ${requests.length} offline actions to Django backend...`);

    for (const req of requests) {
      try {
        await api.post(req.endpoint, req.payload);
        const deleteTx = db.transaction(STORE_NAME, 'readwrite');
        deleteTx.objectStore(STORE_NAME).delete(req.id);
      } catch (err) {
        console.error(`[OfflineSync] Failed to sync request ID ${req.id}:`, err);
      }
    }
  };
};

window.addEventListener('online', () => {
  console.log('[Network] Internet connection restored. Triggering offline queue sync...');
  syncOfflineRequests();
});