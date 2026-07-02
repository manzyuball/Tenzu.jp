(() => {
  const body = document.body;
  if (!body || body.dataset.tenzuEnhanced === 'true') return;
  body.dataset.tenzuEnhanced = 'true';
  body.classList.add('tenzu-enhanced');

  const make = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html) node.innerHTML = html;
    return node;
  };

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const pageName = decodeURIComponent((location.pathname.split('/').pop() || '').toLowerCase());
  const pageTitle = (document.getElementById('firstHeading') || document.querySelector('h1'))?.textContent?.trim() || document.title.replace(/\s*[-|].*$/, '');
  const pageKind = pageName.startsWith('character-')
    ? 'character'
    : pageName.startsWith('faction-')
      ? 'organization'
      : pageName === 'history.html'
        ? 'history'
        : 'directory';

  const profiles = {
    character: {
      notice: [
        '人物評価に関する記述は出典ごとに立場が異なります。',
        '掲示板由来の呼称、あだ名、画像ネタを本文へ反映する際は慎重に扱ってください。',
        '未確認の目撃談や関係者発言は、公開資料で確認できる範囲に限って記述してください。',
      ],
      trends: ['霊夢また怒ってる', '例の写真の出典', '口調修正合戦', '古い呼び名問題', '赤いリボン警察'],
      comments: [
        ['ななしの利用者', '人物欄、また掲示板の呼び名が本文に戻されてる。'],
        ['編集好きさん', 'あだ名は関連文化に隔離でよくない？ 概要に置くと荒れる。'],
        ['ななしの利用者', '古い版の方が読みやすかったけど、出典は今の方がまとも。'],
        ['通りすがり', '画像の説明、どの公開資料に載ってるやつ？'],
        ['ななしの利用者', '人物記事はファン目線と資料目線が混ざると一気に設定資料集になる。'],
      ],
      talk: [
        ['呼称・俗称の扱い', '掲示板由来の呼称は本文の概要ではなく、関連文化または注釈に分離する方針。'],
        ['画像説明', '公開資料で確認できる画像説明のみ採用し、感想や印象評は本文へ入れない。'],
        ['経歴節の順序', '公的経歴、報道記録、ネット上での扱いの順で整理する案が継続中。'],
      ],
      history: [
        ['2026-05-06', '編集好きさん', '人物評価の表現を中立化'],
        ['2026-05-04', '資料掘り部', '公開資料に基づく経歴節を整理'],
        ['2026-05-01', 'ななしの利用者', '掲示板由来の呼称をノートへ移動'],
      ],
      pageInfo: {
        revisions: '84版',
        watchers: '31人',
        protection: '半保護',
        quality: '出典確認中',
        lastReviewed: '2026-05-06',
      },
    },
    organization: {
      notice: [
        '企業・団体に関する記述には当事者発表、報道、批判的資料が混在しています。',
        '未公表の資本関係、行政契約、内部部署については断定を避けてください。',
        '掲示板での疑惑整理を本文へ移す場合は、出典と反論の有無を確認してください。',
      ],
      trends: ['例の契約書', '広告多すぎ問題', '消えたIR資料', '下請け泣かせ', '資料網の中立性'],
      comments: [
        ['ななしの利用者', '企業発表そのまま貼るなら百科じゃなくて会社案内なんよ。'],
        ['資料掘り部', '行政契約の数字、出典リンクが古い。差し替え候補をノートに置いた。'],
        ['ななしの利用者', '批判節だけ急に週刊誌っぽくなるのどうにかして。'],
        ['編集好きさん', '関連会社と部門名が混ざってる。表に分けた方がいい。'],
        ['ななしの利用者', '広告がこのページに出るの、サイトの空気としては正しいけど笑う。'],
      ],
      talk: [
        ['中立性', '当事者発表、報道、批判的資料を分けて書く方針。宣伝調の形容は除去対象。'],
        ['未公表情報', '資本関係、行政契約、内部部署は公開資料で確認できる範囲に限定する。'],
        ['関連会社の整理', '法人名、部門名、サービス名が混在しているため表形式で分離する案。'],
      ],
      history: [
        ['2026-05-06', '資料掘り部', '批判・論争節の出典確認を追加'],
        ['2026-05-03', '編集好きさん', '企業発表に近い表現を削減'],
        ['2026-04-30', 'ななしの利用者', '関連会社の表を差し戻し後に再整理'],
      ],
      pageInfo: {
        revisions: '126版',
        watchers: '46人',
        protection: '拡張半保護',
        quality: '論争あり',
        lastReviewed: '2026-05-06',
      },
    },
    history: {
      notice: [
        '時系列記事は公開された記録に基づき、未確認の将来事象を扱いません。',
        '事件名、作戦名、通称は資料間で表記揺れがあります。',
        '掲示板の推測や陰謀論的整理を本文へ移す場合は、検証可能性を確認してください。',
      ],
      trends: ['年表の空白', '誰が最初に言った', '境界線って結局何', '消えた見出し', '古地図の謎'],
      comments: [
        ['ななしの利用者', 'ここ、年表だけ見ると分かった気になるけど本文読むと全然分からん。'],
        ['資料掘り部', 'この節は公開記録と回想録が混ざってる。分けたい。'],
        ['ななしの利用者', '未来の話を書き足す人、毎回差し戻されてるのに懲りないな。'],
        ['編集好きさん', '事件名の表記ゆれを先に整理した方がいい。検索で迷子になる。'],
        ['ななしの利用者', '年表記事の掲示板、だいたい資料請求スレになる。'],
      ],
      talk: [
        ['時系列の基準', '公開記録に残る出来事のみ採録し、未確認の将来事象は扱わない。'],
        ['表記揺れ', '事件名、作戦名、通称は出典ごとに差があるため、代表表記と別名を併記する。'],
        ['一覧と本文', '年表、用語説明、関連項目の分離が未完了。初見向け導線を改善する必要あり。'],
      ],
      history: [
        ['2026-05-06', '資料掘り部', '将来事象に見える記述を除去'],
        ['2026-05-02', '編集好きさん', '表記揺れの注釈を追加'],
        ['2026-04-29', 'ななしの利用者', '年表見出しの並びを整理'],
      ],
      pageInfo: {
        revisions: '73版',
        watchers: '28人',
        protection: '通常',
        quality: '要整理',
        lastReviewed: '2026-05-06',
      },
    },
    directory: {
      notice: [
        'このページは案内ページです。個別記事の評価や推測は各記事側で扱ってください。',
        '一覧に追加する場合は、記事本文、検索索引、関連リンクの整合を確認してください。',
        '未作成記事を増やしすぎると利用者導線が弱くなります。',
      ],
      trends: ['カテゴリ迷子', '新規記事依頼', 'おすすめ表示壊れてる', '記事名長すぎ', 'リンク切れ報告'],
      comments: [
        ['ななしの利用者', '一覧ページ、結局ここから検索するのが一番早い。'],
        ['編集好きさん', '赤リンク風の項目を増やすなら作成予定も書いてほしい。'],
        ['ななしの利用者', 'カテゴリ名が真面目すぎてネット辞典感が薄い。'],
        ['資料掘り部', '主要記事だけじゃなくて変な小ネタ記事への導線も欲しい。'],
        ['ななしの利用者', 'トップの雑さと奥の記事の硬さ、この差がいい。'],
      ],
      talk: [
        ['一覧の範囲', '主要項目だけでなく、利用者が検索しやすい俗称・別名からの導線を増やす案。'],
        ['未作成記事', '赤リンク風の項目は増やしすぎず、検索索引と整合するものから作成する。'],
        ['カテゴリ名', '硬い分類名とネット辞典らしい俗称を併記する案が未決。'],
      ],
      history: [
        ['2026-05-06', '編集好きさん', '一覧ページの導線を整理'],
        ['2026-05-03', 'ななしの利用者', '未作成リンクを削減'],
        ['2026-04-30', '資料掘り部', '検索索引との整合を確認'],
      ],
      pageInfo: {
        revisions: '39版',
        watchers: '18人',
        protection: '通常',
        quality: '案内ページ',
        lastReviewed: '2026-05-06',
      },
    },
  };

  const pageProfiles = {
    'faction-tenzu.html': {
      notice: [
        '天通自身が運営する資料網に掲載された記事であるため、中立性に関する指摘があります。',
        '企業発表、報道資料、利用者投稿の区別が不十分な記述があります。',
        '通信記録、広告配信、資料網運営に関する未確認の推測は本文へ移さないでください。',
      ],
      trends: ['天通が天通を編集', '広告多すぎ問題', '消えた訂正履歴', '資料網の中立性', 'おすすめ欄が露骨'],
      comments: [
        ['ななしの利用者', '自社サービスの記事にこの広告量、逆にリアルで嫌だ。'],
        ['資料掘り部', '天通辞典の運営主体と天通グループ本体の節、もっと分けた方がいい。'],
        ['ななしの利用者', '批判節が薄い。検索順位と広告配信の話、出典あるなら入れて。'],
        ['編集好きさん', '「社会貢献」って表現は企業発表寄りなので、公開資料網に寄せたい。'],
        ['ななしの利用者', 'この記事のノートだけ妙に消えるの、そういう演出じゃなくて本当に怖い。'],
      ],
      talk: [
        ['利益相反', '天通自身が運営する資料網の記事であることを明示し、当事者発表の扱いを分ける。'],
        ['広告・検索順位', '広告配信と検索順位に関する批判は出典確認後、批判・論争節へ移す。'],
        ['資料網の位置づけ', '社会貢献事業という表現は企業発表寄りのため、公開資料網として記述する案。'],
      ],
      history: [
        ['2026-05-06', '資料掘り部', '中立性に関する注意文を追加'],
        ['2026-05-05', '編集好きさん', '社会貢献表現を公開資料網へ修正'],
        ['2026-05-03', 'ななしの利用者', '広告配信に関する掲示板ログを整理'],
      ],
      pageInfo: {
        revisions: '214版',
        watchers: '92人',
        protection: '拡張半保護',
        quality: '利益相反注意',
        lastReviewed: '2026-05-06',
      },
    },
    'character-hakurei-reimu.html': {
      notice: [
        '役職、階級、部隊運用に関する記述には公表資料と推測が混在しています。',
        '掲示板由来の呼称や画像ネタを人物評価として本文に入れないでください。',
        '戦闘・治安対応に関する未確認の逸話は、公開資料で確認できる範囲に限って扱ってください。',
      ],
      trends: ['赤いリボン警察', 'また無表情写真', '口調修正合戦', '境界線勤務説', '霊夢怖い派'],
      comments: [
        ['ななしの利用者', '概要が硬すぎるのに掲示板だけいつものノリで温度差ある。'],
        ['現地資料班', '部隊名の出典、古い公開資料だと表記が違う。注釈に回したい。'],
        ['ななしの利用者', '「怖い」って感想を本文に戻すな。掲示板でやれ。'],
        ['編集好きさん', '人物記事としては評価節より公的経歴を先に整理した方がいい。'],
        ['ななしの利用者', '写真のキャプションで毎回揉めるの、もはや伝統。'],
      ],
      talk: [
        ['人物評価', '掲示板上の印象評を本文へ戻さず、公的経歴と報道記録を優先する。'],
        ['画像キャプション', '感想表現を避け、撮影時期・公開資料名・説明範囲を明確にする。'],
        ['部隊名の表記', '公開資料ごとの表記差を注釈で処理する方針。'],
      ],
      history: [
        ['2026-05-06', '現地資料班', '部隊名表記の注釈を調整'],
        ['2026-05-04', '編集好きさん', '印象評を掲示板側へ戻す'],
        ['2026-05-02', 'ななしの利用者', '画像説明の表現を差し戻し'],
      ],
      pageInfo: {
        revisions: '168版',
        watchers: '74人',
        protection: '半保護',
        quality: '画像説明で議論中',
        lastReviewed: '2026-05-06',
      },
    },
    'history.html': {
      notice: [
        'この一覧は公表された安全保障関連資料の入口であり、未確認の将来事象を扱いません。',
        '事件名、制度名、通称には資料ごとの表記揺れがあります。',
        '掲示板での時系列推測や陰謀論的整理を本文へ移す場合は、検証可能性を確認してください。',
      ],
      trends: ['年表の空白', '境界線って結局何', '共同警備区の表記', '消えた見出し', '古い地図問題'],
      comments: [
        ['ななしの利用者', 'このページ、名前は歴史なのに実質安全保障ポータルなんだよな。'],
        ['資料掘り部', '年表と用語集を分けたい。初見がここで迷子になる。'],
        ['ななしの利用者', '未来の出来事を書き足す人、毎回差し戻されてるのに懲りない。'],
        ['編集好きさん', '事件名の通称を急上昇から拾うと本文が一気に怪しくなる。'],
        ['ななしの利用者', 'ここだけ掲示板が資料請求窓口みたいになってる。'],
      ],
    },
    'faction-japan-kyoto-government.html': {
      trends: ['京都政府呼び問題', '西日本表記', '首相記事へのリンク', '統一政策の出典', '議事録どこ'],
      comments: [
        ['ななしの利用者', '京都政府って通称をタイトルに入れるかで毎回揉めてる。'],
        ['資料掘り部', '行政機構の表、出典ごとに部署名が違う。注釈増やすしかない。'],
        ['編集好きさん', '宣伝っぽい政策説明を削った版の方が百科っぽい。'],
        ['ななしの利用者', '東京政府側の記事と文体合わせたい。片方だけ硬すぎる。'],
        ['ななしの利用者', '関連人物へのリンクが多くて政治まとめサイト感ある。'],
      ],
    },
    'faction-japan-tokyo-government.html': {
      trends: ['東京政府呼び問題', '東日本表記', '生活保障の出典', '統合派とは', '古い声明文'],
      comments: [
        ['ななしの利用者', '東京政府の記事、批判節だけコメント欄みたいな熱量になる。'],
        ['資料掘り部', '生活保障政策の節、一次資料と解説記事を分けた方がいい。'],
        ['編集好きさん', '京都政府側と見出し構成を揃えると比較しやすい。'],
        ['ななしの利用者', '政権呼称を本文で毎回説明するのくどいけど必要。'],
        ['ななしの利用者', 'ここから人物記事に飛ぶと急に掲示板が荒れてて笑う。'],
      ],
    },
  };

  const profile = {
    ...(profiles[pageKind] || profiles.directory),
    ...(pageProfiles[pageName] || {}),
  };
  body.classList.add(`tenzu-kind-${pageKind}`);

  const sectionMap = {
    character: ['人物', 'characters.html'],
    organization: ['組織・団体', 'factions.html'],
    history: ['出来事・安全保障', 'history.html'],
    directory: pageName === 'category-net-slang.html'
      ? ['カテゴリ', 'category-net-slang.html']
      : ['案内', 'index.html'],
  };
  const topicMap = pageName.startsWith('meme-')
    ? ['ネット俗語', 'category-net-slang.html']
    : pageName === 'category-net-slang.html'
      ? ['ネット俗語', 'category-net-slang.html']
      : sectionMap[pageKind];

  const renderNoticeItems = () => profile.notice.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const renderTrendItems = () => profile.trends.map((item) => `<li><a href="#">${escapeHtml(item)}</a></li>`).join('');
  const renderComments = () => profile.comments.map(([name, text], index) => (
    `<div class="tenzu-comment"><span class="tenzu-comment-no">${index + 1}</span><div><span class="tenzu-comment-name">${escapeHtml(name)}</span><p>${escapeHtml(text)}</p></div></div>`
  )).join('');
  const renderTalkItems = () => profile.talk.map(([topic, summary]) => (
    `<li><strong>${escapeHtml(topic)}</strong><span>${escapeHtml(summary)}</span></li>`
  )).join('');
  const renderHistoryRows = () => profile.history.map(([date, user, summary]) => (
    `<tr><td>${escapeHtml(date)}</td><td>${escapeHtml(user)}</td><td>${escapeHtml(summary)}</td></tr>`
  )).join('');
  const renderPageInfoRows = () => {
    const info = profile.pageInfo || {};
    const rows = [
      ['ページ種別', { character: '人物記事', organization: '組織・団体記事', history: '時系列記事', directory: '案内ページ' }[pageKind] || '記事'],
      ['版数', info.revisions || '42版'],
      ['ウォッチ', info.watchers || '16人'],
      ['保護状態', info.protection || '通常'],
      ['品質', info.quality || '確認中'],
      ['最終確認', info.lastReviewed || '2026-05-06'],
    ];
    return rows.map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`).join('');
  };

  const setupArticleSearch = () => {
    const searchForm = document.getElementById('mw-search');
    if (!searchForm || searchForm.dataset.tenzuSearchReady === 'true') return;

    const searchInput = searchForm.querySelector('input[type="search"]');
    if (!searchInput) return;

    searchForm.dataset.tenzuSearchReady = 'true';
    searchForm.removeAttribute('onsubmit');
    searchForm.onsubmit = null;
    searchForm.setAttribute('role', 'search');
    searchForm.style.position = searchForm.style.position || 'relative';
    if (!searchInput.id) {
      searchInput.id = 'mw-search-input';
    }

    let searchIndex = [];
    let currentMatches = [];
    const results = make('ul', 'tenzu-article-search-results');
    results.setAttribute('aria-live', 'polite');
    searchForm.appendChild(results);

    const searchText = (item) => [
      item.title,
      item.summary,
      item.article_type,
      item.nav_section,
      ...(Array.isArray(item.tags) ? item.tags : []),
      ...(Array.isArray(item.aliases) ? item.aliases : []),
      ...(Array.isArray(item.related) ? item.related : []),
    ].filter(Boolean).join(' ').toLowerCase();

    const findMatches = (query) => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return searchIndex.filter((item) => searchText(item).includes(q)).slice(0, 8);
    };

    const renderResults = (matches) => {
      currentMatches = matches;
      if (!matches.length) {
        results.innerHTML = '<li><span>一致する記事がありません</span></li>';
        results.classList.add('show');
        return;
      }
      results.innerHTML = matches.map((item) => (
        `<li><a href="${escapeHtml(item.url)}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.summary)}</small></a></li>`
      )).join('');
      results.classList.add('show');
    };

    fetch('assets/search-index.json')
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        searchIndex = Array.isArray(data) ? data : [];
      })
      .catch(() => {
        searchIndex = [];
      });

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (!query) {
        currentMatches = [];
        results.innerHTML = '';
        results.classList.remove('show');
        return;
      }
      renderResults(findMatches(query));
    });

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const query = searchInput.value.trim().toLowerCase();
      if (!query) return;
      const matches = currentMatches.length ? currentMatches : findMatches(query);
      const exact = matches.find((item) => String(item.title || '').toLowerCase() === query);
      const target = exact || matches[0];
      if (target?.url) {
        location.href = target.url;
      }
    });

    document.addEventListener('click', (event) => {
      if (!results.contains(event.target) && event.target !== searchInput) {
        results.classList.remove('show');
      }
    });
  };

  const portalBar = make('nav', 'tenzu-portal-bar', [
    '<a href="index.html">天通ポータル</a>',
    '<a href="index.html#news">ニュース</a>',
    '<a href="index.html">辞典</a>',
    '<a href="#">動画</a>',
    '<a href="#">生放送</a>',
    '<a href="#">ゲーム</a>',
    '<a href="#">占い</a>',
    '<a href="#">ショッピング</a>',
    '<a href="#">ヘルプ</a>',
  ].join(''));
  portalBar.setAttribute('aria-label', '天通ポータル');
  body.prepend(portalBar);
  setupArticleSearch();

  const header = document.getElementById('mw-head') || document.querySelector('.vector-header');
  if (header) {
    const strip = make('nav', 'tenzu-category-strip', [
      '<a href="index.html">単語記事</a>',
      '<a href="characters.html">人物</a>',
      '<a href="factions.html">組織・団体</a>',
      '<a href="history.html">出来事</a>',
      '<a href="index.html#categories">地域</a>',
      '<a href="index.html#categories">作品</a>',
      '<a href="index.html#bbs">掲示板</a>',
    ].join(''));
    strip.setAttribute('aria-label', '記事分類');
    header.insertAdjacentElement('afterend', strip);
  }

  const article = document.getElementById('mw-article') || document.querySelector('#mw-content-text article, article, #mw-content-text');
  const title = document.getElementById('firstHeading') || document.querySelector('h1.firstHeading, article h1, h1');
  const status = document.querySelector('.page-status') || document.getElementById('contentSub') || title;
  if (article && !article.id) {
    article.id = 'tenzu-article-body';
  }
  const articleTarget = article?.id ? `#${article.id}` : '#top';

  if (article && status && !document.querySelector('.tenzu-breadcrumbs')) {
    const [sectionLabel, sectionUrl] = sectionMap[pageKind] || sectionMap.directory;
    const [topicLabel, topicUrl] = topicMap || [sectionLabel, sectionUrl];
    const breadcrumbs = make('nav', 'tenzu-breadcrumbs', [
      '<a href="index.html">メインページ</a>',
      `<span aria-hidden="true">›</span><a href="${escapeHtml(sectionUrl)}">${escapeHtml(sectionLabel)}</a>`,
      topicUrl !== sectionUrl
        ? `<span aria-hidden="true">›</span><a href="${escapeHtml(topicUrl)}">${escapeHtml(topicLabel)}</a>`
        : '',
      `<span aria-hidden="true">›</span><span>${escapeHtml(pageTitle)}</span>`,
    ].join(''));
    breadcrumbs.setAttribute('aria-label', 'パンくずリスト');
    status.insertAdjacentElement('afterend', breadcrumbs);
  }

  if (article && status && !document.querySelector('.tenzu-article-tabs')) {
    const tabs = make('div', 'tenzu-article-tabs', [
      `<ul><li class="active"><a href="${escapeHtml(articleTarget)}" data-tenzu-tab>記事</a></li><li><a href="#tenzu-note-summary" data-tenzu-tab>ノート</a></li></ul>`,
      `<span class="tenzu-page-kind">${escapeHtml({ character: '人物記事', organization: '組織・団体記事', history: '時系列記事', directory: '案内ページ' }[pageKind] || '記事')}</span>`,
      `<ul><li class="active"><a href="${escapeHtml(articleTarget)}" data-tenzu-tab>閲覧</a></li><li><a href="#tenzu-edit-panel" data-tenzu-tab>編集</a></li><li><a href="#tenzu-history-summary" data-tenzu-tab>履歴表示</a></li></ul>`,
    ].join(''));
    const breadcrumbs = document.querySelector('.tenzu-breadcrumbs');
    (breadcrumbs || status).insertAdjacentElement('afterend', tabs);
  }

  if (article && !document.querySelector('.tenzu-notice-box')) {
    const notice = make('div', 'tenzu-notice-box', [
      '<strong>この記事には複数の問題があります。</strong>',
      '<ul>',
      renderNoticeItems(),
      '</ul>',
    ].join(''));
    const infobox = article.querySelector('.infobox');
    if (infobox) {
      infobox.insertAdjacentElement('beforebegin', notice);
    } else if (title) {
      title.insertAdjacentElement('afterend', notice);
    } else {
      article.prepend(notice);
    }
  }

  const aside = document.getElementById('mw-right-aside') || document.querySelector('.vector-page-tools');
  if (aside && !aside.querySelector('.tenzu-ad-box')) {
    aside.insertAdjacentHTML('beforeend', [
      '<div class="right-aside-title">ページ情報</div>',
      `<table class="tenzu-page-info-mini"><tbody>${renderPageInfoRows()}</tbody></table>`,
      '<div class="right-aside-title">広告</div>',
      '<section class="tenzu-ad-box"><span class="tenzu-ad-label">[PR]</span><p class="tenzu-ad-copy">その疲れ、年齢のせいだけ?</p><img class="tenzu-ad-visual" src="assets/images/portal/ad-natural-support.svg" alt="自然派サポート習慣の広告"><p>話題の自然派サポート習慣。初回限定でお試し。</p><a class="tenzu-ad-cta" href="#">詳しく見る</a></section>',
      '<section class="tenzu-ad-box"><span class="tenzu-ad-label">[広告]</span><p class="tenzu-ad-copy">ピンを抜いて王様を救え!</p><img class="tenzu-ad-visual" src="assets/images/portal/ad-pin-game.svg" alt="ピン抜きゲーム広告"><p>無料で遊べる謎解きゲーム。なぜか広告でよく見るやつ。</p><a class="tenzu-ad-cta" href="#">今すぐプレイ</a></section>',
      '<div class="right-aside-title">急上昇ワード</div>',
      `<ol class="tenzu-trend-list">${renderTrendItems()}</ol>`,
    ].join(''));
  }

  if (article && !document.getElementById('tenzu-bbs')) {
    const pageInfoPanel = make('section', 'tenzu-page-info-panel', [
      '<h2 id="tenzu-page-info">ページ情報</h2>',
      '<table class="tenzu-page-info-table"><tbody>',
      renderPageInfoRows(),
      '</tbody></table>',
    ].join(''));
    const editPanel = make('section', 'tenzu-edit-panel', [
      '<h2 id="tenzu-edit-panel">編集案内</h2>',
      `<p>「${escapeHtml(pageTitle)}」は静的公開版のため、この画面から直接投稿・保存はできません。編集提案はノート要約の論点、出典、差分要約をそろえて提出する運用です。</p>`,
      '<ul>',
      '<li>本文へ反映する前に、公開資料で確認できる範囲を明記してください。</li>',
      '<li>掲示板の感想、俗称、推測は本文ではなくノートまたは関連文化の節で扱ってください。</li>',
      '<li>記事名、カテゴリ、検索索引に影響する変更は関連ページも同時に確認してください。</li>',
      '</ul>',
    ].join(''));
    const discussion = make('section', 'tenzu-discussion-log', [
      '<h2 id="tenzu-note-summary">ノート要約</h2>',
      `<p class="tenzu-log-note">この要約は「${escapeHtml(pageTitle)}」の編集相談で繰り返し出た論点を整理したものです。</p>`,
      `<ul class="tenzu-talk-list">${renderTalkItems()}</ul>`,
      '<h2 id="tenzu-history-summary">編集履歴</h2>',
      '<table class="tenzu-history-table"><thead><tr><th>日付</th><th>利用者</th><th>要約</th></tr></thead><tbody>',
      renderHistoryRows(),
      '</tbody></table>',
    ].join(''));
    const bbs = make('section', 'tenzu-bbs', [
      '<h2 id="tenzu-bbs">掲示板</h2>',
      `<p class="tenzu-bbs-note">この掲示板は「${escapeHtml(pageTitle)}」の過去ログ表示です。新規投稿機能は現在停止しています。</p>`,
      renderComments(),
    ].join(''));
    const categoryBox = article.querySelector('.category-box, #mw-normal-catlinks, .mw-normal-catlinks');
    if (categoryBox) {
      categoryBox.insertAdjacentElement('beforebegin', pageInfoPanel);
      categoryBox.insertAdjacentElement('beforebegin', editPanel);
      categoryBox.insertAdjacentElement('beforebegin', discussion);
      categoryBox.insertAdjacentElement('beforebegin', bbs);
    } else {
      article.appendChild(pageInfoPanel);
      article.appendChild(editPanel);
      article.appendChild(discussion);
      article.appendChild(bbs);
    }
  }

  document.querySelectorAll('[data-tenzu-tab]').forEach((link) => {
    link.addEventListener('click', () => {
      const group = link.closest('ul');
      if (!group) return;
      group.querySelectorAll('li').forEach((item) => item.classList.remove('active'));
      link.closest('li')?.classList.add('active');
    });
  });
})();
