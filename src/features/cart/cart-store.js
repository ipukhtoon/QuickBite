const DB_NAME = 'quickbite-local';
const DB_VERSION = 1;
const STORE_NAME = 'cart';
const CART_KEY = 'active-cart';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open local cart storage.'));
  });
}

function makeLineKey(productId, optionIds = []) {
  return productId + '::' + [...optionIds].sort().join('|');
}

export class CartStore {
  constructor(db) {
    this.db = db;
    this.mutations = Promise.resolve();
  }

  static async create() {
    return new CartStore(await openDatabase());
  }

  runMutation(operation) {
    const task = this.mutations.then(operation);
    this.mutations = task.catch(() => {});
    return task;
  }

  async read() {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(CART_KEY);
      request.onsuccess = () => {
        const saved = Array.isArray(request.result) ? request.result : [];
        const normalized = saved.map((line) => {
          const optionIds = Array.isArray(line.optionIds) ? line.optionIds : [];
          return {
            ...line,
            optionIds,
            options: Array.isArray(line.options) ? line.options : [],
            optionSummary: line.optionSummary || '',
            currencyCode: line.currencyCode || null,
            lineKey: line.lineKey || makeLineKey(line.productId, optionIds),
          };
        });
        resolve(normalized);
      };
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

  add(product) {
    return this.runMutation(async () => {
      const lines = await this.read();
      const optionIds = Array.isArray(product.optionIds) ? product.optionIds : [];
      const lineKey = makeLineKey(product.id, optionIds);
      const existing = lines.find((line) => line.lineKey === lineKey);
      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + 1);
        existing.name = product.name;
        existing.description = product.description || '';
        existing.priceMinor = product.priceMinor;
        existing.currencyCode = product.currencyCode || null;
        existing.image = product.image || '';
        existing.options = Array.isArray(product.options) ? product.options : [];
        existing.optionSummary = product.optionSummary || '';
      } else {
        lines.push({
          lineKey,
          productId: product.id,
          optionIds,
          options: Array.isArray(product.options) ? product.options : [],
          optionSummary: product.optionSummary || '',
          name: product.name,
          description: product.description || '',
          priceMinor: product.priceMinor,
          currencyCode: product.currencyCode || null,
          image: product.image || '',
          quantity: 1,
        });
      }
      return this.write(lines);
    });
  }

  setQuantity(lineKey, quantity) {
    return this.runMutation(async () => {
      const lines = await this.read();
      const line = lines.find((item) => item.lineKey === lineKey);
      if (!line) return lines;
      if (!Number.isInteger(quantity) || quantity < 1) {
        return this.write(lines.filter((item) => item.lineKey !== lineKey));
      }
      line.quantity = Math.min(99, quantity);
      return this.write(lines);
    });
  }

  remove(lineKey) {
    return this.runMutation(async () => {
      const lines = await this.read();
      return this.write(lines.filter((line) => line.lineKey !== lineKey));
    });
  }

  clear() {
    return this.runMutation(async () => this.write([]));
  }
}
