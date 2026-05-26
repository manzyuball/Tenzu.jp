import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const PUBLIC_DATE = '2026-05-06';

const nav = [
  ['index.html', 'メインページ'],
  ['factions.html', '組織・政体'],
  ['characters.html', '人物'],
  ['history.html', '歴史・安全保障'],
];

const pages = [
  {
    file: 'index.html',
    title: '天通辞典',
    subtitle: '西日本側公開資料を中心とする世界内百科',
    type: 'メインページ',
    navSection: 'top',
    description: '天通辞典は、2026年5月6日時点で公開確認できる人物、組織、政体、事件、地域、資料を整理する静的百科です。',
    lead: [
      '天通辞典は、天通編集部が公開資料、報道記録、行政文書、企業資料、地域記録をもとに整理する百科形式の資料集である。扱う範囲は日本列島分断下の人物、組織、政体、産業、治安、社会制度を中心とし、未確認の戦果、非公開作戦、将来の事件は本文の対象外とする。',
      '本サイトは投稿欄や利用者アカウントを持たない静的な公開版である。編集室ログ、最近の更新、公開資料メモは、実際の投稿機能ではなく、掲載記事の見直し状況を示す編集上の記録として配置している。',
    ],
    infobox: [
      ['名称', '天通辞典'],
      ['種別', '公開百科・資料索引'],
      ['基準日', PUBLIC_DATE],
      ['運営', '天通編集部'],
      ['対象', '人物、組織、政体、事件、地域、資料'],
    ],
    sections: [
      ['主要記事', [
        '初回整備では、天通、東京政府、博麗霊夢の記事を代表記事として扱う。企業・政体・人物の三種類を同時に整えることで、以後の記事テンプレート、出典表記、批判節、関連項目の基準を共有できる。',
      ], 'cards'],
      ['最近の更新', [
        '2026年5月6日版では、記事本文を公開時点に固定し、未発生の出来事、非公開作戦、後年の評価を除外した。検索索引は記事タイトル、別名、分類、関連組織から引けるよう再整理した。',
      ]],
      ['編集室ログ', [
        '編集室ログは、公開版の利用者投稿ではなく、天通編集部内の確認メモを要約した静的欄である。現在の重点は、出典風表記の粒度統一、未実装リンクの除去、人物記事の職務上の位置づけの明確化である。',
      ]],
      ['公開資料メモ', [
        '記事内の出典は、作中の公開資料を識別するための書誌風記録として置く。現実世界の検証可能性ではなく、世界内でどの種類の資料に基づく記述かを示すことを目的とする。',
      ]],
    ],
    related: [['faction-tenzu.html', '天通'], ['faction-japan-tokyo-government.html', '日本国（東京政府）'], ['character-hakurei-reimu.html', '博麗霊夢']],
    categories: ['百科', '公開資料', '編集室'],
  },
  {
    file: 'faction-tenzu.html',
    title: '天通',
    subtitle: '西日本の情報通信・報道複合体',
    type: '組織・企業',
    navSection: 'factions',
    description: '天通は大阪市北区に本社を置く情報通信・報道・行政連携サービス企業で、天通辞典および複数の公開情報基盤を運営する。',
    lead: [
      '天通ホールディングス株式会社、通称天通は、大阪市北区に本社を置く西日本の情報通信・報道複合体である。移動通信、固定回線、報道配信、行政API接続、電子商取引、広告配信、災害時情報網を主要領域とし、西日本側の生活基盤と公共情報流通に強い影響を持つ。',
      '公開資料上の天通は、単一の通信会社というより、通信、報道、物流情報、金融決済、公共窓口を接続する基盤事業者として記述される。利便性と安定供給への評価がある一方、行政との距離、情報寡占、利用者データの扱い、地方事業者への影響をめぐる批判も継続している。',
    ],
    infobox: [
      ['正式名称', '天通ホールディングス株式会社'],
      ['通称', '天通'],
      ['本社', '大阪市北区'],
      ['分類', '情報通信・報道・生活基盤企業'],
      ['主要領域', '通信、報道、行政連携、決済、広告、物流情報'],
      ['主要媒体', '天通ニュース、天通辞典、天網中継塔ネットワーク'],
      ['基準日', PUBLIC_DATE],
    ],
    sections: [
      ['概要', [
        '天通の事業は、西日本側の通信網と公開情報サービスを横断する。携帯通信網、地域回線、ニュース配信、行政告知、避難情報、交通運行情報、企業向けAPIを一つの利用者認証圏で扱うため、住民生活における接触頻度は高い。',
        '同社は自社を「公共情報の配送会社」と説明するが、報道機関、通信事業者、広告会社、行政委託先の性格を併せ持つため、制度上の分類は資料によって異なる。',
      ]],
      ['沿革', [
        '天通は、地方通信会社、広告配信会社、報道制作部門、行政向けシステム会社の統合によって拡大した。分断後は、西日本側の情報流通を安定させる事業者として政府・自治体との契約を増やした。',
        '2024年以降、同社は災害情報、治安速報、道路・鉄道運行、行政手続き通知を同一基盤へ集約した。利便性は上がったが、天通を経由しない情報流通が弱くなるとの指摘も増えた。',
      ]],
      ['組織構造', [
        '公開資料で確認できる組織は、通信基盤部門、報道編集部門、公共連携部門、広告配信部門、辞典編集部、地域支局で構成される。持株会社の下に地域子会社と制作会社が置かれるが、非公開の資本関係は本文では断定しない。',
      ]],
      ['主要事業', [
        '通信事業では、携帯回線、固定回線、業務用閉域網、災害時優先通信を扱う。報道事業では、天通ニュース、地域速報、行政会見配信、公開記録アーカイブを運営する。',
        '天通辞典は、ニュース記事とは別に公開資料を整理する資料索引として位置づけられる。編集部は速報性よりも、後から参照できる名称、分類、関係、出典の整理を重視している。',
      ]],
      ['行政との関係', [
        '京都政府、地方自治体、公共交通事業者、防災機関は、天通の配信基盤を告知、通報、申請受付、統計公開に利用している。契約形態は委託、共同運用、広告枠提供、技術協力に分かれる。',
        '批判的報道では、行政情報の入口が天通に集中することで、企業側の編集判断や配信優先順位が公共性に影響する可能性が指摘される。',
      ]],
      ['社会的影響', [
        '天通のサービスは、地方の医療予約、避難所情報、学校連絡、交通運行、求人、商店決済にまで広がっている。高齢者や避難世帯にとっては重要な生活線である一方、紙媒体や独立掲示板に依存する地域との情報格差も残る。',
      ]],
      ['批判・論争', [
        '主な批判は、情報寡占、行政との距離、広告審査の不透明さ、災害時表示順位、利用者行動記録の保存期間に集中する。天通側は、公共連携部門の監査記録と外部有識者会議を公開しているが、会議資料の黒塗り範囲が広いとの指摘がある。',
      ]],
    ],
    related: [['index.html', '天通辞典'], ['factions.html', '組織・政体'], ['faction-japan-kyoto-government.html', '日本国（京都政府）'], ['faction-yamazaki-kawashiro-industries.html', '山崎河城工業']],
    categories: ['組織・企業', '情報通信', '報道', '公共基盤'],
  },
  {
    file: 'faction-japan-tokyo-government.html',
    title: '日本国（東京政府）',
    subtitle: '東日本側の政府機構',
    type: '政体・政府',
    navSection: 'factions',
    description: '日本国（東京政府）は、東京に政府中枢を置く東日本側の統治機構であり、京都政府と同一国号を用いる。',
    lead: [
      '日本国（東京政府）は、東京に政府中枢を置く東日本側の統治機構である。正式国号は日本国であり、同一国号を用いる京都政府と区別するため、天通辞典では便宜上「東京政府」と併記する。',
      '公開資料では、東京政府は首都圏、東北、関東東部、太平洋側の主要港湾、内陸補給線を基盤に、行政、治安、配給、国防、通信統制を行う政府として扱われる。京都政府との承認問題、境界線管理、避難民の扱い、企業統制が主要な争点である。',
    ],
    infobox: [
      ['正式国号', '日本国'],
      ['通称', '東京政府、東日本'],
      ['政府中枢', '東京都'],
      ['分類', '政府・統治機構'],
      ['主要管轄', '首都圏、東北、関東東部、太平洋側港湾'],
      ['主要制度', '配給、治安統制、国防動員、通信管理'],
      ['基準日', PUBLIC_DATE],
    ],
    sections: [
      ['概要', [
        '東京政府は、分断後の東日本側で行政継続を主張する政府機構である。首都圏の人口、金融機能、官僚機構、放送設備、港湾・空港を背景に、東日本側の統治正統性を主張している。',
        '天通辞典では、東京政府と京都政府のいずれか一方の正統性を本文で断定しない。国号、政府所在地、制度、支配地域、公開資料上の呼称を分けて記述する。',
      ]],
      ['沿革', [
        '分断初期、東京政府は中央省庁の継続性と首都機能の維持を強調した。初期の課題は、電力、食料、交通、避難民登録、通信制御の安定化であった。',
        'その後、境界線周辺での治安活動、港湾輸送の再編、官民企業の統制、対外承認工作が政策の中心となった。公開資料では、政策決定過程の一部が安全保障上の理由で伏せられている。',
      ]],
      ['政治制度', [
        '東京政府は議会、内閣、中央省庁、地方行政庁、治安機関を維持していると発表している。ただし、非常措置、通信統制、移動制限、物資配給の権限が広く、平時の行政制度とは異なる運用が確認される。',
      ]],
      ['行政区域と境界線', [
        '主要な管理対象は、東京都、周辺県、東北方面、太平洋側港湾、中央境界線東側の物流拠点である。境界線の実効管理は地域により差があり、共同警備区、立入制限区、避難民登録区が設定されている。',
      ]],
      ['経済と統制', [
        '東京政府は、配給、燃料割当、企業認可、通信帯域、港湾荷役を政策手段としている。首都圏の人口密度と産業集中は強みである一方、食料、電力、地方物流への負荷が大きい。',
      ]],
      ['軍事・治安', [
        '公開資料では、国防組織、警察、沿岸警備、予備部隊、境界線警備が東京政府の主要な安全保障機能として挙げられる。詳細な編制、損耗、非公開作戦は確認不能なため本文では扱わない。',
      ]],
      ['京都政府との関係', [
        '京都政府とは同一国号の使用、外交承認、境界線管理、避難民登録、企業資産、通信網をめぐり対立している。一部の人道、医療、通信復旧では実務協議が行われるが、双方の発表は相互不信を前提としている。',
      ]],
      ['批判・論争', [
        '批判は、非常措置の長期化、報道統制、企業統制、配給の地域差、避難民登録の厳格化に集中する。東京政府は安全保障上必要な措置と説明するが、地方自治体や独立系報道からは権限集中への懸念が示されている。',
      ]],
    ],
    related: [['faction-japan-kyoto-government.html', '日本国（京都政府）'], ['character-toyosato-miko.html', '豊聡耳神子'], ['character-marisa.html', '霧雨魔理沙'], ['history.html', '歴史・安全保障']],
    categories: ['政体', '政府', '東日本', '安全保障'],
  },
  {
    file: 'character-hakurei-reimu.html',
    title: '博麗霊夢',
    subtitle: '京都政府系の治安・境界対応担当者',
    type: '人物',
    navSection: 'characters',
    description: '博麗霊夢は、京都政府側の境界線対応、即応警備、地域調停に関与する人物として公開資料に現れる。',
    lead: [
      '博麗霊夢は、日本国（京都政府）側の治安・境界対応に関与する人物である。公開資料では、中央境界線周辺の即応警備、地域調停、避難民対応、宗教施設・地域共同体との連絡に関わる人物として記録される。',
      '人物像については、政府発表、地域紙、議会質疑、独立系報道で扱いが異なる。天通辞典では、本人の未確認発言、非公開任務、将来の事件を本文で断定せず、確認できる肩書き、職務、評価、論争を分けて記述する。',
    ],
    infobox: [
      ['氏名', '博麗霊夢'],
      ['分類', '人物'],
      ['所属', '日本国（京都政府）側機関'],
      ['主な職務', '境界線対応、即応警備、地域調停'],
      ['活動地域', '中央境界線西側、京都政府管轄地域'],
      ['基準日', PUBLIC_DATE],
    ],
    sections: [
      ['概要', [
        '博麗霊夢は、京都政府側の資料で、境界線周辺の危機対応に関わる人物として確認される。官職名や所属部局は資料により表記が異なり、天通辞典では確定できる範囲に限って記述する。',
        '報道上は、迅速な現場判断、地域共同体との折衝、移動制限下での避難誘導に関する記述が多い。一方、権限の範囲、独自判断の多さ、現場での強制力をめぐる批判もある。',
      ]],
      ['経歴', [
        '初期経歴の詳細は公開資料で一貫しない。分断後の資料では、境界線周辺の警備、避難所調整、宗教施設を含む地域共同体との連絡役として登場する。',
        '2024年以降の地方議会記録では、複数の緊急対応で名前が挙がる。本人の役職を正式な行政職とする資料と、特別協力者として扱う資料が併存している。',
      ]],
      ['職務上の位置づけ', [
        '博麗霊夢の位置づけは、通常の警察官、行政官、軍人のいずれにも完全には収まらない。公開資料上は、治安機関、自治体、宗教施設、地域代表の間を調整する現場対応者として扱われる。',
      ]],
      ['活動', [
        '主な活動は、境界線近傍の避難誘導、通行証確認、地域紛争の仲裁、非常時の連絡網維持、物資配布拠点の安全確認である。特定の戦闘行為や非公開作戦の詳細は確認不能なため扱わない。',
      ]],
      ['関係組織', [
        '京都政府、地方自治体、警備組織、地域共同体、天通の災害情報配信部門との接点がある。天通ニュースでは現場対応者として扱われることが多いが、政府資料では制度名を伏せた記述も見られる。',
      ]],
      ['報道上の評価', [
        '肯定的評価では、即応性、地域住民への説明、行政手続きに乗りにくい問題の処理が挙げられる。批判的評価では、権限の根拠が見えにくいこと、現場判断が制度上の手続きより先行しやすいことが問題視される。',
      ]],
      ['批判・論争', [
        '論争は、境界線周辺での通行制限、避難民への聞き取り、独立系報道への対応、地域団体との距離に集中する。京都政府側は安全確保と迅速対応を理由に挙げるが、第三者監査の不足を指摘する声もある。',
      ]],
    ],
    related: [['characters.html', '人物'], ['faction-japan-kyoto-government.html', '日本国（京都政府）'], ['history.html', '歴史・安全保障'], ['faction-tenzu.html', '天通']],
    categories: ['人物', '治安', '京都政府', '境界線'],
  },
];

