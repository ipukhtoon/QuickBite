import { bottomNav } from '../../components/bottom-nav.js';
import { normalizeCatalog, filterCatalog } from '../../services/catalog.js';

const empty = (title, text) => `<div class="catalog-empty"><span class="catalog-empty__icon" aria-hidden="true">✦</span><h3>${title}</h3><p>${text}</p></div>`;
function productCard(p) { return `<article class="food-card"><div class="food-card__image">${p.imageUrl ? `<img src="${escapeAttr(p.imageUrl)}" alt="${escapeAttr(p.name)}" loading="lazy">` : '<span aria-hidden="true">Photo coming soon</span>'}</div><div class="food-card__body"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p><div class="food-card__foot"><strong>${formatMoney(p.price)}</strong><a href="#/product?id=${encodeURIComponent(p.id)}" aria-label="View ${escapeAttr(p.name)}">View <span aria-hidden="true">↗</span></a></div></div></article>`; }
export function homePage(source = { products: [], categories: [] }) {
  const catalog = normalizeCatalog(source.products, source.categories);
  const featured = catalog.products.filter((p) => p.available && p.featured).slice(0, 4);
  const categories = catalog.categories;
  return `<main class="store-page" id="main-content">
    <header class="store-header"><a class="brand brand--compact" href="#/home" aria-label="QuickBite home"><span class="brand__mark" aria-hidden="true"><i></i><i></i><i></i></span><span class="brand__word">Quick<span>Bite</span></span></a><div class="store-header__actions"><span class="guest-chip">Guest</span><a class="icon-action" href="#/cart" aria-label="Open cart">♧</a></div></header>
    <section class="home-hero" aria-labelledby="home-title"><div class="home-hero__copy"><p class="eyebrow">MADE FRESH, JUST FOR YOU</p><h1 id="home-title">Good food.<br><em>Good mood.</em></h1><p>Discover your next favourite bite.</p><a class="button button--primary" href="#/menu">Explore menu <span aria-hidden="true">→</span></a></div><div class="home-hero__art" aria-hidden="true"><span>QB</span></div></section>
    <form class="store-search" id="home-search" role="search"><label class="sr-only" for="home-query">Search the menu</label><span aria-hidden="true">⌕</span><input id="home-query" name="q" type="search" placeholder="Search dishes, flavours..." autocomplete="off"><button type="submit">Search</button></form>
    <section class="store-section" aria-labelledby="categories-title"><div class="section-heading"><div><p class="eyebrow">FIND YOUR CRAVING</p><h2 id="categories-title">Categories</h2></div><a href="#/menu">See all</a></div><div class="category-row">${categories.length ? categories.map((c) => `<a class="category-tile" href="#/menu?category=${encodeURIComponent(c.id)}">${c.imageUrl ? `<img src="${escapeAttr(c.imageUrl)}" alt="" loading="lazy">` : '<span aria-hidden="true">✦</span>'}<b>${escapeHtml(c.name)}</b></a>`).join('') : empty('Categories are on the way','Our restaurant menu is being prepared. Please check back soon.')}</div></section>
    <section class="store-section" aria-labelledby="popular-title"><div class="section-heading"><div><p class="eyebrow">THE CROWD FAVOURITES</p><h2 id="popular-title">Popular items</h2></div><a href="#/menu">View menu</a></div><div class="food-grid food-grid--horizontal">${featured.length ? featured.map(productCard).join('') : empty('Fresh favourites coming soon','Popular dishes will appear here when the restaurant menu is connected.')}</div></section>
    <section class="home-secondary"><div><p class="eyebrow">A LITTLE SOMETHING SPECIAL</p><h2>Made with care.<br>Served with flavour.</h2><p>Explore the menu and find something delicious.</p><a href="#/menu">Browse the menu <span aria-hidden="true">→</span></a></div><span class="home-secondary__seal" aria-hidden="true">QB<br>FRESH</span></section>
    ${`<div class="demo-journey-links"><a href="#/tracking">Tracking UI preview</a><a href="#/admin">Restaurant admin preview</a></div>`}${bottomNav('home')}</main>`;
}
export function bindHomePage() {
  const form = document.querySelector('#home-search');
  form?.addEventListener('submit', (e) => { e.preventDefault(); const q = form.elements.q.value.trim(); window.location.hash = `/menu${q ? `?q=${encodeURIComponent(q)}` : ''}`; });
}
function formatMoney(value) { return `Rs ${Number(value).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const escapeAttr = escapeHtml;
