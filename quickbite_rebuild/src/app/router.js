const routes = ['welcome','signin','signup','home','menu','product','cart','checkout','tracking','orders','admin','manage-menu'];
export function currentRoute() {
  const value = location.hash.replace(/^#\/?/, '').split('/')[0];
  return routes.includes(value) ? value : 'welcome';
}
export function navigate(route, detail = '') {
  if (!routes.includes(route)) return;
  location.hash = '#/' + route + (detail ? '/' + encodeURIComponent(detail) : '');
}
export function subscribeRoute(callback) {
  addEventListener('hashchange', callback);
}