const stubs = [
  ['characters.html', '人物', '人物記事の一覧', '公開資料に現れる人物を、所属、職務、報道上の扱い、関係組織から整理する一覧である。', [['character-hakurei-reimu.html', '博麗霊夢'], ['character-marisa.html', '霧雨魔理沙'], ['character-sanae.html', '東風谷早苗'], ['character-yasaka-kanako.html', '八坂神奈子'], ['character-toyosato-miko.html', '豊聡耳神子']]],
  ['factions.html', '組織・政体', '組織・政体記事の一覧', '政府、企業、地域組織、治安組織を公開資料の範囲で整理する一覧である。', [['faction-tenzu.html', '天通'], ['faction-japan-tokyo-government.html', '日本国（東京政府）'], ['faction-japan-kyoto-government.html', '日本国（京都政府）'], ['faction-moriya-yasaka-group.html', '守矢八坂グループ'], ['faction-yamazaki-kawashiro-industries.html', '山崎河城工業'], ['faction-aikawa-gumi.html', '相川組']]],
  ['history.html', '歴史・安全保障', '歴史・安全保障記事の一覧', '分断後の制度、境界線、安全保障、避難、物流、通信復旧に関する記事を整理する一覧である。', [['faction-japan-tokyo-government.html', '日本国（東京政府）'], ['faction-japan-kyoto-government.html', '日本国（京都政府）'], ['faction-tenzu.html', '天通']]],
  ['faction-japan-kyoto-government.html', '日本国（京都政府）', '西日本側の政府機構', '京都に政府中枢を置く西日本側の統治機構。天通辞典では東京政府と区別するため京都政府と併記する。', [['faction-japan-tokyo-government.html', '日本国（東京政府）'], ['faction-tenzu.html', '天通'], ['character-hakurei-reimu.html', '博麗霊夢']]],
  ['character-marisa.html', '霧雨魔理沙', '東京政府側の前線指揮関係者', '東京政府側資料に現れる前線指揮・補給線運用に関わる人物。公開資料では通信、補給、治安対応との接点が確認される。', [['characters.html', '人物'], ['faction-japan-tokyo-government.html', '日本国（東京政府）']]],
  ['character-sanae.html', '東風谷早苗', '京都政府側の政治関係者', '京都政府側の政治・地域調整に関わる人物。公的発表、議会記録、地域報道の間で扱いに差がある。', [['characters.html', '人物'], ['faction-japan-kyoto-government.html', '日本国（京都政府）']]],
  ['character-yasaka-kanako.html', '八坂神奈子', '洩八グループの経営関係者', '地方資源、電力、交通、保守事業に関わる洩八グループの経営関係者。', [['characters.html', '人物'], ['faction-moreya-group.html', '洩八グループ']]],
  ['character-toyosato-miko.html', '豊聡耳神子', '東京政府側の政治指導層', '東京政府側の政治指導層に属し、国家統合、生活保障、行政統制に関与する人物として扱われる。', [['characters.html', '人物'], ['faction-japan-tokyo-government.html', '日本国（東京政府）']]],
  ['faction-moriya-yasaka-group.html', '守矢八坂グループ', '旧称・関連名称', '洩八グループの旧称または関連名称として公開資料に残る呼称。主要記事は洩八グループを参照する。', [['faction-moreya-group.html', '洩八グループ'], ['character-yasaka-kanako.html', '八坂神奈子']]],
  ['faction-yamazaki-kawashiro-industries.html', '山崎河城工業', '技術・防衛複合企業', '防衛、宇宙、自動車、無人機、AIを扱う技術複合企業。公開資料では政府調達との関係が注目される。', [['factions.html', '組織・政体'], ['faction-tenzu.html', '天通']]],
  ['faction-aikawa-gumi.html', '相川組', '港湾・物流周辺組織', '港湾、物流、地域地下経済に関与するとされる組織。公開資料上の確認範囲に限定して扱う。', [['factions.html', '組織・政体'], ['history.html', '歴史・安全保障']]],
];

