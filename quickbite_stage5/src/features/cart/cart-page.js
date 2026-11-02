import { getCartItems, updateCartQuantity, removeCartItem, calculateCartTotals, formatPKR } from '../../services/cart.js';
import { bottomNav } from '../../components/bottom-nav.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeImage = (url) => { try { const u = new URL(url, window.location.href); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };

function emptyCart() {
  return `<section class="cart-empty"><span class="cart-empty__icon" aria-hidden="true">♧</span><p class="eyebrow">YOUR CART</p><h1>Your cart is waiting</h1><p>Add something delicious from the menu and it will appear here.</p><a class="button button--primary" href="#/menu">Explore menu</a></section>`;
}

export function cartPage(items = []) {
  if (!items.length) return `<main class="store-page cart-page" id="main-content"><header class="store-header"><a class="back-link" href="#/menu">← <span>Menu</span></a><a class="brand brand--compact" href="#/home"><span class="brand__word">Quick<span>Bite</span></span></a><span class="cart-header-label">YOUR CART</span></header>${emptyCart()}${bottomNav('menu')}</main>`;
  const totals = calculateCartTotals(items);
  return `<main class="store-page cart-page" id="main-content"><header class="store-header"><a class="back-link" href="#/menu">← <span>Continue shopping</span></a><a class="brand brand--compact" href="#/home"><span class="brand__word">Quick<span>Bite</span></span></a><span class="cart-header-label">${totals.itemCount} ITEMS</span></header><section class="cart-content"><div class="cart-title"><p class="eyebrow">REVIEW YOUR ORDER</p><h1>Your cart</h1><p>Check your items and customizations before checkout.</p></div><div class="cart-layout"><div class="cart-lines" aria-label="Cart items">${items.map(item => { const image = safeImage(item.imageUrl); return `<article class="cart-line" data-line-id="${esc(item.lineId)}"><div class="cart-line__image">${image ? `<img src="${esc(image)}" alt="${esc(item.name)}" loading="lazy">` : '<span aria-hidden="true">✦</span>'}</div><div class="cart-line__body"><div class="cart-line__top"><div><h2>${esc(item.name)}</h2><p class="cart-line__unit">${formatPKR(Math.round(item.unitPrice * 100))} each</p></div><button class="cart-remove" type="button" data-remove="${esc(item.lineId)}" aria-label="Remove ${esc(item.name)} from cart">Remove</button></div>${item.selections.length ? `<ul class="cart-options">${item.selections.map(s => `<li><span>${esc(s.groupName)}: ${esc(s.optionName)}</span>${s.priceDelta ? `<b>+ ${formatPKR(Math.round(s.priceDelta * 100))}</b>` : ''}</li>`).join('')}</ul>` : '<p class="cart-no-options">No customizations</p>'}<div class="cart-line__bottom"><div class="quantity-control" aria-label="Quantity for ${esc(item.name)}"><button type="button" data-quantity="${esc(item.lineId)}" data-step="-1" ${item.quantity <= 1 ? 'disabled' : ''} aria-label="Decrease ${esc(item.name)} quantity">−</button><output>${item.quantity}</output><button type="button" data-quantity="${esc(item.lineId)}" data-step="1" ${item.quantity >= 99 ? 'disabled' : ''} aria-label="Increase ${esc(item.name)} quantity">+</button></div><strong>${formatPKR(Math.round(item.unitPrice * 100) * item.quantity)}</strong></div></div></article>`; }).join('')}</div><aside class="cart-summary"><p class="eyebrow">ORDER SUMMARY</p><div class="cart-summary__row"><span>Items (${totals.itemCount})</span><strong>${formatPKR(totals.subtotalPaisa)}</strong></div><div class="cart-summary__row cart-summary__total"><span>Subtotal</span><strong>${formatPKR(totals.subtotalPaisa)}</strong></div><p class="cart-summary__note">Delivery fee, taxes and any applicable charges are calculated at checkout once restaurant settings are available.</p><a class="button button--primary button--full" href="#/checkout">Continue to checkout</a><a class="cart-continue" href="#/menu">＋ Add more items</a></aside></div><p id="cart-feedback" class="cart-feedback" role="status" aria-live="polite"></p></section>${bottomNav('menu')}</main>`;
}

export async function loadCartPage() {
  const root = document.querySelector('#app');
  root.innerHTML = `<main class="store-page"><section class="cart-loading" role="status">Loading your cart…</section></main>`;
  try {
    const items = await getCartItems();
    root.innerHTML = cartPage(items);
    bindCartPage();
  } catch (error) {
    root.innerHTML = `<main class="store-page"><section class="cart-empty"><h1>We couldn't load your cart</h1><p>${esc(error.message || 'Please try again.')}</p><button class="button button--primary" id="cart-retry" type="button">Try again</button></section></main>`;
    root.querySelector('#cart-retry')?.addEventListener('click', loadCartPage);
  }
}

export function bindCartPage() {
  const feedback = document.querySelector('#cart-feedback');
  document.querySelectorAll('[data-quantity]').forEach(button => button.addEventListener('click', async () => {
    const lineId = button.dataset.quantity;
    const row = button.closest('.cart-line');
    const current = Number(row?.querySelector('.quantity-control output')?.textContent);
    const next = current + Number(button.dataset.step);
    try { await updateCartQuantity(lineId, next); await loadCartPage(); }
    catch (error) { if (feedback) feedback.textContent = error.message || 'Could not update quantity.'; }
  }));
  document.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', async () => {
    button.disabled = true;
    try { await removeCartItem(button.dataset.remove); await loadCartPage(); }
    catch (error) { button.disabled = false; if (feedback) feedback.textContent = error.message || 'Could not remove this item.'; }
  }));
}
