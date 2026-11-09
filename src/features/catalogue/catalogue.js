export function initCatalogue({ onAdd }) {
  const search = document.getElementById('searchInput');
  const chips = [...document.querySelectorAll('.category-chip')];
  const cards = [...document.querySelectorAll('.food-card')];
  const grid = document.getElementById('foodGrid');
  let activeCategory = 'all';
  let query = '';

  function applyFilters() {
    let visible = 0;
    cards.forEach((card) => {
      const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const searchMatch = (card.dataset.name || '').toLocaleLowerCase().includes(query);
      const matches = categoryMatch && searchMatch;
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    let empty = document.getElementById('catalogueEmpty');
    if (!empty) {
      empty = document.createElement('p');
      empty.id = 'catalogueEmpty';
      empty.className = 'catalogue-empty';
      empty.setAttribute('role', 'status');
      empty.textContent = 'No menu items match your search.';
      grid.after(empty);
    }
    empty.hidden = visible !== 0;
  }

  chips.forEach((chip) => {
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
    chip.setAttribute('aria-pressed', String(chip.classList.contains('active')));
    const select = () => {
      activeCategory = chip.dataset.category || 'all';
      chips.forEach((item) => {
        const active = item === chip;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    };
    chip.addEventListener('click', select);
    chip.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); }
    });
  });

  search?.addEventListener('input', (event) => {
    query = event.target.value.trim().toLocaleLowerCase();
    applyFilters();
  });

  grid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;
    const card = button.closest('.food-card');
    if (!card) return;
    const price = Number(card.dataset.price);
    if (!Number.isFinite(price) || price < 0) return;
    onAdd({
      id: card.dataset.id,
      name: card.dataset.name,
      description: card.querySelector('.food-desc')?.textContent?.trim() || '',
      priceMinor: Math.round(price * 100),
      image: card.querySelector('img')?.getAttribute('src') || '',
    });
    button.classList.add('added');
    button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
    window.setTimeout(() => {
      button.classList.remove('added');
      button.innerHTML = '<i class="fa-solid fa-plus" aria-hidden="true"></i>';
    }, 700);
  });
  applyFilters();
}
