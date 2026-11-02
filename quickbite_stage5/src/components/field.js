export function field({ id, label, type = 'text', placeholder = '', autocomplete = '', required = true, hint = '', inputmode = '', minlength = null }) {
  return `
    <div class="field">
      <label class="field__label" for="${id}">${label}</label>
      <input class="field__input" id="${id}" name="${id}" type="${type}" placeholder="${placeholder}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${inputmode ? `inputmode="${inputmode}"` : ''} ${minlength ? `minlength="${minlength}"` : ''} ${required ? 'required' : ''} />
      ${hint ? `<small class="field__hint">${hint}</small>` : ''}
    </div>`;
}
