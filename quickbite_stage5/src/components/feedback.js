export function feedback(message, kind = 'info') {
  return `<div class="feedback feedback--${kind}" role="status" aria-live="polite">${message}</div>`;
}
