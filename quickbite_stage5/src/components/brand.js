export function brand({ compact = false } = {}) {
  return `
    <a class="brand ${compact ? 'brand--compact' : ''}" href="#/" aria-label="QuickBite home">
      <span class="brand__mark" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="brand__word">Quick<span>Bite</span></span>
      ${compact ? '' : '<span class="brand__tagline">GOOD FOOD. GOOD MOOD.</span>'}
    </a>`;
}
