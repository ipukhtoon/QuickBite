import { normalizeCatalog } from '../../services/catalog.js';
import { addCartItem, cartLineId } from '../../services/cart.js';
import { bottomNav } from '../../components/bottom-nav.js';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = (v) => `Rs ${Number(v).toLocaleString('en-PK', { maximumFractionDigits: 2 })}`;

export function normalizeProductOptions(groups = []) {
  if (!Array.isArray(groups)) return [];
  return groups.filter(g => g && typeof g.id === 'string' && typeof g.name === 'string' && Array.isArray(g.options)).map(g => ({
    id: g.id, name: g.name.trim(), required: g.required === true, selection: g.selection === 'multiple' ? 'multiple' : 'single',
    options: g.options.filter(o => o && typeof o.id === 'string' && typeof o.name === 'string' && Number.isFinite(Number(o.priceDelta ?? 0)) && Number(o.priceDelta ?? 0) >= 0).map(o => ({ id:o.id, name:o.name.trim(), priceDelta:Number(o.priceDelta ?? 0) }))
  })).filter(g => g.name && g.options.length);
}

export function productDetailsPage(source = {products:[],categories:[]}, productId = '') {
  const {products} = normalizeCatalog(source.products, source.categories);
  const p = products.find(x => x.id === productId);
  if (!p) return `<main class="store-page" id="main-content"><header class="store-header"><a class="back-link" href="#/menu">← <span>Menu</span></a><a class="brand brand--compact" href="#/home"><span class="brand__word">Quick<span>Bite</span></span></a><a class="icon-action" href="#/cart" aria-label="Cart">♧</a></header><section class="product-message"><span class="catalog-empty__icon" aria-hidden="true">✦</span><p class="eyebrow">PRODUCT DETAILS</p><h1>${source.products?.length ? 'Dish unavailable' : 'Menu coming soon'}</h1><p>${source.products?.length ? 'This item may have been removed or is no longer available.' : 'Product details will appear when the restaurant menu is connected.'}</p><a class="button button--primary" href="#/menu">Browse menu</a></section>${bottomNav('menu')}</main>`;
  const groups = normalizeProductOptions(p.options);
  return `<main class="store-page product-page" id="main-content"><header class="store-header"><a class="back-link" href="#/menu">← <span>Menu</span></a><a class="brand brand--compact" href="#/home"><span class="brand__word">Quick<span>Bite</span></span></a><a class="icon-action" href="#/cart" aria-label="Cart">♧</a></header><article class="product-detail product-detail-reference"><div class="product-detail__image"><span class="product-image-badge">CHEF’S PICK</span>${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="${esc(p.name)}">` : '<span>Photo coming soon</span>'}</div><div class="product-detail__content"><p class="eyebrow">MADE FRESH TO ORDER</p><h1>${esc(p.name)}</h1><p class="product-detail__description">${esc(p.description || 'Prepared fresh by our kitchen.')}</p><strong class="product-detail__base-price">${money(p.price)}</strong><form id="product-options-form" class="product-options" novalidate>${groups.map(g => `<fieldset class="option-group"><legend>${esc(g.name)} ${g.required ? '<span>Required</span>' : '<small>Optional</small>'}</legend>${g.options.map((o,i) => `<label class="option-row"><input type="${g.selection === 'multiple' ? 'checkbox' : 'radio'}" name="option-${esc(g.id)}" value="${esc(o.id)}" ${g.required && g.selection === 'single' && i === 0 ? 'required' : ''}><span>${esc(o.name)}</span><b>${o.priceDelta ? `+ ${money(o.priceDelta)}` : 'Included'}</b></label>`).join('')}</fieldset>`).join('')}<div class="product-quantity"><label>Quantity</label><div class="quantity-control"><button type="button" data-step="-1" aria-label="Decrease quantity">−</button><output id="quantity-value" aria-live="polite">1</output><button type="button" data-step="1" aria-label="Increase quantity">+</button></div></div><div class="product-total"><span>Item total</span><strong id="product-total">${money(p.price)}</strong></div><p id="product-feedback" class="product-feedback" role="status" aria-live="polite"></p><button class="button button--primary button--full product-add" type="submit" ${p.available ? '' : 'disabled'}>${p.available ? 'Add to cart' : 'Currently unavailable'} <span id="product-add-price">· ${money(p.price)}</span></button></form></div></article>${bottomNav('menu')}</main>`;
}

export function bindProductDetails(source = {products:[],categories:[]}, productId = '') {
  const p = normalizeCatalog(source.products, source.categories).products.find(x => x.id === productId);
  const form = document.querySelector('#product-options-form');
  if (!p || !form) return;
  const groups = normalizeProductOptions(p.options);
  let quantity = 1;
  const feedback = document.querySelector('#product-feedback');
  function selection() {
    const selected = [];
    for (const g of groups) {
      const inputs = [...form.querySelectorAll(`input[name="option-${CSS.escape(g.id)}"]:checked`)];
      if (g.required && !inputs.length) return {error:`Please choose ${g.name.toLowerCase()}.`};
      inputs.forEach(input => { const o = g.options.find(x => x.id === input.value); if (o) selected.push({groupId:g.id,groupName:g.name,optionId:o.id,optionName:o.name,priceDelta:o.priceDelta}); });
    }
    return {selected};
  }
  function update() {
    const s = selection().selected ?? [];
    const total = (p.price + s.reduce((n,o) => n + o.priceDelta,0)) * quantity;
    document.querySelector('#quantity-value').textContent = quantity;
    document.querySelector('#product-total').textContent = money(total);
    document.querySelector('#product-add-price').textContent = `· ${money(total)}`;
  }
  form.addEventListener('change', update);
  form.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { quantity = Math.max(1,Math.min(99,quantity + Number(b.dataset.step))); update(); }));
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const result = selection();
    if (result.error) { feedback.textContent = result.error; feedback.className = 'product-feedback is-error'; return; }
    const selected = result.selected;
    const unitPrice = p.price + selected.reduce((n,o) => n + o.priceDelta,0);
    try {
      await addCartItem({lineId:cartLineId(p.id,selected),productId:p.id,name:p.name,imageUrl:p.imageUrl,basePrice:p.price,unitPrice,selections:selected,quantity,currency:'PKR'});
      feedback.textContent = 'Added to your cart.'; feedback.className = 'product-feedback is-success';
      const button = form.querySelector('[type="submit"]'); button.textContent = 'View cart'; button.onclick = ev => { ev.preventDefault(); window.location.hash='/cart'; };
    } catch (err) { feedback.textContent = err.message || 'Could not save this item. Please try again.'; feedback.className = 'product-feedback is-error'; }
  });
  update();
}
