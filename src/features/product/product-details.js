import { DEMO_PRODUCT_OPTIONS } from '../catalogue/demo-options.js';

const formatAmount = (minor, currencyCode) => currencyCode ? new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(minor / 100) : (minor / 100).toFixed(2) + ' demo units';

export function initProductDetails({ onAdd }) {
  const dialog = document.getElementById('productDialog');
  const form = document.getElementById('productForm');
  const groupsElement = document.getElementById('productOptionGroups');
  const validation = document.getElementById('productValidation');
  const priceElement = document.getElementById('productDialogPrice');
  const addButton = document.getElementById('addConfiguredProduct');
  let currentProduct = null;
  let currentGroups = [];

  function selections() {
    return currentGroups.map((group) => ({
      group,
      selected: [...groupsElement.querySelectorAll('[data-option-group="' + group.id + '"]:checked')],
    }));
  }

  function selectedAmount() {
    return (currentProduct?.basePriceMinor || 0) + selections().reduce((sum, item) =>
      sum + item.selected.reduce((subtotal, input) => subtotal + Number(input.dataset.deltaMinor || 0), 0), 0);
  }

  function validate() {
    const issues = selections().filter(({ group, selected }) => selected.length < group.min || selected.length > group.max);
    validation.hidden = issues.length === 0;
    validation.textContent = issues.map(({ group }) => {
      const range = group.min === group.max ? String(group.min) : String(group.min) + '–' + String(group.max);
      return 'Choose ' + range + ' option(s) for ' + group.name + '.';
    }).join(' ');
    addButton.disabled = issues.length > 0;
    return issues.length === 0;
  }

  function updatePrice() { priceElement.textContent = formatAmount(selectedAmount(), currentProduct?.currencyCode); validate(); }

  function open(card) {
    const price = Number(card.dataset.price);
    if (!Number.isFinite(price) || price < 0) return;
    currentProduct = {
      id: card.dataset.id,
      name: card.dataset.name,
      description: card.querySelector('.food-desc')?.textContent?.trim() || '',
      image: card.querySelector('img')?.getAttribute('src') || '',
      basePriceMinor: Math.round(price * 100),
    };
    currentGroups = DEMO_PRODUCT_OPTIONS[currentProduct.id] || [];
    document.getElementById('productDialogTitle').textContent = currentProduct.name;
    document.getElementById('productDialogDescription').textContent = currentProduct.description;
    const image = document.getElementById('productDialogImage');
    image.src = currentProduct.image; image.alt = currentProduct.name;
    groupsElement.replaceChildren();

    currentGroups.forEach((group) => {
      const fieldset = document.createElement('fieldset'); fieldset.className = 'option-group';
      const legend = document.createElement('legend');
      legend.textContent = group.name + (group.required ? ' · Required' : ' · Optional');
      fieldset.append(legend);
      group.choices.forEach((choice, index) => {
        const label = document.createElement('label'); label.className = 'option-choice';
        const input = document.createElement('input');
        input.type = group.type === 'single' ? 'radio' : 'checkbox';
        input.name = 'option-' + group.id;
        input.dataset.optionGroup = group.id;
        input.dataset.optionId = choice.id;
        input.dataset.optionLabel = choice.label;
        input.dataset.deltaMinor = String(choice.deltaMinor);
        if (group.type === 'single') input.checked = index === 0;
        input.addEventListener('change', updatePrice);
        const text = document.createElement('span'); text.textContent = choice.label;
        const delta = document.createElement('small');
        delta.textContent = choice.deltaMinor ? '+' + formatDemoAmount(choice.deltaMinor) : 'Included';
        label.append(input, text, delta); fieldset.append(label);
      });
      groupsElement.append(fieldset);
    });
    updatePrice();
    dialog.showModal();
  }

  document.getElementById('foodGrid')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view-product]');
    if (button) open(button.closest('.food-card'));
  });

  addButton.addEventListener('click', async () => {
    if (!currentProduct || !validate()) return;
    const chosen = selections().flatMap(({ group, selected }) => selected.map((input) => ({
      groupId: group.id, groupName: group.name, optionId: input.dataset.optionId,
      label: input.dataset.optionLabel, deltaMinor: Number(input.dataset.deltaMinor || 0),
    })));
    const optionIds = chosen.map((item) => item.groupId + ':' + item.optionId).sort();
    const optionSummary = chosen.map((item) => item.label).join(', ');
    try {
      await onAdd({ ...currentProduct, priceMinor: selectedAmount(), optionIds, options: chosen, optionSummary });
      dialog.close();
    } catch (error) {
      validation.textContent = 'This item could not be saved. Please try again.';
      validation.hidden = false;
    }
  });
  form.addEventListener('submit', (event) => { event.preventDefault(); dialog.close(); });
}
