/** Catalog boundary. Firebase/IndexedDB adapters can be added without changing screens. */
export function normalizeCatalog(products = [], categories = []) {
  return {
    products: Array.isArray(products) ? products.filter(isUsableProduct).map((p) => ({
      id: String(p.id), name: String(p.name).trim(), description: String(p.description ?? ''),
      price: Number(p.price), imageUrl: safeImageUrl(p.imageUrl), categoryId: p.categoryId ? String(p.categoryId) : '',
      available: p.available !== false, featured: p.featured === true, options: Array.isArray(p.options) ? p.options : []
    })) : [],
    categories: Array.isArray(categories) ? categories.filter((c) => c && c.id && c.name).map((c) => ({ id: String(c.id), name: String(c.name).trim(), imageUrl: safeImageUrl(c.imageUrl) })) : []
  };
}

function isUsableProduct(p) {
  return p && p.id != null && typeof p.name === 'string' && p.name.trim() && Number.isFinite(Number(p.price)) && Number(p.price) >= 0;
}

function safeImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try { const url = new URL(value, globalThis.location?.origin ?? 'https://quickbite.invalid'); return ['https:', 'http:'].includes(url.protocol) ? value : ''; }
  catch { return ''; }
}

export function filterCatalog(products, { query = '', categoryId = 'all', availableOnly = true } = {}) {
  const q = String(query).trim().toLocaleLowerCase();
  return products.filter((p) => (!availableOnly || p.available) && (categoryId === 'all' || p.categoryId === categoryId) && (!q || `${p.name} ${p.description}`.toLocaleLowerCase().includes(q)));
}