for (const [file, title, subtitle, description, related] of stubs) {
  if (pages.some(page => page.file === file)) continue;
  pages.push({
    file,
    title,
    subtitle,
    type: file.startsWith('character') ? '人物' : file === 'history.html' ? '歴史・安全保障' : '組織・政体',
    navSection: file === 'characters.html' || file.startsWith('character') ? 'characters' : file === 'history.html' ? 'history' : 'factions',
    description,
    lead: [description],
    infobox: [['名称', title], ['分類', subtitle], ['基準日', PUBLIC_DATE]],
    sections: [
      ['概要', [description]],
      ['掲載方針', ['本文は公開資料で確認できる範囲に限定し、未確認の作戦、将来の出来事、断定できない人物評価を扱わない。']],
      ['関連資料', ['今後の改稿では、出典表記、批判・論争、関係組織、地域別の影響を代表記事の形式に合わせて拡張する。']],
    ],
    related,
    categories: [subtitle, '公開資料'],
  });
}

pages.push({
  file: '404.html',
  title: 'ページが見つかりません',
  subtitle: '404',
  type: '案内',
  navSection: 'top',
  description: '指定されたページは存在しないか、公開版から整理されました。',
  lead: ['指定されたページは存在しないか、公開版から整理されました。メインページ、人物、組織・政体、歴史・安全保障の一覧から目的の記事を探してください。'],
  infobox: [['状態', '404'], ['案内', 'メインページへ戻る']],
  sections: [['案内', ['URLを確認するか、検索欄から記事名、組織名、人物名で検索してください。']]],
  related: [['index.html', 'メインページ'], ['factions.html', '組織・政体'], ['characters.html', '人物'], ['history.html', '歴史・安全保障']],
  categories: ['案内'],
});

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function slug(value) {
  return String(value).normalize('NFKC').replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
}

