import { isFirebaseConfigured } from '../../services/firebase/config.js';

function formatCurrency(minor, currencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
  }).format(minor / 100);
}

function validImageUrl(value) {
  if (typeof value !== 'string' || !value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function createCategoryChip(category, active = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'category-chip' + (active ? ' active' : '');
  button.dataset.category = category.id;
  button.setAttribute('aria-pressed', String(active));
  if (category.icon) {
    const icon = document.createElement('span');
    icon.textContent = category.icon;
    button.append(icon);
  }
  button.append(document.createTextNode(category.name));
  return button;
}

function createProductCard(product, currencyCode) {
  const card = document.createElement('article');
  card.className = 'food-card';
  card.dataset.id = product.id;
  card.dataset.category = product.categoryId || '';
  card.dataset.name = product.name;
  card.dataset.priceMinor = String(product.priceMinor);
  card._quickbiteProduct = { ...product, currencyCode };

  const image = document.createElement('img');
  const imageUrl = validImageUrl(product.imageUrl);
  if (imageUrl) image.src = imageUrl;
  image.alt = product.name;
  image.loading = 'lazy';
  image.hidden = !imageUrl;
  const title = document.createElement('div');
  title.className = 'food-title';
  title.textContent = product.name;
  const description = document.createElement('div');
  description.className = 'food-desc';
  description.textContent = product.description;
  const customize = document.createElement('button');
  customize.className = 'customize-btn';
  customize.type = 'button';
  customize.dataset.viewProduct = '';
  customize.textContent = 'Customize';
  const footer = document.createElement('div');
  footer.className = 'food-footer';
  const price = document.createElement('span');
  price.className = 'food-price';
  price.textContent = Number.isInteger(product.priceMinor) && product.priceMinor >= 0
    ? formatCurrency(product.priceMinor, currencyCode)
    : 'Price unavailable';
  const add = document.createElement('button');
  add.className = 'add-btn';
  add.type = 'button';
  add.dataset.viewProduct = '';
  add.setAttribute('aria-label', 'Customize item options');
  add.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i>';
  add.disabled = product.available === false || !Number.isInteger(product.priceMinor) || product.priceMinor < 0;
  customize.disabled = add.disabled;
  footer.append(price, add);
  card.append(image, title, description, customize, footer);
  return card;
}

export function initCatalogue() {
  const search = document.getElementById('searchInput');
  const chipsContainer = document.getElementById('categoriesContainer');
  const grid = document.getElementById('foodGrid');
  const notice = document.getElementById('appNotice');
  let activeCategory = 'all';
  let queryText = '';

  function applyFilters() {
    const cards = [...grid.querySelectorAll('.food-card')];
    let visible = 0;
    cards.forEach((card) => {
      const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const searchMatch = (card.dataset.name || '').toLocaleLowerCase().includes(queryText);
      card.hidden = !(categoryMatch && searchMatch);
      if (!card.hidden) visible += 1;
    });
    let empty = document.getElementById('catalogueEmpty');
    if (!empty) {
      empty = document.createElement('p');
      empty.id = 'catalogueEmpty';
      empty.className = 'catalogue-empty';
      empty.setAttribute('role', 'status');
      grid.after(empty);
    }
    empty.textContent = cards.length ? 'No menu items match your search.' : 'No menu items are available yet.';
    empty.hidden = visible !== 0;
  }

  function bindFilters() {
    chipsContainer.addEventListener('click', (event) => {
      const chip = event.target.closest('.category-chip');
      if (!chip) return;
      activeCategory = chip.dataset.category || 'all';
      chipsContainer.querySelectorAll('.category-chip').forEach((item) => {
        const active = item === chip;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    });
    search?.addEventListener('input', (event) => {
      queryText = event.target.value.trim().toLocaleLowerCase();
      applyFilters();
    });
  }

  bindFilters();

  if (!isFirebaseConfigured()) {
    applyFilters();
    return;
  }

  grid.replaceChildren();
  chipsContainer.replaceChildren();
  applyFilters();
  const loadingState = document.getElementById('catalogueEmpty');
  if (loadingState) loadingState.textContent = 'Loading restaurant menu…';

  (async () => {
    try {
      const repository = await import('../../services/catalogue/catalogue-repository.js');
      const [settings, categories, products] = await Promise.all([
        repository.fetchPublicSettings(),
        repository.fetchActiveCategories(),
        repository.fetchActiveProducts(),
      ]);
      const allLabel = createCategoryChip({ id: 'all', name: 'All', icon: '🍽️' }, true);
      chipsContainer.replaceChildren(allLabel, ...categories.map((category) => createCategoryChip(category)));
      grid.replaceChildren(...products.map((product) => createProductCard(product, settings.currencyCode)));
      activeCategory = 'all';
      applyFilters();
      const address = document.querySelector('.location-box .city');
      if (address && settings.publicAddress) address.textContent = settings.publicAddress;
      const heading = document.querySelector('.location-box h4');
      if (heading) heading.textContent = settings.displayName || 'RESTAURANT';
      const previewLabel = document.querySelector('.preview-notice span');
      if (previewLabel) previewLabel.textContent = 'Live menu — prices and availability are loaded from the restaurant catalogue.';
      if (notice) notice.hidden = true;
    } catch (error) {
      grid.replaceChildren();
      chipsContainer.replaceChildren();
      if (notice) {
        notice.textContent = 'The restaurant menu could not be loaded. Please try again later.';
        notice.hidden = false;
      }
      console.error('QuickBite catalogue loading failed:', error);
      applyFilters();
    }
  })();

  applyFilters();
}
