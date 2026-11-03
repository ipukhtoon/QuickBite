const DB_NAME = 'quickbite-local';
const DB_VERSION = 1;
const STORES = ['cart','menu-cache','preferences','pending-orders'];
let opening;
export function openDatabase() {
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of STORES) if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return opening;
}
export async function getLocal(store, id) {
  const db = await openDatabase();
  return new Promise((resolve,reject) => {
    const req = db.transaction(store).objectStore(store).get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}
export async function putLocal(store, value) {
  const db = await openDatabase();
  return new Promise((resolve,reject) => {
    const req = db.transaction(store,'readwrite').objectStore(store).put(value);
    req.onsuccess = () => resolve(value);
    req.onerror = () => reject(req.error);
  });
}