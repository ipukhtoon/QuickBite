const ROUTES = new Set([
  '/', '/sign-in', '/create-account', '/home', '/menu', '/product',
  '/cart', '/checkout', '/tracking', '/orders', '/admin', '/admin/menu'
]);

export function currentRoute() {
  const raw = window.location.hash.slice(1) || '/';
  const path = raw.split('?')[0];
  return ROUTES.has(path) ? path : '/';
}

export function navigate(path) {
  if (!ROUTES.has(path)) throw new Error(`Unknown QuickBite route: ${path}`);
  window.location.hash = path;
}

export function onRouteChange(callback) {
  window.addEventListener('hashchange', callback);
}