function links(items) {
  return items.map(([href, label]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`).join('');
}

function referenceList(page) {
  const refs = [
    `${page.title}編集部「${page.title} 公開資料整理票」天通辞典編集室、2026年。`,
    `天通ニュース資料部「${page.type}記事確認メモ」2026年5月6日閲覧版。`,
    `公開会見・地域紙・行政告知の照合記録、天通辞典内部整理番号 ${page.file.replace('.html', '').toUpperCase()}-2026。`,
  ];
  return `<ol class="references">${refs.map((ref, i) => `<li id="cite_note-${i + 1}"><span class="mw-cite-backlink"><a href="#cite_ref-${i + 1}">^</a></span> <span class="reference-text">${esc(ref)}</span></li>`).join('')}</ol>`;
}

const css = `
*,*::before,*::after{box-sizing:border-box}
:root{--text:#202122;--muted:#54595d;--subtle:#72777d;--link:#36c;--visited:#6b4ba1;--border:#a2a9b1;--soft:#eaecf0;--panel:#f8f9fa;--page:#fff;--paper:#fff}
html{font-size:15px;scroll-padding-top:64px}
body{margin:0;color:var(--text);background:#f5f6f7;font-family:-apple-system,BlinkMacSystemFont,"Noto Sans JP","Yu Gothic",Meiryo,sans-serif;line-height:1.72}
a{color:var(--link);text-decoration:none}a:visited{color:var(--visited)}a:hover,a:focus{text-decoration:underline}
.site-header{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:220px minmax(260px,620px) 1fr;gap:16px;align-items:center;min-height:58px;padding:9px 22px;background:#fff;border-bottom:1px solid #c8ccd1}
.brand{display:flex;gap:10px;align-items:center;color:#111}.brand:visited{color:#111}.mark{display:grid;place-items:center;width:38px;height:38px;border:1px solid #a2a9b1;border-radius:50%;font-family:Georgia,serif;font-weight:700}.wordmark{font-family:Georgia,"Times New Roman",serif;font-size:1.35rem;line-height:1}.tagline{display:block;color:var(--muted);font-size:.72rem}
.search{position:relative;display:grid;grid-template-columns:1fr auto;border:1px solid var(--border);background:#fff}.search input{min-width:0;border:0;padding:7px 10px;font:inherit}.search button{border:0;border-left:1px solid var(--border);background:var(--panel);padding:0 12px;cursor:pointer}.search-results{position:absolute;top:100%;left:0;right:0;z-index:60;display:none;margin:1px 0 0;padding:0;list-style:none;background:#fff;border:1px solid var(--border);box-shadow:0 4px 12px #0002}.search-results.show{display:block}.search-results a{display:block;padding:8px 10px}.search-results small{color:var(--muted)}
.top-nav{display:flex;justify-content:flex-end;gap:14px;white-space:nowrap;font-size:.92rem}
.layout{display:grid;grid-template-columns:210px minmax(0,1fr) 245px;gap:22px;max-width:1460px;margin:0 auto;padding:18px 22px 36px}.sidebar,.page-tools{position:sticky;top:76px;align-self:start;max-height:calc(100vh - 92px);overflow:auto;font-size:.9rem}.portal{margin-bottom:16px;padding:12px;background:#fff;border:1px solid #c8ccd1}.portal h2{margin:0 0 8px;padding-bottom:4px;border-bottom:1px solid var(--soft);font-size:.95rem;font-family:inherit;font-weight:700}.portal ul{margin:0;padding:0;list-style:none}.portal li{margin:3px 0}
main{min-width:0;background:#fff;border:1px solid #c8ccd1;padding:26px 34px 38px}.site-sub,.content-sub,.meta{color:var(--muted);font-size:.88rem}
h1{margin:0 0 8px;padding-bottom:7px;border-bottom:1px solid var(--border);font-family:Georgia,"Times New Roman","Yu Mincho",serif;font-size:2rem;font-weight:400;line-height:1.25}h2{clear:both;margin:1.45em 0 .55em;padding-bottom:3px;border-bottom:1px solid var(--border);font-family:Georgia,"Times New Roman","Yu Mincho",serif;font-size:1.48rem;font-weight:400}h3{margin:1em 0 .25em;font-size:1.08rem}p{margin:.55em 0 1em}
.infobox{float:right;width:320px;max-width:100%;margin:.2em 0 1em 1.35em;border:1px solid var(--border);background:var(--panel);border-collapse:collapse;font-size:.88rem}.infobox caption{padding:8px;background:var(--soft);font-weight:700}.infobox th,.infobox td{padding:6px 8px;border:1px solid var(--border);vertical-align:top}.infobox th{width:35%;background:var(--soft);text-align:left}
.toc{display:inline-block;min-width:260px;max-width:100%;margin:12px 0 18px;padding:8px 14px;background:var(--panel);border:1px solid var(--border);font-size:.9rem}.toc-title{text-align:center;font-weight:700}.toc ol{margin:.35em 0 0 1.4em;padding:0}.toc li{margin:2px 0}
.wikitable{width:100%;border-collapse:collapse;margin:1em 0;background:#fff;font-size:.92rem}.wikitable th,.wikitable td{border:1px solid var(--border);padding:7px 8px;vertical-align:top}.wikitable th{background:var(--soft);text-align:left}
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;margin:1em 0}.card{display:block;padding:11px 12px;background:var(--panel);border:1px solid #c8ccd1}.card strong{display:block;color:var(--link)}.note-box{margin:1em 0;padding:10px 12px;border:1px solid #a2a9b1;background:#f8f9fa}
.references{font-size:.86rem}.references li{margin-bottom:.35em}.catlinks{clear:both;margin-top:22px;padding:8px 10px;background:var(--panel);border:1px solid var(--border);font-size:.9rem}.footer{max-width:1460px;margin:0 auto;padding:16px 22px 34px;color:var(--muted);font-size:.84rem}
@media(max-width:1120px){.layout{grid-template-columns:1fr}.sidebar,.page-tools{position:static;max-height:none}.site-header{grid-template-columns:1fr}.top-nav{justify-content:flex-start;overflow:auto}main{padding:20px 16px}.infobox{float:none;width:100%;margin:1em 0}}
`;

function render(page) {
  const contentSections = page.sections.map(([heading, paragraphs, kind], index) => {
    const id = slug(heading);
    const body = kind === 'cards'
      ? `<div class="card-grid">${page.related.map(([href, label]) => `<a class="card" href="${esc(href)}"><strong>${esc(label)}</strong><span>${esc(pages.find(p => p.file === href)?.description || '関連資料')}</span></a>`).join('')}</div>`
      : paragraphs.map((paragraph, i) => `<p>${esc(paragraph)}${i === 0 && index < 3 ? `<sup id="cite_ref-${index + 1}" class="reference"><a href="#cite_note-${index + 1}">[${index + 1}]</a></sup>` : ''}</p>`).join('\n');
    return `<h2 id="${id}">${esc(heading)}</h2>\n${body}`;
  }).join('\n');

  const toc = `<nav class="toc" aria-label="目次"><div class="toc-title">目次</div><ol>${page.sections.concat([['注釈'], ['出典'], ['関連項目']]).map(([heading], i) => `<li><a href="#${slug(heading)}">${i + 1} ${esc(heading)}</a></li>`).join('')}</ol></nav>`;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${esc(page.description)}">
<title>${esc(page.title)} - 天通辞典</title>
<style>${css}</style>
</head>
<body>
<header class="site-header">
  <a class="brand" href="index.html" aria-label="天通辞典 メインページ"><span class="mark">天</span><span><span class="wordmark">天通辞典</span><span class="tagline">世界内公開百科</span></span></a>
  <form class="search" id="searchform" role="search"><input id="searchInput" type="search" placeholder="天通辞典を検索" aria-label="天通辞典を検索"><button type="submit">検索</button><ul id="searchResults" class="search-results" aria-live="polite"></ul></form>
  <nav class="top-nav" aria-label="主要分類">${nav.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav>
</header>
<div class="layout">
  <aside class="sidebar" aria-label="メニュー">
    <section class="portal"><h2>案内</h2><ul>${links(nav)}</ul></section>
    <section class="portal"><h2>代表記事</h2><ul>${links([['faction-tenzu.html','天通'],['faction-japan-tokyo-government.html','日本国（東京政府）'],['character-hakurei-reimu.html','博麗霊夢']])}</ul></section>
    <section class="portal"><h2>編集室</h2><ul><li><a href="editor.html">ローカル編集室</a></li><li><a href="index.html#編集室ログ">編集室ログ</a></li><li><a href="index.html#公開資料メモ">公開資料メモ</a></li></ul></section>
  </aside>
  <main id="content">
    <div class="site-sub">天通辞典からの公開資料</div>
    <h1>${esc(page.title)}</h1>
    <div class="content-sub">${esc(page.subtitle)} / 種別: ${esc(page.type)} / 基準日: ${PUBLIC_DATE}</div>
    <table class="infobox"><caption>${esc(page.title)}</caption><tbody>${page.infobox.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
    ${page.lead.map(paragraph => `<p>${esc(paragraph)}</p>`).join('\n')}
    ${toc}
    ${contentSections}
    <h2 id="注釈">注釈</h2>
    <div class="note-box">本文は${PUBLIC_DATE}時点の公開資料として整理し、未確認の作戦、将来の出来事、後年の総括を除外している。</div>
    <h2 id="出典">出典</h2>
    ${referenceList(page)}
    <h2 id="関連項目">関連項目</h2>
    <ul>${links(page.related)}</ul>
    <div class="catlinks"><strong>カテゴリ:</strong> ${(page.categories || []).map(category => `<a href="${page.navSection === 'characters' ? 'characters.html' : page.navSection === 'history' ? 'history.html' : page.navSection === 'top' ? 'index.html' : 'factions.html'}">${esc(category)}</a>`).join(' | ')}</div>
  </main>
  <aside class="page-tools" aria-label="ページツール">
    <section class="portal"><h2>ページツール</h2><ul><li><a href="#content">先頭へ</a></li><li><a href="#出典">出典</a></li><li><a href="#関連項目">関連項目</a></li><li><a href="https://github.com/manzyuball/Tenzu.jp/blob/main/${esc(page.file)}">ソース表示</a></li></ul></section>
    <section class="portal"><h2>この項目</h2><p class="meta">${esc(page.description)}</p></section>
  </aside>
</div>
<footer class="footer">最終更新 ${PUBLIC_DATE}。公開版は静的HTMLとして配布され、利用者認証、投稿受付、サーバー保存機能は使用しない。</footer>
<script>
(() => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const form = document.getElementById('searchform');
  if (!input || !results || !form) return;
  let index = [];
  const escHtml = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  fetch('assets/search-index.json').then(res => res.ok ? res.json() : []).then(data => { index = Array.isArray(data) ? data : []; }).catch(() => { index = []; });
  const find = query => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter(item => [item.title,item.summary,item.article_type,item.nav_section,...(item.aliases||[]),...(item.tags||[]),...(item.related||[])].join(' ').toLowerCase().includes(q)).slice(0,10);
  };
  const render = items => {
    results.innerHTML = items.length ? items.map(item => '<li><a href="'+escHtml(item.url)+'"><strong>'+escHtml(item.title)+'</strong><br><small>'+escHtml(item.summary)+'</small></a></li>').join('') : '<li><a href="index.html">該当する項目がありません</a></li>';
    results.classList.add('show');
  };
  input.addEventListener('input', () => { const items = find(input.value); if (!input.value.trim()) { results.classList.remove('show'); results.innerHTML = ''; return; } render(items); });
  form.addEventListener('submit', event => { event.preventDefault(); const target = find(input.value)[0]; if (target) location.href = target.url; });
  document.addEventListener('click', event => { if (!form.contains(event.target)) results.classList.remove('show'); });
})();
</script>
</body>
</html>
`;
}

function renderEditor() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ローカル編集室 - 天通辞典</title>
<style>${css}.editor-layout{max-width:1280px;margin:0 auto;padding:22px;display:grid;grid-template-columns:320px 1fr;gap:18px}.editor-panel,.editor-stage{background:#fff;border:1px solid #c8ccd1;padding:14px}.editor-stage textarea{width:100%;min-height:58vh;font:14px/1.6 ui-monospace,Consolas,monospace}.editor-panel input,.editor-panel textarea,.editor-panel select{width:100%;margin:.25em 0 1em;padding:7px;border:1px solid #a2a9b1}.editor-actions{display:flex;gap:8px;flex-wrap:wrap}.editor-actions button{padding:7px 10px;border:1px solid #a2a9b1;background:#f8f9fa;cursor:pointer}@media(max-width:900px){.editor-layout{grid-template-columns:1fr}}</style>
</head>
<body>
<header class="site-header"><a class="brand" href="index.html"><span class="mark">天</span><span><span class="wordmark">天通辞典</span><span class="tagline">ローカル編集室</span></span></a><nav class="top-nav">${nav.map(([href,label]) => `<a href="${href}">${label}</a>`).join('')}</nav></header>
<main class="editor-layout">
  <section class="editor-panel">
    <h1>ローカル編集室</h1>
    <p class="meta">この画面はブラウザ内でHTML下書きを作るための補助画面です。公開サイトへ投稿、保存、送信は行いません。</p>
    <label>ファイル名<input id="filename" value="new-article.html"></label>
    <label>タイトル<input id="title" value="新規記事"></label>
    <label>分類<select id="kind"><option>人物</option><option>組織・政体</option><option>歴史・安全保障</option><option>資料</option></select></label>
    <label>要約<textarea id="summary">公開資料で確認できる範囲を記述する。</textarea></label>
    <div class="editor-actions"><button id="template">雛形を作成</button><button id="download">HTMLを書き出し</button></div>
    <p id="status" class="meta">準備完了。作業内容はこのブラウザ内だけで扱われます。</p>
  </section>
  <section class="editor-stage">
    <textarea id="source"></textarea>
  </section>
</main>
<script>
(() => {
  const source = document.getElementById('source');
  const title = document.getElementById('title');
  const kind = document.getElementById('kind');
  const summary = document.getElementById('summary');
  const filename = document.getElementById('filename');
  const status = document.getElementById('status');
  const make = () => '<article>\\n<h1>'+title.value+'</h1>\\n<p class="meta">種別: '+kind.value+' / 基準日: ${PUBLIC_DATE}</p>\\n<table class="infobox"><caption>'+title.value+'</caption><tbody><tr><th>分類</th><td>'+kind.value+'</td></tr><tr><th>基準日</th><td>${PUBLIC_DATE}</td></tr></tbody></table>\\n<p>'+summary.value+'</p>\\n<h2>概要</h2>\\n<p>公開資料で確認できる内容を記述する。</p>\\n<h2>批判・論争</h2>\\n<p>確認できる批判、反論、留保を分けて記述する。</p>\\n<h2>出典</h2>\\n<ol class="references"><li>天通辞典編集室「公開資料整理票」2026年。</li></ol>\\n</article>\\n';
  document.getElementById('template').addEventListener('click', () => { source.value = make(); status.textContent = '雛形を作成しました。'; });
  document.getElementById('download').addEventListener('click', () => { const blob = new Blob([source.value || make()], {type:'text/html;charset=utf-8'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename.value || 'article.html'; a.click(); URL.revokeObjectURL(a.href); status.textContent = 'HTMLを書き出しました。'; });
  source.value = make();
})();
</script>
</body>
</html>
`;
}

for (const page of pages) {
  fs.writeFileSync(path.join(root, page.file), page.file === 'editor.html' ? renderEditor() : render(page).replace(/[ \t]+$/gm, ''), 'utf8');
}

fs.writeFileSync(path.join(root, 'editor.html'), renderEditor().replace(/[ \t]+$/gm, ''), 'utf8');

const searchIndex = pages
  .filter(page => page.file !== '404.html')
  .map(page => ({
    title: page.title,
    url: page.file,
    summary: page.description,
    tags: [page.subtitle, page.type, ...(page.categories || [])],
    article_type: page.type,
    nav_section: page.navSection,
    aliases: page.title.includes('（') ? [page.title.replace(/（.*?）/g, '')] : [],
    related: page.related.map(([, label]) => label),
  }));
if (fs.existsSync(path.join(root, 'faction-moreya-group.html'))) {
  searchIndex.push({
    title: '洩八グループ',
    url: 'faction-moreya-group.html',
    summary: '地方金融、電力、地域交通、農業流通、保険、自治体インフラ運営などを中核とする生活基盤企業集団。',
    tags: ['生活基盤企業集団', '企業・団体', '西日本', '守矢グループ', 'Moreya'],
    article_type: '組織・企業',
    nav_section: 'factions',
    aliases: ['守矢グループ', 'もりやグループ', 'Moreya Group'],
    related: ['八坂神奈子', '日本国（京都政府）', '天通'],
  });
}
fs.writeFileSync(path.join(root, 'assets', 'search-index.json'), `${JSON.stringify(searchIndex, null, 2)}\n`, 'utf8');

fs.writeFileSync(path.join(root, '_config.yml'), `title: "天通辞典"\ndescription: "2026年5月6日時点の公開資料を整理する世界内百科"\nlang: ja\nurl: "https://manzyuball.github.io"\nbaseurl: "/Tenzu.jp"\nexclude:\n  - README.md\n  - nanboku_nihon_senki.md\n`, 'utf8');

fs.writeFileSync(path.join(root, 'README.md'), `# Tenzu.jp\n\nTenzu.jp は、2026年5月6日時点の公開資料を整理する世界内百科です。公開版は静的HTMLだけで構成し、利用者認証、投稿受付、サーバー保存、外部管理APIは使いません。\n\n## 運用方針\n\n- 既存URLを維持する。\n- 本文は公開資料として書き、作者視点の設定説明や未来の出来事を入れない。\n- 代表記事は、定義、infobox、概要、沿革、構造、活動、関係、批判・論争、注釈、出典、関連項目、カテゴリを持つ。\n- 掲示板感や編集参加感は、静的な編集室ログ、公開資料メモ、最近の更新として表現する。\n\n## 生成\n\n単体HTMLの正本は \`scripts/generate-standalone-tenzu.mjs\` です。通常は次を実行します。\n\n\`\`\`powershell\n& \"C:\\\\Users\\\\kaner\\\\.cache\\\\codex-runtimes\\\\codex-primary-runtime\\\\dependencies\\\\node\\\\bin\\\\node.exe\" scripts/generate-standalone-tenzu.mjs\n\`\`\`\n\n## 品質確認\n\n\`\`\`powershell\npowershell -ExecutionPolicy Bypass -File scripts/tenzu-quality-check.ps1\n\`\`\`\n\n検査内容は、文字化け、内部リンク、検索索引、代表記事の必須節、未実装リンク、静的サイト方針の逸脱です。\n`, 'utf8');

console.log(`Generated ${pages.length} pages and search index.`);
