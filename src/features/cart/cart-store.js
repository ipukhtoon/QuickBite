const DB_NAME = 'quickbite-local';
const DB_VERSION = 1;
const STORE_NAME = 'cart';
const CART_KEY = 'active-cart';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB is not available in this browser.')); return; }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open local cart storage.'));
  });
}

export class CartStore {
  constructor(db) { this.db = db; }
  static async create() { return new CartStore(await openDatabase()); }
  async read() {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(CART_KEY);
      request.onsuccess = () => resolve(Array.isArray(request.result) ? request.result : []);
      request.onerror = () => reject(request.error || new Error('Could not read cart.'));
    });
  }
  async write(lines) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(lines, CART_KEY);
      tx.oncomplete = () => resolve(lines);
      tx.onerror = () => reject(tx.error || new Error('Could not save cart.'));
      tx.onabort = () => reject(tx.error || new Error('Cart save was cancelled.'));
    });
  }
  async add(product) {
    const lines = await this.read();
    const existing = lines.find((line) => line.productId === product.id);
    if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
    else lines.push({ productId: product.id, name: product.name, description: product.description, priceMinor: product.priceMinor, image: product.image, quantity: 1 });
    return this.write(lines);
  }
  async setQuantity(productId, quantity) {
    const lines = await this.read();
    const line = lines.find((item) => item.productId === productId);
    if (!line) return lines;
    if (!Number.isInteger(quantity) || quantity < 1) return this.remove(productId);
    line.quantity = Math.min(99, quantity);
    return this.write(lines);
  }
  async remove(productId) { return this.write((await this.read()).filter((line) => line.productId !== productId)); }
  async clear() { return this.write([]); }
}
