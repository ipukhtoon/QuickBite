import { CartStore } from './cart-store.js';

const money = (minor) => `${(minor / 100).toFixed(2)} demo units`;

export async function initCart() {
  const dialog = document.getElementById('cartDialog');
  const linesElement = document.getElementById('cartLines');
  const emptyElement = document.getElementById('cartEmpty');
  const summaryElement = document.getElementById('cartSummary');
  const subtotalElement = document.getElementById('cartSubtotal');
  const badge = document.getElementById('cartBadge');
  let store;
  try { store = await CartStore.create(); }
  catch (error) {
    const notice = document.getElementById('appNotice');
    if (notice) { notice.textContent = 'Local cart storage is unavailable. Please enable browser site storage and reload.'; notice.hidden = false; }
    return { add: async () => { if (notice) { notice.textContent = 'Your item could not be saved because local cart storage is unavailable.'; notice.hidden = false; } } };
  }

  function makeButton(label, text, action, productId) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'quantity-button'; button.textContent = text;
    button.setAttribute('aria-label', label); button.dataset.cartAction = action; button.dataset.productId = productId;
    return button;
  }

  async function render() {
    const lines = await store.read();
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    badge.textContent = String(count);
    badge.classList.toggle('is-visible', count > 0);
    linesElement.replaceChildren();
    emptyElement.hidden = lines.length > 0;
    summaryElement.hidden = lines.length === 0;
    let subtotal = 0;
    lines.forEach((line) => {
      subtotal += line.priceMinor * line.quantity;
      const row = document.createElement('article'); row.className = 'cart-line';
      const image = document.createElement('img'); image.src = line.image; image.alt = ''; image.loading = 'lazy';
      const details = document.createElement('div'); details.className = 'cart-line-details';
      const title = document.createElement('strong'); title.textContent = line.name;
      const description = document.createElement('span'); description.textContent = line.description;
      const price = document.createElement('span'); price.className = 'cart-line-price'; price.textContent = money(line.priceMinor * line.quantity);
      const controls = document.createElement('div'); controls.className = 'quantity-controls';
      controls.append(makeButton('Decrease quantity', '−', 'decrease', line.productId));
      const quantity = document.createElement('span'); quantity.textContent = String(line.quantity); quantity.setAttribute('aria-live', 'polite');
      controls.append(quantity, makeButton('Increase quantity', '+', 'increase', line.productId));
      const remove = makeButton('Remove item', 'Remove', 'remove', line.productId); remove.classList.add('remove-line');
      details.append(title, description, price, controls, remove); row.append(image, details); linesElement.append(row);
    });
    subtotalElement.textContent = money(subtotal);
  }

  document.querySelectorAll('[data-open-cart]').forEach((button) => button.addEventListener('click', async () => { await render(); dialog.showModal(); }));
  document.querySelectorAll('[data-close-cart]').forEach((button) => button.addEventListener('click', () => dialog.close()));
  document.addEventListener('quickbite:open-cart', async () => { await render(); dialog.showModal(); });
  linesElement.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-cart-action]'); if (!button) return;
    const id = button.dataset.productId;
    const line = (await store.read()).find((item) => item.productId === id);
    if (button.dataset.cartAction === 'remove') await store.remove(id);
    if (button.dataset.cartAction === 'increase' && line) await store.setQuantity(id, line.quantity + 1);
    if (button.dataset.cartAction === 'decrease' && line) await store.setQuantity(id, line.quantity - 1);
    await render();
  });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  await render();
  return { add: async (product) => { await store.add(product); await render(); } };
}
