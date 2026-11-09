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
  });

  search?.addEventListener('input', (event) => {
    query = event.target.value.trim().toLocaleLowerCase();
    applyFilters();
  });

  applyFilters();
}
