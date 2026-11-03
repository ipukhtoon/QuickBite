import { currentRoute, navigate, subscribeRoute } from './router.js';
import { openDatabase } from '../database/indexeddb.js';
const screens = {
  welcome: ['Welcome','Good food. Great mood.','Your next favourite meal is just a few taps away.','Get started'],
  signin: ['Sign in','Welcome back','Sign in to continue your QuickBite experience.','Sign in'],
  signup: ['Create account','Join QuickBite','Create an account and make every meal easier.','Create account'],
  home: ['Home','Good food, delivered with love.','Discover something delicious today.','Explore menu'],
  menu: ['Our menu','Find your next favourite','Freshly prepared favourites, all in one place.','Browse menu'],
  product: ['Food details','Made fresh for you','Choose your options and make it yours.','Add to cart'],
  cart: ['Your cart','Almost there','Review your delicious picks.','Continue'],
  checkout: ['Checkout','Delivery details','Confirm your address and order details.','Place order'],
  tracking: ['Track order','Your order journey','Follow your order status here.','View order'],
  orders: ['My orders','Your recent orders','All your QuickBite orders in one place.','View orders'],
  admin: ['Admin dashboard','Restaurant overview','Manage orders and keep service moving.','Manage menu'],
  'manage-menu': ['Manage menu','Your menu, your way','Add, edit and organise restaurant items.','Add item']
};
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function render() {
  const route = currentRoute();
  const [eyebrow,title,description,action] = screens[route];
  const admin = ['admin','manage-menu'].includes(route);
  document.querySelector('#app').innerHTML = `
    <main class="qb-shell ${admin ? 'is-admin' : ''}">
      <header class="qb-header"><a class="qb-brand" href="#/home"><span class="qb-mark">Q</span><span>Quick<span>Bite</span></span></a><button class="icon-button" aria-label="Open account" data-go="signin">⌘</button></header>
      <section class="qb-content">
        <p class="eyebrow">${escapeHtml(eyebrow)}</p>
        <h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p>
        ${route === 'welcome' ? '<div class="hero-art" role="img" aria-label="Featured burger"><img src="./images/welcome-burger.webp" alt="Juicy grilled burger"></div>' : ''}
        ${route === 'signin' || route === 'signup' ? '<form class="qb-form"><label>Email address<input type="email" autocomplete="email" required placeholder="you@example.com"></label><label>Password<input type="password" autocomplete="current-password" minlength="8" required placeholder="Enter password"></label><button class="primary-button" type="submit">'+escapeHtml(action)+'</button></form>' : ''}
        ${route === 'menu' || route === 'home' ? '<div class="search"><span>⌕</span><input aria-label="Search menu" placeholder="Search dishes and more"></div><div class="category-row"><button class="chip active">All</button><button class="chip">Burgers</button><button class="chip">Pizza</button><button class="chip">Sides</button></div><div class="empty-state">Menu items will appear here when the restaurant menu is connected.</div>' : ''}
        ${route === 'cart' ? '<div class="empty-state">Your cart is empty. Explore the menu to add something delicious.</div>' : ''}
        ${route === 'orders' || route === 'tracking' ? '<div class="empty-state">Your order information will appear here after placing an order.</div>' : ''}
        ${route === 'admin' || route === 'manage-menu' ? '<div class="stat-grid"><article><small>Today orders</small><strong>—</strong></article><article><small>Revenue</small><strong>—</strong></article></div><div class="empty-state">Connect your restaurant account to load live data.</div>' : ''}
        ${!['signin','signup','menu','home','cart','orders','tracking','admin','manage-menu'].includes(route) ? '<button class="primary-button" data-primary>'+escapeHtml(action)+'</button>' : ''}
      </section>
      <nav class="bottom-nav" aria-label="Main navigation"><a href="#/home">⌂<small>Home</small></a><a href="#/menu">▦<small>Menu</small></a><a href="#/cart">▢<small>Cart</small></a><a href="#/orders">◷<small>Orders</small></a></nav>
    </main>`;
  document.querySelectorAll('[data-go]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.go)));
  document.querySelector('[data-primary]')?.addEventListener('click', () => navigate(route === 'welcome' ? 'signin' : route === 'product' ? 'cart' : route === 'checkout' ? 'tracking' : 'menu'));
  document.querySelector('.qb-form')?.addEventListener('submit', e => { e.preventDefault(); alert('Authentication will be enabled after Firebase configuration.'); });
}
export async function startApp() {
  try { await openDatabase(); } catch (error) { console.error('Local database unavailable', error); }
  render();
  subscribeRoute(render);
}