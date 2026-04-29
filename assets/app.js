(() => {
  const body = document.body;
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchForm = document.getElementById('searchform');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const sidebar = document.querySelector('[data-sidebar]');
  const printButton = document.querySelector('[data-print-page]');
  const tocBody = document.querySelector('[data-page-toc-body]');
  const tocDetails = document.querySelector('[data-page-toc-details]');

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const getSearchIndexUrl = () => {
    const scriptUrl = document.currentScript?.src || '';
    if (scriptUrl) {
      return new URL('search-index.json', new URL('.', scriptUrl)).href;
    }
    return 'assets/search-index.json';
  };

  if (navToggle && sidebar) {
    navToggle.addEventListener('click', () => {
      const isOpen = body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  if (printButton) {
    printButton.addEventListener('click', () => {
      window.print();
    });
  }

  const buildPageToc = () => {
    if (!tocBody) return;

    const content = document.getElementById('mw-content-text');
    if (!content) return;

    const headings = Array.from(content.querySelectorAll('h2, h3')).filter((heading) => (
      !heading.closest('.toc, .infobox, .navbox, #mw-normal-catlinks, .mw-normal-catlinks, .reflist')
    ));

    if (!headings.length) {
      tocBody.innerHTML = '<p class="toc-empty">このページには見出しがありません</p>';
      return;
    }

    const usedIds = new Set(Array.from(document.querySelectorAll('[id]')).map((node) => node.id));
    const items = headings.map((heading, index) => {
      const nestedHeadline = heading.querySelector('.mw-headline[id]');
      let id = heading.id || nestedHeadline?.id || '';

      if (!id) {
        let candidate = `section-${index + 1}`;
        let suffix = 2;
        while (usedIds.has(candidate)) {
          candidate = `section-${index + 1}-${suffix}`;
          suffix += 1;
        }
        heading.id = candidate;
        id = candidate;
        usedIds.add(candidate);
      }

      const text = heading.textContent.trim().replace(/\s+/g, ' ');
      const level = heading.tagName.toLowerCase() === 'h3' ? 3 : 2;
      return `<li class="toclevel-${level}"><a href="#${encodeURIComponent(id)}">${escapeHtml(text)}</a></li>`;
    });

    tocBody.innerHTML = `<ul>${items.join('')}</ul>`;
    body.classList.add('vector-has-generated-toc');

    const setMobileTocState = () => {
      if (!tocDetails) return;
      if (window.matchMedia('(max-width: 980px)').matches) {
        tocDetails.removeAttribute('open');
      } else {
        tocDetails.setAttribute('open', '');
      }
    };

    setMobileTocState();
    window.addEventListener('resize', setMobileTocState);
  };

  buildPageToc();

  if (!searchInput || !searchResults) return;

  let index = [];
  let currentMatches = [];

  fetch(getSearchIndexUrl())
    .then((res) => res.ok ? res.json() : [])
    .then((data) => {
      index = Array.isArray(data) ? data : [];
    })
    .catch(() => {
      index = [];
    });

  const findMatches = (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return index.filter((item) => {
      const searchable = [
        item.title,
        item.summary,
        item.article_type,
        item.nav_section,
        ...(Array.isArray(item.aliases) ? item.aliases : []),
        ...(Array.isArray(item.tags) ? item.tags : []),
        ...(Array.isArray(item.related) ? item.related : []),
      ].filter(Boolean).join(' ').toLowerCase();
      return searchable.includes(q);
    });
  };

  const render = (items) => {
    currentMatches = items.slice(0, 12);

    if (!currentMatches.length) {
      searchResults.innerHTML = '<li><span>一致するページがありません</span></li>';
      searchResults.classList.add('show');
      return;
    }

    searchResults.innerHTML = currentMatches.map((item) => (
      `<li><a href="${escapeHtml(item.url)}"><strong>${escapeHtml(item.title)}</strong><br><small>${escapeHtml(item.summary)}</small>${item.article_type ? `<br><small class="search-result-meta">${escapeHtml(item.article_type)}</small>` : ''}</a></li>`
    )).join('');
    searchResults.classList.add('show');
  };

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (!q) {
      searchResults.classList.remove('show');
      searchResults.innerHTML = '';
      currentMatches = [];
      return;
    }

    render(findMatches(q));
  });

  if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const q = searchInput.value.trim().toLowerCase();
      const matches = currentMatches.length ? currentMatches : findMatches(q);
      const exact = matches.find((item) => String(item.title || '').toLowerCase() === q);
      const target = exact || matches[0];
      if (target?.url) {
        window.location.href = target.url;
      }
    });
  }

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
