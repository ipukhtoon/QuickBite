import { initCatalogue } from '../features/catalogue/catalogue.js';
import { initCart } from '../features/cart/cart-ui.js';
import { initProductDetails } from '../features/product/product-details.js';
import { initAuthUI } from '../features/auth/auth-ui.js';

async function bootstrap() {
  const cart = await initCart();
  initCatalogue();
  initProductDetails({ onAdd: (product) => cart.add(product) });
  initAuthUI();
}

bootstrap().catch((error) => {
  const notice = document.getElementById('appNotice');
  if (notice) {
    notice.textContent = 'QuickBite could not initialize correctly. Please reload the page.';
    notice.hidden = false;
  }
  console.error('QuickBite initialization failed:', error);
});

// Keep the reference navigation responsive without pretending unfinished routes work.
document.querySelectorAll('[data-nav]').forEach((item) => {
  item.addEventListener('click', (event) => {
    const destination = item.dataset.nav;
    if (destination === 'home') return;
    event.preventDefault();
    if (destination === 'orders') {
      window.dispatchEvent(new CustomEvent('quickbite:notice', { detail: 'Order history will appear here after customer accounts and order processing are implemented. Your cart is available from the Cart button above.' }));
      return;
    }
    const message = destination === 'saved'
      ? 'Saved items will be available when customer accounts are implemented.'
      : 'Your profile will be available when secure sign-in is implemented.';
    window.dispatchEvent(new CustomEvent('quickbite:notice', { detail: message }));
  });
});

window.addEventListener('quickbite:notice', (event) => {
  const notice = document.getElementById('appNotice');
  if (!notice) return;
  notice.textContent = event.detail;
  notice.hidden = false;
});
