const DB_NAME = 'quickbite-local';
const DB_VERSION = 1;
const STORE = 'cartItems';

function openCartDB() {
  if (!globalThis.indexedDB) return Promise.reject(new Error('Local cart storage is unavailable in this browser.'));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'lineId' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local cart storage.'));
  });
}

const toPaisa = (rupees) => Math.round(Number(rupees) * 100);
export const formatPKR = (paisa) => `Rs ${(Number(paisa) / 100).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function cartLineId(productId, selections = []) {
  return `${productId}::${selections.map((s) => `${s.groupId}=${s.optionId}`).sort().join('|')}`;
}

export function normalizeCartLine(item) {
  if (!item || typeof item.lineId !== 'string' || typeof item.productId !== 'string' || typeof item.name !== 'string') return null;
  const basePrice = Number(item.basePrice);
  const unitPrice = Number(item.unitPrice);
  const quantity = Number(item.quantity);
  if (!Number.isFinite(basePrice) || basePrice < 0 || !Number.isFinite(unitPrice) || unitPrice < basePrice || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null;
  const selections = Array.isArray(item.selections) ? item.selections.filter(s => s && typeof s.groupId === 'string' && typeof s.optionId === 'string' && typeof s.groupName === 'string' && typeof s.optionName === 'string' && Number.isFinite(Number(s.priceDelta)) && Number(s.priceDelta) >= 0).map(s => ({ groupId:s.groupId, optionId:s.optionId, groupName:s.groupName, optionName:s.optionName, priceDelta:Number(s.priceDelta) })) : [];
  return { lineId:item.lineId, productId:item.productId, name:item.name, imageUrl:typeof item.imageUrl === 'string' ? item.imageUrl : '', basePrice, unitPrice, selections, quantity, currency:'PKR', addedAt:item.addedAt ?? null };
}

export function calculateCartTotals(items = []) {
  const valid = items.map(normalizeCartLine).filter(Boolean);
  const subtotalPaisa = valid.reduce((sum, item) => sum + toPaisa(item.unitPrice) * item.quantity, 0);
  return { itemCount:valid.reduce((sum, item) => sum + item.quantity, 0), lineCount:valid.length, subtotalPaisa };
}

export async function addCartItem(item) {
  const normalized = normalizeCartLine(item);
  if (!normalized) throw new Error('This item has invalid price or quantity details. Please try again.');
  const db = await openCartDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const get = store.get(normalized.lineId);
    get.onsuccess = () => {
      const previous = normalizeCartLine(get.result);
      const quantity = (previous?.quantity ?? 0) + normalized.quantity;
      if (quantity > 99) { tx.abort(); return; }
      store.put({ ...normalized, quantity, addedAt: previous?.addedAt ?? new Date().toISOString() });
    };
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = tx.onabort = () => { db.close(); reject(tx.error ?? new Error('Could not save this item. A maximum of 99 per item is allowed.')); };
  });
}

export async function getCartItems() {
  const db = await openCartDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve((request.result ?? []).map(normalizeCartLine).filter(Boolean));
    request.onerror = () => reject(request.error ?? new Error('Could not read your cart.'));
    tx.oncomplete = () => db.close();
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error('Could not read your cart.')); };
  });
}

export async function updateCartQuantity(lineId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Quantity must be between 1 and 99.');
  const db = await openCartDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const request = store.get(lineId);
    request.onsuccess = () => {
      const item = normalizeCartLine(request.result);
      if (!item) { tx.abort(); return; }
      store.put({ ...item, quantity });
    };
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = tx.onabort = () => { db.close(); reject(tx.error ?? new Error('Could not update this item.')); };
  });
}

export async function removeCartItem(lineId) {
  const db = await openCartDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(lineId);
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = tx.onabort = () => { db.close(); reject(tx.error ?? new Error('Could not remove this item.')); };
  });
}
