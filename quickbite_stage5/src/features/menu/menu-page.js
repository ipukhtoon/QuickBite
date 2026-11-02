import { bottomNav } from '../../components/bottom-nav.js';
import { normalizeCatalog, filterCatalog } from '../../services/catalog.js';

function escape(s) { return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function money(n) { return `Rs ${Number(n).toLocaleString('en-PK', { maximumFractionDigits: 2 })}`; }
function card(p) { return `<article class="food-card"><a class="food-card__image" href="#/product?id=${encodeURIComponent(p.id)}" aria-label="View ${escape(p.name)}">${p.imageUrl ? `<img src="${escape(p.imageUrl)}" alt="${escape(p.name)}" loading="lazy">` : '<span>Photo coming soon</span>'}</a><div class="food-card__body"><h3>${escape(p.name)}</h3><p>${escape(p.description)}</p><div class="food-card__foot"><strong>${money(p.price)}</strong><a href="#/product?id=${encodeURIComponent(p.id)}" aria-label="View ${escape(p.name)}">View <span aria-hidden="true">↗</span></a></div></div></article>`; }
export function menuPage(source = { products: [], categories: [] }) {
  const { products, categories } = normalizeCatalog(source.products, source.categories);
  return `<main class="store-page" id="main-content"><header class="store-header"><a class="back-link" href="#/home">← <span>Home</span></a><a class="brand brand--compact" href="#/home" aria-label="QuickBite home"><span class="brand__mark" aria-hidden="true"><i></i><i></i><i></i></span><span class="brand__word">Quick<span>Bite</span></span></a><a class="icon-action" href="#/cart" aria-label="Open cart">♧</a></header>
  <section class="menu-intro"><p class="eyebrow">FRESHLY PREPARED</p><h1>Our <em>menu</em></h1><p>Find something you'll love.</p></section>
  <form class="store-search" id="menu-search" role="search"><label class="sr-only" for="menu-query">Search menu items</label><span aria-hidden="true">⌕</span><input id="menu-query" name="q" type="search" placeholder="Search dishes, flavours..." autocomplete="off"><button type="submit">Search</button></form>
  <div class="menu-filters" role="group" aria-label="Filter by category"><button type="button" class="filter-chip is-active" data-category="all" aria-pressed="true">All items</button>${categories.map((c) => `<button type="button" class="filter-chip" data-category="${escape(c.id)}" aria-pressed="false">${escape(c.name)}</button>`).join('')}</div>
  <div class="menu-results-head"><h2 id="menu-results-title">All items</h2><span id="menu-result-count" aria-live="polite">${products.filter(p=>p.available).length} items</span></div>
  <section class="food-grid" id="menu-products" aria-labelledby="menu-results-title">${renderResults(products, '', 'all')}</section>
  ${bottomNav('menu')}</main>`;
}
function renderResults(products, query, category) {
  const found = filterCatalog(products, { query, categoryId: category });
  if (found.length) return found.map(card).join('');
  if (!products.some((p) => p.available)) return `<div class="catalog-empty catalog-empty--wide"><span class="catalog-empty__icon" aria-hidden="true">✦</span><h3>Menu coming soon</h3><p>We're preparing the restaurant's menu. No dishes or prices are available just yet.</p><a class="button button--secondary" href="#/home">Back home</a></div>`;
  return `<div class="catalog-empty catalog-empty--wide"><span class="catalog-empty__icon" aria-hidden="true">⌕</span><h3>No dishes found</h3><p>Try another search or choose a different category.</p><button class="button button--secondary" type="button" data-reset-filters>Clear filters</button></div>`;
}
export function bindMenuPage(source = { products: [], categories: [] }) {
  const catalog = normalizeCatalog(source.products, source.categories);
  const form = document.querySelector('#menu-search');
  const input = document.querySelector('#menu-query');
  const grid = document.querySelector('#menu-products');
  const title = document.querySelector('#menu-results-title');
  const count = document.querySelector('#menu-result-count');
  const chips = [...document.querySelectorAll('[data-category]')];
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
  let category = categoriesContains(catalog.categories, params.get('category')) ? params.get('category') : 'all';
  input.value = params.get('q') ?? '';
  function update() {
    const filtered = filterCatalog(catalog.products, { query: input.value, categoryId: category });
    grid.innerHTML = renderResults(catalog.products, input.value, category);
    title.textContent = category === 'all' ? (input.value ? 'Search results' : 'All items') : (catalog.categories.find(c => c.id === category)?.name ?? 'All items');
    count.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`;
    chips.forEach((chip) => { const active = chip.dataset.category === category; chip.classList.toggle('is-active', active); chip.setAttribute('aria-pressed', String(active)); });
  }
  input.addEventListener('input', update);
  form.addEventListener('submit', (e) => e.preventDefault());
  chips.forEach((chip) => chip.addEventListener('click', () => { category = chip.dataset.category; update(); }));
  grid.addEventListener('click', (e) => { if (e.target.closest('[data-reset-filters]')) { category = 'all'; input.value = ''; update(); input.focus(); } });
  update();
}
function categoriesContains(categories, id) { return !!id && categories.some((c) => c.id === id); }
