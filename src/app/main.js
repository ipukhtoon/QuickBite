import '../styles/tokens.css';
import '../styles/main.css';
import { initCatalogue } from '../features/catalogue/catalogue.js';
import { initCart } from '../features/cart/cart-ui.js';

const cart = await initCart();
initCatalogue({ onAdd: (product) => cart.add(product) });

// Keep the reference navigation responsive without pretending unfinished routes work.
document.querySelectorAll('[data-nav]').forEach((item) => {
  item.addEventListener('click', (event) => {
    const destination = item.dataset.nav;
    if (destination === 'home') return;
    event.preventDefault();
    if (destination === 'orders') {
      document.dispatchEvent(new CustomEvent('quickbite:open-cart'));
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
