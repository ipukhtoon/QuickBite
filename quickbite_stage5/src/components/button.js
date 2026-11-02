export function button(label, { variant = 'primary', type = 'button', href = '', icon = '' , className = ''} = {}) {
  const content = `${label}${icon ? `<span class="button__icon" aria-hidden="true">${icon}</span>` : ''}`;
  if (href) return `<a class="button button--${variant} ${className}" href="#${href}">${content}</a>`;
  return `<button class="button button--${variant} ${className}" type="${type}">${content}</button>`;
}
