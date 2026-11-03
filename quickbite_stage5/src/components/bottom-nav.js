export function bottomNav(active = 'home') {
  const items = [ ['home','Home','/home','⌂'], ['menu','Menu','/menu','☷'], ['orders','Orders','/orders','▤'], ['account','Account','/sign-in','♙'] ];
  return `<nav class="bottom-nav" aria-label="Main navigation">${items.map(([id,label,path,icon]) => `<a class="bottom-nav__item ${active === id ? 'is-active' : ''}" href="#${path}" ${active === id ? 'aria-current="page"' : ''}><span aria-hidden="true">${icon}</span><small>${label}</small></a>`).join('')}</nav>`;
}
