import { isFirebaseConfigured } from '../../services/firebase/config.js';

const statusLabels = {
  pending_confirmation: 'Awaiting confirmation',
  accepted: 'Order accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'On the way',
  completed: 'Completed',
  rejected: 'Not accepted',
  cancelled: 'Cancelled',
};

function formatMoney(minor, currencyCode) {
  if (!Number.isSafeInteger(minor) || typeof currencyCode !== 'string') return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(minor / 100);
  } catch {
    return '—';
  }
}

function formatDate(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== 'function') return 'Date pending';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp.toDate());
}

function createOrderCard(order) {
  const card = document.createElement('article');
  card.className = 'order-history-card';

  const header = document.createElement('div');
  header.className = 'order-history-card-header';
  const identity = document.createElement('div');
  const orderNumber = document.createElement('strong');
  orderNumber.textContent = `Order #${order.id.slice(-7).toUpperCase()}`;
  const date = document.createElement('span');
  date.textContent = formatDate(order.createdAt);
  identity.append(orderNumber, date);

  const status = document.createElement('span');
  status.className = 'order-status-pill';
  status.textContent = statusLabels[order.status] || 'Order update';
  header.append(identity, status);

  const items = document.createElement('div');
  items.className = 'order-history-items';
  (Array.isArray(order.items) ? order.items : []).forEach((item) => {
    const row = document.createElement('div');
    const name = document.createElement('span');
    name.textContent = `${Number.isInteger(item.quantity) ? item.quantity : 0} × ${item.name || 'Menu item'}`;
    const total = document.createElement('strong');
    total.textContent = formatMoney(item.lineTotalMinor, order.totals?.currencyCode);
    row.append(name, total);
    items.append(row);
  });

  const footer = document.createElement('div');
  footer.className = 'order-history-footer';
  const payment = document.createElement('span');
  payment.textContent = order.paymentStatus === 'paid' ? 'Cash collected' : 'Cash due at fulfilment';
  const total = document.createElement('strong');
  total.textContent = formatMoney(order.totals?.totalMinor, order.totals?.currencyCode);
  footer.append(payment, total);

  card.append(header, items, footer);
  return card;
}

export function initOrdersUI() {
  const dialog = document.getElementById('ordersDialog');
  const list = document.getElementById('ordersList');
  const empty = document.getElementById('ordersEmpty');
  const message = document.getElementById('ordersMessage');
  const loading = document.getElementById('ordersLoading');
  const signInButton = document.getElementById('ordersSignIn');
  const refreshButton = document.getElementById('refreshOrders');

  document.querySelectorAll('[data-close-orders]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.hidden = !text;
    message.classList.toggle('is-error', isError);
  }

  async function loadOrders() {
    refreshButton.disabled = true;
    list.replaceChildren();
    empty.hidden = true;
    loading.hidden = false;
    setMessage('');
    signInButton.hidden = true;

    if (!isFirebaseConfigured()) {
      loading.hidden = true;
      setMessage('Order history will be available after the restaurant connects its Firebase account service.');
      refreshButton.disabled = false;
      return;
    }

    try {
      const repository = await import('../../services/orders/order-repository.js');
      const orders = await repository.fetchMyOrders();
      loading.hidden = true;
      empty.hidden = orders.length !== 0;
      if (orders.length === 0) return;
      list.replaceChildren(...orders.map(createOrderCard));
    } catch (error) {
      loading.hidden = true;
      if (error?.code === 'auth-required') {
        signInButton.hidden = false;
        setMessage('Sign in to view orders placed with your account.');
        return;
      }
      setMessage('Your orders could not be loaded. Check your connection and try again.', true);
    } finally {
      refreshButton.disabled = false;
    }
  }

  document.addEventListener('quickbite:open-orders', () => {
    if (!dialog.open) dialog.showModal();
    loadOrders();
  });

  refreshButton.addEventListener('click', loadOrders);
  signInButton.addEventListener('click', () => {
    dialog.close();
    window.dispatchEvent(new CustomEvent('quickbite:open-account'));
  });
}
