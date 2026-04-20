(() => {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const sidebar = document.querySelector('[data-sidebar]');

  if (navToggle && sidebar) {
    navToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  if (!searchInput || !searchResults) return;

  let index = [];

  fetch('assets/search-index.json')
    .then((res) => res.ok ? res.json() : [])
    .then((data) => {
      index = Array.isArray(data) ? data : [];
    })
    .catch(() => {
      index = [];
    });

  const render = (items) => {
    if (!items.length) {
      searchResults.innerHTML = '<li><span style="display:block;padding:0.45rem 0.5rem;">一致するページがありません</span></li>';
      searchResults.classList.add('show');
      return;
    }

    searchResults.innerHTML = items.slice(0, 12).map((item) => (
      `<li><a href="${item.url}"><strong>${item.title}</strong><br><small>${item.summary}</small></a></li>`
    )).join('');
    searchResults.classList.add('show');
  };

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      searchResults.classList.remove('show');
      searchResults.innerHTML = '';
      return;
    }

    const matched = index.filter((item) => {
      const title = String(item.title || '').toLowerCase();
      const summary = String(item.summary || '').toLowerCase();
      const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';
      return title.includes(q) || summary.includes(q) || tags.includes(q);
    });

    render(matched);
  });

  document.addEventListener('click', (event) => {
    if (!searchResults.contains(event.target) && event.target !== searchInput) {
      searchResults.classList.remove('show');
    }
  });

  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      searchResults.classList.remove('show');
      searchInput.blur();
    }
  });
})();
