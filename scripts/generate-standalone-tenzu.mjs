import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

const css = String.raw`
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #fff; --bg-sidebar: #f8f9fa; --bg-header: #fff; --bg-toc: #f8f9fa;
  --bg-infobox: #f8f9fa; --border: #a2a9b1; --border-light: #eaecf0;
  --link: #36c; --link-visited: #6b4ba1; --link-new: #d33;
  --text: #202122; --text-muted: #54595d; --text-light: #72777d;
  --wikibg: #eaecf0; --notice-bg: #eaf3fb; --notice-border: #36c;
  --infobox-head: #c8d5e8; --infobox-section: #d8e2ee;
}
html { font-size: 14px; scroll-padding-top: 62px; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Noto Sans JP", "Helvetica Neue", Arial, sans-serif;
  color: var(--text); background: var(--wikibg); line-height: 1.65;
}
a { color: var(--link); text-decoration: none; }
a:visited { color: var(--link-visited); }
a:hover, a:focus { text-decoration: underline; }
#mw-head {
  position: sticky; top: 0; z-index: 100; height: 50px; display: flex; align-items: stretch;
  background: var(--bg-header); border-bottom: 1px solid var(--border-light);
  box-shadow: 0 1px 3px rgba(0,0,0,.08);
}
#mw-logo {
  display: flex; align-items: center; gap: 8px; min-width: 180px; padding: 0 16px;
  border-right: 1px solid var(--border-light); text-decoration: none; flex-shrink: 0;
}
.wiki-sphere {
  width: 36px; height: 36px; border-radius: 50%; position: relative; overflow: hidden; flex-shrink: 0;
  background: radial-gradient(circle at 35% 35%, #4a90d9, #1a4a7a); border: 2px solid #2a5ca8;
}
.wiki-sphere::after {
  content: ""; position: absolute; inset: 2px; border-radius: 50%;
  background: repeating-linear-gradient(30deg, transparent, transparent 3px, rgba(255,255,255,.09) 3px, rgba(255,255,255,.09) 4px),
              repeating-linear-gradient(-30deg, transparent, transparent 3px, rgba(255,255,255,.06) 3px, rgba(255,255,255,.06) 4px);
}
.wiki-sphere-letter {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  font-family: Georgia, "Times New Roman", serif; font-weight: 700; font-size: 16px; color: #fff; z-index: 1;
}
#mw-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
#mw-logo-text strong { font-family: Georgia, "Times New Roman", serif; font-size: 16px; color: var(--text); }
#mw-logo-text span { font-size: 10px; color: var(--text-light); letter-spacing: .05em; }
#mw-head-nav { display: flex; align-items: center; padding: 0 8px; flex: 1; gap: 2px; }
.mw-tab {
  display: flex; align-items: center; height: 100%; padding: 0 12px; border-left: 1px solid transparent;
  border-right: 1px solid transparent; color: var(--text-muted); font-size: 13px;
}
.mw-tab.active { color: var(--text); background: #fff; border-left-color: var(--border-light); border-right-color: var(--border-light); border-bottom: 2px solid var(--link); }
#mw-search { display: flex; align-items: center; padding: 8px 14px; gap: 0; }
#mw-search input { width: 230px; height: 32px; padding: 5px 9px; border: 1px solid var(--border); border-right: 0; font: inherit; background: #fff; }
#mw-search button { height: 32px; padding: 0 12px; border: 1px solid var(--border); background: #f8f9fa; cursor: pointer; }
#mw-sidebar {
  position: fixed; top: 50px; left: 0; bottom: 0; width: 176px; overflow-y: auto;
  background: var(--bg-sidebar); border-right: 1px solid var(--border-light); padding: 18px 12px;
}
.sidebar-section { margin-bottom: 20px; }
.sidebar-header { color: var(--text-muted); font-size: 12px; border-bottom: 1px solid var(--border-light); margin-bottom: 6px; padding-bottom: 3px; }
.sidebar-section ul { list-style: none; font-size: 13px; }
.sidebar-section li { margin: 3px 0; }
#mw-content { margin-left: 176px; padding: 16px 24px 38px; }
.content-wrapper { max-width: 1180px; display: grid; grid-template-columns: minmax(0, 1fr) 218px; gap: 20px; align-items: start; }
#mw-article {
  background: var(--bg); border: 1px solid var(--border-light); padding: 24px 32px 34px; min-width: 0;
}
#firstHeading {
  font-family: Georgia, "Times New Roman", "Noto Serif JP", serif; font-weight: 400; font-size: 2.05rem;
  line-height: 1.25; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin-bottom: 8px;
}
.reading-ruby { font-size: .55em; color: var(--text-muted); margin-left: .35em; }
.siteSub, .page-status { color: var(--text-muted); font-size: 12px; margin: 4px 0; }
.notice {
  clear: both; margin: 14px 0; padding: 10px 12px; border: 1px solid var(--notice-border);
  background: var(--notice-bg); font-size: 13px;
}
.infobox {
  float: right; width: 310px; margin: 0 0 16px 22px; border: 1px solid var(--border);
  background: var(--bg-infobox); font-size: 12px; border-collapse: collapse;
}
.infobox-title { background: var(--infobox-head); font-weight: 700; text-align: center; padding: 8px; border-bottom: 1px solid var(--border); font-size: 14px; }
.infobox-subtitle { text-align: center; padding: 5px; border-bottom: 1px solid var(--border-light); color: var(--text-muted); }
.infobox table { width: 100%; border-collapse: collapse; }
.infobox th, .infobox td { border-top: 1px solid var(--border-light); padding: 6px 7px; vertical-align: top; }
.infobox th { width: 34%; text-align: left; background: #eaecf0; font-weight: 700; }
.infobox-section-header td { background: var(--infobox-section); text-align: center; font-weight: 700; }
p { margin: .6em 0 .9em; }
h2 {
  clear: both; margin: 1.35em 0 .55em; padding-bottom: 3px; border-bottom: 1px solid var(--border);
  font-family: Georgia, "Times New Roman", "Noto Serif JP", serif; font-weight: 400; font-size: 1.55rem;
}
h3 { margin: 1.05em 0 .35em; font-size: 1.15rem; }
ul, ol { margin: .45em 0 .85em 1.7em; }
.wikitable { border-collapse: collapse; margin: 1em 0; background: #fff; font-size: 13px; width: 100%; }
.wikitable th, .wikitable td { border: 1px solid var(--border); padding: 7px 8px; vertical-align: top; }
.wikitable th { background: #eaecf0; font-weight: 700; text-align: left; }
#toc {
  display: inline-block; min-width: 280px; max-width: 100%; margin: 14px 0 18px; padding: 0;
  border: 1px solid var(--border); background: var(--bg-toc); font-size: 13px;
}
#toc-title { padding: 7px 10px; font-weight: 700; text-align: center; border-bottom: 1px solid var(--border-light); }
#toc-toggle { color: var(--link); font-weight: 400; cursor: pointer; margin-left: 6px; }
#toc-body { padding: 8px 14px; }
#toc ol { margin: 0 0 0 1.4em; }
#toc li { margin: 2px 0; }
.toc-number { color: var(--text-muted); margin-right: 8px; }
.reference { font-size: .8em; vertical-align: super; line-height: 0; }
.references { font-size: 12px; columns: 2 24em; column-gap: 24px; }
.references li { break-inside: avoid; margin-bottom: 6px; }
.category-box {
  clear: both; margin-top: 22px; padding: 8px 10px; border: 1px solid var(--border);
  background: #f8f9fa; font-size: 13px;
}
#mw-right-aside {
  position: sticky; top: 66px; background: #fff; border: 1px solid var(--border-light); padding: 12px; font-size: 12px;
}
.right-aside-title { font-weight: 700; border-bottom: 1px solid var(--border-light); padding-bottom: 5px; margin-bottom: 8px; }
.right-aside-section { margin-bottom: 13px; }
.right-aside-section ul { margin-left: 1.3em; }
footer {
  margin-left: 176px; padding: 18px 24px 28px; color: var(--text-muted); font-size: 12px;
}
@media (max-width: 980px) {
  #mw-sidebar, #mw-right-aside { display: none; }
  #mw-content, footer { margin-left: 0; }
  .content-wrapper { display: block; }
  #mw-article { padding: 18px 16px 26px; border-left: 0; border-right: 0; }
  .infobox { float: none; width: 100%; margin: 12px 0; }
  #mw-search input { width: 150px; }
}
@media (max-width: 680px) {
  #mw-head { height: auto; flex-wrap: wrap; }
  #mw-logo { min-width: 150px; }
  #mw-head-nav { order: 3; width: 100%; overflow-x: auto; height: 38px; }
  #mw-search { margin-left: auto; }
  #mw-search input { width: 120px; }
  #mw-content { padding: 10px 0 28px; }
  .references { columns: 1; }
}
`;

const script = String.raw`
function toggleToc() {
  const body = document.getElementById('toc-body');
  const btn = document.getElementById('toc-toggle');
  const hidden = body.style.display === 'none';
  body.style.display = hidden ? 'block' : 'none';
  btn.textContent = hidden ? '[非表示]' : '[表示]';
}
function runSearch(event) {
  event.preventDefault();
  const input = document.getElementById('mw-search-input');
  const q = input.value.trim().toLowerCase();
  if (!q) return;
  const links = Array.from(document.querySelectorAll('a[href$=".html"]'));
  const hit = links.find(a => a.textContent.toLowerCase().includes(q) || a.getAttribute('href').toLowerCase().includes(q));
  if (hit) location.href = hit.getAttribute('href');
}
`;

const nav = [
  ['index.html', 'メインページ'],
  ['factions.html', '国家・行政'],
  ['characters.html', '人物'],
  ['history.html', '軍事・安全保障'],
  ['faction-tenzu.html', '企業・団体']
];

const allLinks = [
  ['faction-japan-kyoto-government.html', '日本国（京都政府）'],
  ['faction-japan-tokyo-government.html', '日本国（東京政府）'],
  ['character-hakurei-reimu.html', '博麗霊夢'],
  ['character-marisa.html', '霧雨魔理沙'],
  ['character-sanae.html', '東風谷早苗'],
  ['character-yasaka-kanako.html', '八坂神奈子'],
  ['character-toyosato-miko.html', '豊聡耳神子'],
  ['faction-moreya-group.html', '守矢財閥'],
  ['faction-yamazaki-kawashiro-industries.html', '河城工業'],
  ['faction-tenzu.html', '天通'],
  ['faction-aikawa-gumi.html', '佐渡島組']
];

const pages = [
  {
    file: 'index.html', title: '天通辞典', reading: 'てんつうじてん', kind: 'メインページ',
    description: '天通が運営する公開資料網。日本裂島記の公表時点に西日本側ネット空間で閲覧される百科事典風情報サイト。',
    category: '企業・団体', subtitle: 'Tenzu / 公開資料網', navActive: 'index.html',
    infobox: [['名称', '天通辞典'], ['運営', '天通'], ['種別', '公開資料網'], ['対象', '人物、国家・行政、企業・団体、軍事・安全保障'], ['基準時点', '公表時点']],
    sections: [
      ['概要', ['天通辞典は、天通が運営する公開資料網である。分断下の日本列島に関する人物、行政機構、企業・団体、軍事・安全保障の情報を百科事典風に整理する。', '本サイトは中立的な百科事典形式を採るが、項目の粒度、語彙、参照される資料には西日本側の情報環境が反映されている。']],
      ['収録分野', ['収録分野は人物、国家・行政、企業・団体、軍事・安全保障の四分野を基本とする。地理、技術、メディア、用語は独立分野とせず、関係する記事の本文内で補助的に扱う。']],
      ['編集方針', ['記事は公表時点の公開情報として記述される。未発生の政治事件、未公表の武力衝突、失脚、事後評価、非公開組織に関する断定的記述は扱わない。']]
    ],
    related: [['factions.html', '国家・行政'], ['characters.html', '人物'], ['history.html', '軍事・安全保障']]
  },
  {
    file: 'faction-japan-kyoto-government.html', title: '日本国（京都政府）', reading: 'にほんこく きょうとせいふ', kind: '国家・行政',
    description: '京都に政府中枢を置く日本国。通称は西日本、政権呼称は京都政府。',
    category: '国家・行政', subtitle: '西日本 / 京都政府', navActive: 'factions.html',
    infobox: [['正式名', '日本国'], ['通称', '西日本'], ['政権呼称', '京都政権 / 京都政府'], ['政府所在地', '京都'], ['主要境界', 'フォッサマグナ境界線、中央境界線'], ['主要企業', '守矢財閥、河城工業、天通']],
    notice: 'この記事では、京都に政府中枢を置く日本国について扱う。東京に政府中枢を置く日本国については「日本国（東京政府）」を参照。',
    sections: [
      ['主要統計', ['公表資料では、京都政府は国際的な日本代表権を継承する政府として扱われる。人口、国内総生産、軍事費などの統計は資料により差があり、天通辞典では複数の公開資料を併記する形式を採る。']],
      ['概要', ['日本国（京都政府）は、分断後の日本列島西部を実効支配する政府である。通称として西日本、政権呼称として京都政府が用いられる。', '政治制度は議会制と官僚制を基礎としつつ、中央境界線周辺の安全保障、基幹インフラ、企業集団との政策協調が大きな比重を占める。']],
      ['国号・呼称', ['正式名は日本国である。東側も同じく日本国を正式名とするため、公開資料では京都政府、東京政府、西日本、東日本などの便宜的呼称が多用される。']],
      ['歴史', ['分断以前の制度、戦後処理、停戦体制の成立を経て、京都政府は西側地域の行政、外交、経済政策を担う政権として定着した。']],
      ['政治', ['京都政権の政治は、議会、内閣、中央官庁、自治体、基幹企業の調整によって運用される。東風谷早苗は第10代日本国大統領として、統一政策、ヤタガラス計画、政財界調整に関与する人物として知られる。']],
      ['軍事・安全保障', ['フォッサマグナ境界線、糸魚川、白馬、諏訪、静岡市、佐渡島は安全保障上の主要な対象である。京都政権は自衛隊、警察、海上保安機関、米軍佐渡駐屯部隊との調整を重視する。']],
      ['経済', ['守矢財閥、河城工業、天通は西日本の生活基盤、核融合技術、情報流通に強い影響を持つ。これらの企業群は政府発注、地方インフラ、通信、物流を通じて政策実施に関わる。']],
      ['批判・論争', ['京都政府については、基幹企業との距離の近さ、境界線政策の透明性、地方自治への影響をめぐる批判がある。']]
    ],
    related: [['faction-japan-tokyo-government.html', '日本国（東京政府）'], ['character-sanae.html', '東風谷早苗'], ['faction-moreya-group.html', '守矢財閥']]
  },
  {
    file: 'faction-japan-tokyo-government.html', title: '日本国（東京政府）', reading: 'にほんこく とうきょうせいふ', kind: '国家・行政',
    description: '東日本を支配する神子政権・旧大日本帝国。権威主義的独裁、国家社会主義、国防軍、松代地下司令部を軸に統治する。',
    category: '国家・行政', subtitle: '東日本 / 神子政権', navActive: 'factions.html',
    infobox: [['正式名', '日本国'], ['通称', '東日本'], ['政権呼称', '神子政権 / 東京政府'], ['政府所在地', '東京'], ['主要施設', '松代地下司令部'], ['主要接触地帯', 'フォッサマグナ境界線、中央境界線']],
    notice: 'この記事では、東京に政府中枢を置く日本国について扱う。京都に政府中枢を置く日本国については「日本国（京都政府）」を参照。',
    sections: [
      ['主要統計', ['東京政府の人口、経済、軍事、通信に関する統計は、政府公表、外部推計、亡命者証言の間で差が大きい。天通辞典では、断定を避け、公開資料の出所を明示する。']],
      ['概要', ['日本国（東京政府）は、分断後の日本列島東部を実効支配する政府である。通称として東日本、政権呼称として東京政府、文脈により東側とも呼ばれる。', '中央執政機構、人民代表機関、国防組織、配給・労務制度を通じた統治が特徴とされる。']],
      ['国号・呼称', ['正式名は日本国である。東京政府は自らを日本の正統政府と位置づけ、京都政府による代表権継承を認めない。']],
      ['歴史', ['東京政府の成立は、分断後の東部統治機構と軍事組織の再編に由来する。松代地下司令部は軍事指揮上の象徴的施設としてしばしば言及される。']],
      ['政治', ['豊聡耳神子は神子政権の最高指導層に属する政治家として扱われる。政府宣伝では旧大日本帝国の正統性、国家統合、国家防衛が強調される。']],
      ['行政', ['行政は中央集権的な制度を基礎とし、都市部、工業区、境界線周辺地域で異なる統治手法を採る。国家社会主義的な産業動員と情報統制が統治の特徴とされる。']],
      ['軍事', ['フォッサマグナ境界線、中央境界線、松代地下司令部は軍事・治安政策上の重点である。霧雨魔理沙は東日本国防軍の若手将校候補として、前線指揮と兵站再建に関わる人物として知られる。']],
      ['西日本との関係', ['京都政府との関係は、承認問題、境界線管理、捕虜・越境者対応、諏訪共同工業区の運用をめぐって緊張を含む。']],
      ['批判・論争', ['東京政府については、報道統制、通信監視、移動制限、人権状況に関する批判がある。一方、東京政府系資料は生活保障と秩序維持を強調する。']]
    ],
    related: [['faction-japan-kyoto-government.html', '日本国（京都政府）'], ['character-toyosato-miko.html', '豊聡耳神子'], ['character-marisa.html', '霧雨魔理沙']]
  },
  {
    file: 'characters.html', title: '人物', reading: 'じんぶつ', kind: '一覧',
    description: '公表時点の公開資料に現れる主要人物の一覧。',
    category: '人物', subtitle: '人物一覧', navActive: 'characters.html',
    infobox: [['分野', '人物'], ['対象', '政治家、軍人、企業経営者'], ['基準', '公開資料で確認できる肩書きと活動']],
    sections: [
      ['概要', ['人物分野では、公開資料に現れる政治家、軍人、企業経営者を扱う。未発生の戦果、失脚、死亡、事件後評価は扱わない。']],
      ['主要人物', ['博麗霊夢、霧雨魔理沙、東風谷早苗、八坂神奈子、豊聡耳神子、物部布都を主要人物として扱う。現在この一覧では公開記事のある人物を中心に収録する。']]
    ],
    related: [['character-hakurei-reimu.html', '博麗霊夢'], ['character-marisa.html', '霧雨魔理沙'], ['character-sanae.html', '東風谷早苗'], ['character-yasaka-kanako.html', '八坂神奈子'], ['character-toyosato-miko.html', '豊聡耳神子']]
  },
  {
    file: 'factions.html', title: '国家・行政・企業団体', reading: 'こっか ぎょうせい きぎょうだんたい', kind: '一覧',
    description: '国家、行政機構、企業、団体に関する公開資料の一覧。',
    category: '国家・行政', subtitle: '収録項目一覧', navActive: 'factions.html',
    infobox: [['分野', '国家・行政 / 企業・団体'], ['対象', '政府、企業集団、情報企業、地下経済組織'], ['基準', '公開資料で確認できる制度と活動']],
    sections: [
      ['概要', ['この一覧では、京都政権、神子政権、守矢財閥、河城工業、天通、佐渡島組など、政治・経済・情報流通に関わる主要項目を収録する。']],
      ['国家・行政', ['日本国（京都政府）と日本国（東京政府）は、ともに日本国を正式名とする競合政権である。']],
      ['企業・団体', ['守矢財閥はエネルギー・インフラ・金融、河城工業は核融合炉・監視航空船・精密軍事技術、天通は通信・報道・資料網、佐渡島組は佐渡島周辺の地下経済に関わる。']]
    ],
    related: [['faction-japan-kyoto-government.html', '日本国（京都政府）'], ['faction-japan-tokyo-government.html', '日本国（東京政府）'], ['faction-moreya-group.html', '守矢財閥'], ['faction-yamazaki-kawashiro-industries.html', '河城工業'], ['faction-tenzu.html', '天通']]
  },
  {
    file: 'history.html', title: '軍事・安全保障', reading: 'ぐんじ あんぜんほしょう', kind: '一覧',
    description: '中央境界線、共同警備区、駐屯部隊、技術基盤など軍事・安全保障に関する公開資料。',
    category: '軍事・安全保障', subtitle: '安全保障項目一覧', navActive: 'history.html',
    infobox: [['分野', '軍事・安全保障'], ['主要語', '中央境界線、糸魚川境界区、白馬共同警備区'], ['対象', '公開資料で確認できる制度、部隊、施設']],
    sections: [
      ['概要', ['軍事・安全保障分野では、フォッサマグナ境界線、中央境界線、共同警備区、駐屯部隊、指揮施設、監視網、核融合関連施設などを扱う。独立用語集ではなく、関係記事本文内で説明する。']],
      ['主要地点', ['糸魚川、白馬、松代、諏訪、静岡市、佐渡島、京都、大阪、福岡、東京、岐阜・土岐は公開資料上の主要地点である。松代地下司令部は神子政権側の地下要塞司令部として知られる。']],
      ['技術基盤', ['ヤタガラス計画、核融合炉、長期滞空監視航空船、正体不明機、最新対空ミサイル「鏑矢」は、河城工業、守矢財閥、天通、軍事・安全保障記事内で扱う。']]
    ],
    related: [['faction-yamazaki-kawashiro-industries.html', '河城工業'], ['faction-tenzu.html', '天通'], ['faction-japan-kyoto-government.html', '日本国（京都政府）']]
  }
];

const people = [
  ['character-hakurei-reimu.html', '博麗霊夢', 'はくれい れいむ', '西日本側自衛隊の高級指揮官候補。静岡方面の防衛、中央境界線周辺の即応、直感的な戦況判断で扱われる。', '人物', '西日本側自衛隊', '高級指揮官候補'],
  ['character-marisa.html', '霧雨魔理沙', 'きりさめ まりさ', '東日本国防軍の若手将校候補。前線指揮、火力運用、兵站再建、現場判断で扱われる。', '人物', '東日本国防軍', '若手将校候補'],
  ['character-sanae.html', '東風谷早苗', 'こちや さなえ', '日本国（京都政権）の第10代日本国大統領。ヤタガラス計画、核融合政策、政財界調整に関与する。', '人物', '日本国（京都政権）', '第10代日本国大統領'],
  ['character-yasaka-kanako.html', '八坂神奈子', 'やさか かなこ', '守矢財閥会長。エネルギー、インフラ、金融、軍産複合体、核融合産業化を束ねる人物として知られる。', '人物', '守矢財閥', '会長'],
  ['character-toyosato-miko.html', '豊聡耳神子', 'とよさとみみ の みこ', '神子政権の中心人物。旧大日本帝国の正統性、國體再設計、国防軍統制に関わる人物として扱われる。', '人物', '神子政権', '東日本側元首']
];

for (const [file, title, reading, desc, category, org, role] of people) {
  pages.push({
    file, title, reading, kind: '人物', description: desc, category, subtitle: `${org} / ${role}`, navActive: 'characters.html',
    infobox: [['氏名', title], ['所属', org], ['役職', role], ['活動分野', '政治・軍事・公共圏'], ['記事基準', '公開資料で確認できる経歴']],
    sections: [
      ['概要', [`${title}は、${desc}`]],
      ['経歴', [`公開資料で確認できる経歴は、所属組織での職務、報道された活動、式典・講演・政策発表などに限られる。私的経歴や未公表任務については、資料ごとの差が大きい。`]],
      ['活動・役割', [`現在の役割は${role}としての公的活動に集中する。境界線政策、組織運営、広報、現場対応などへの関与が資料上で確認される。`]],
      ['評価', [`評価は立場により分かれる。支持者は実務能力と象徴性を挙げ、批判的報道は組織内での影響力、説明責任、政権・企業との距離を論点とする。`]]
    ],
    related: [['characters.html', '人物'], [org.includes('東京') ? 'faction-japan-tokyo-government.html' : org.includes('守矢') ? 'faction-moriya-yasaka-group.html' : 'faction-japan-kyoto-government.html', org]]
  });
}

const orgs = [
  ['faction-moreya-group.html', '守矢財閥', 'もりやざいばつ', '八坂神奈子が率いる西日本側の巨大企業集団。エネルギー、インフラ、金融、軍産複合体、ヤタガラス計画を支える。', '企業・団体', 'エネルギー・インフラ財閥', [['正式表記', '守矢財閥'], ['関連語', '守矢グループ'], ['主要分野', 'エネルギー、インフラ、金融、核融合投資']]],
  ['faction-moriya-yasaka-group.html', '守矢グループ', 'もりやグループ', '守矢財閥の関連語・旧称として扱われる名称。公開資料では守矢財閥を標準表記とする。', '企業・団体', '守矢財閥の関連語', [['正式表記', '守矢財閥'], ['関連語', '守矢グループ'], ['主要分野', 'エネルギー、インフラ、金融']]],
  ['faction-yamazaki-kawashiro-industries.html', '河城工業', 'かわしろこうぎょう', '核融合炉、長期滞空監視航空船、精密軍事技術を担う技術複合企業。', '企業・団体', '技術複合企業', [['正式表記', '河城工業'], ['主要分野', '核融合、監視航空船、精密軍事技術'], ['関連計画', 'ヤタガラス計画']]],
  ['faction-tenzu.html', '天通', 'てんつう', '通信、報道、Tenzu.jp、天通辞典、情報商品化を担う情報複合体。', '企業・団体', '情報複合体', [['正式表記', '天通'], ['主要事業', '通信、報道、Tenzu.jp、資料網'], ['主要人物', '射命丸文、菅牧典']]],
  ['faction-aikawa-gumi.html', '佐渡島組', 'さどしまぐみ', '佐渡島周辺の港湾、物流、地下経済に関与するとされる組織。', '企業・団体', '地下経済組織', [['正式表記', '佐渡島組'], ['活動地域', '佐渡特別管理区、日本海沿岸'], ['関連主体', '米軍佐渡駐屯部隊']]]
];

for (const [file, title, reading, desc, category, subtitle, info] of orgs) {
  pages.push({
    file, title, reading, kind: category, description: desc, category, subtitle, navActive: 'factions.html',
    infobox: info,
    sections: [
      ['概要', [`${title}は、${desc}`]],
      ['沿革', ['分断後の制度再編、地方インフラ更新、境界線周辺の安全保障需要を背景に、現在の組織形態が形成された。']],
      ['活動・役割', ['活動は公開資料、企業発表、行政資料、報道により確認される範囲に限られる。技術、メディア、物流、地域統治に関する情報は、独立分野ではなく当該組織の活動として扱う。']],
      ['評価', ['社会的評価は利便性、雇用、技術力への評価と、寡占、監督不足、政治との近さへの批判が併存する。']]
    ],
    related: [['factions.html', '国家・行政・企業団体'], ['history.html', '軍事・安全保障']]
  });
}

pages.push({
  file: '404.html', title: 'ページが見つかりません', reading: '404', kind: '案内',
  description: '要求されたページは存在しない。',
  category: '案内', subtitle: '404', navActive: 'index.html',
  infobox: [['状態', '404'], ['案内', 'メインページへ戻る']],
  sections: [['概要', ['要求されたページは存在しないか、単体HTML化の過程で公開導線から外されています。']]], related: [['index.html', 'メインページ']]
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function slug(value) {
  return `sec-${value.replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '') || 'section'}`;
}

function ref(n) {
  return `<sup id="cite_ref-${n}" class="reference"><a href="#cite_note-${n}">[${n}]</a></sup>`;
}

function toc(sections) {
  return `<div id="toc"><div id="toc-title">目次 <span id="toc-toggle" onclick="toggleToc()">[非表示]</span></div><div id="toc-body"><ol>${sections.map((s, i) => `<li><a href="#${slug(s[0])}"><span class="toc-number">${i + 1}</span>${escapeHtml(s[0])}</a></li>`).join('')}</ol></div></div>`;
}

function wikitable(headers, rows) {
  return `<table class="wikitable"><thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function pageLinks(items) {
  return items.map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join('');
}

function enrichPages() {
  const byFile = Object.fromEntries(pages.map(page => [page.file, page]));

  for (const file of ['faction-japan-kyoto-government.html', 'faction-japan-tokyo-government.html']) {
    const page = byFile[file];
    if (!page) continue;
    page.extraHtml = [
      wikitable(
        ['指標', '公開資料上の扱い', '記事上の注記'],
        file.includes('kyoto')
          ? [
              ['正式国号', '日本国', '東京政府側も同一国号を称するため、記事名では京都政府を併記する。'],
              ['通称', '西日本', '地域名としての西日本と、政権を指す西日本が文脈により併用される。'],
              ['主要接触地帯', '中央境界線、糸魚川境界区、白馬共同警備区、京浜境界区', '軍事資料では糸魚川正面などの呼称も用いられる。'],
              ['主要基盤企業', '守矢財閥、河城工業、天通', 'エネルギー、核融合技術、情報流通を分担する企業群として記述される。']
            ]
          : [
              ['正式国号', '日本国', '京都政府側も同一国号を称するため、記事名では東京政府を併記する。'],
              ['通称', '東日本', '東京政府、東日本、東側が文脈により使い分けられる。'],
              ['主要施設', '松代地下司令部、京浜境界区、中央境界線東側施設群', '軍事・行政資料で扱いが分かれる。'],
              ['主要制度', '配給、労務、通信管理、国防動員', '東京政府系資料は生活保障、外部資料は統制面を強調する。']
            ]
      )
    ];
    page.sections.push(
      ['社会', ['社会制度は、都市部の配給、職場単位の登録、学校・地域組織、通信利用記録を通じて把握される。公的資料は安定供給と共同体維持を強調するが、外部報道では移動、発言、情報入手の制約が論点となる。']],
      ['外交', ['外交上の扱いは承認問題と安全保障秩序に左右される。国際機関、周辺国、在外邦人団体、軍事同盟の文書では、正式国号と便宜的呼称が併用される。']],
      ['関連する地名・施設', ['中央境界線、糸魚川境界区、白馬共同警備区、松代地下司令部、諏訪共同工業区、佐渡特別管理区、京浜境界区は、国家記事の中で補助的に説明される。独立した地理カテゴリは設けない。']]
    );
  }

  for (const page of pages.filter(page => page.category === '人物')) {
    page.extraHtml = [
      wikitable(
        ['項目', '内容'],
        [
          ['扱い', '公開資料で確認できる肩書き、職務、報道上の評価を中心に記述する。'],
          ['除外', '未発生の戦果、失脚、死亡、事件後評価は扱わない。'],
          ['主な資料', '政府発表、組織発表、報道、講演録、公開行事記録。']
        ]
      )
    ];
    page.sections.push(
      ['報道上の扱い', ['人物記事では、公的発表だけでなく、新聞、ネットメディア、業界紙、週刊誌の扱いも整理する。ただし噂は断定せず、報道の出所と文脈を示す。']],
      ['職務上の位置づけ', ['人物の位置づけは、肩書きだけでなく、どの制度や組織の中で行動しているかによって説明される。政治家であれば政策会議、選挙区、党内派閥、官庁との関係が重視される。軍人であれば担当区域、指揮系統、補給や通信への関与、境界線周辺での小規模対応が主な説明対象となる。企業経営者であれば、資本配分、地域事業、行政との協議、系列企業の再編が中心となる。']],
      ['公的評価', ['公的評価では、政府広報、組織発表、議会質疑、式典記録、業界紙の記述を区別する。称賛的な表現は、その発信主体が本人の所属組織なのか、第三者の報道機関なのかで意味が変わるため、記事本文では断定的な人物評を避ける。']],
      ['批判・論争', ['批判や論争は、勤務姿勢、利益相反、報道対応、政策判断、組織内での影響力を中心に扱う。私生活や未確認の噂は、公開資料で社会的論点として扱われている場合を除き、記事の中心には置かない。']],
      ['公開資料での制約', ['軍人や政治家については非公開任務、内部人事、未発表の作戦、将来の政治的帰結を扱わない。記事は公表時点で利用者が確認できる資料の範囲に限る。']]
    );
  }

  for (const page of pages.filter(page => page.category === '企業・団体')) {
    page.extraHtml = [
      wikitable(
        ['観点', '記事での扱い'],
        [
          ['事業領域', '生活基盤、技術、通信、物流、地下経済などを組織ごとの活動として説明する。'],
          ['行政との関係', '発注、認可、共同事業、規制を通じた関係を扱う。'],
          ['批判点', '寡占、監督不足、政治との距離、地域社会への影響を扱う。']
        ]
      )
    ];
    page.sections.push(
      ['組織構造', ['組織構造は、持株会社、系列会社、関連団体、地域拠点、行政との窓口に分けて説明される。公開資料で確認できない出資関係や非公開部門は断定しない。']],
      ['主要事業', ['主要事業は、生活基盤、通信、物流、金融、装備調達、港湾、報道、資料網など、社会機能に直結する領域に分かれる。単なる業種分類ではなく、行政や住民がどの機能に依存しているかを軸に記述する。']],
      ['行政との関係', ['行政との関係は、補助金、認可、委託、共同事業、災害対応、境界線周辺の安全保障契約に現れる。企業側は公共性と効率性を強調する一方、批判的報道では政策決定と企業利益の境界が曖昧になりやすい点が論じられる。']],
      ['技術・情報基盤', ['技術、メディア、用語、地理に関する説明は独立カテゴリにせず、組織の活動の一部として扱う。ヤタガラス計画、核融合炉、長期滞空監視航空船、正体不明機、天通辞典、Tenzu.jpなどは、河城工業、守矢財閥、天通の事業、または軍事・安全保障記事内で説明する。']],
      ['社会的影響', ['企業・団体は雇用、生活基盤、物流、情報流通、技術調達を通じて地域社会に影響を及ぼす。利便性や安定供給への評価と、寡占や監督不足への批判が併存する。']],
      ['批判・論争', ['批判点は、価格決定の透明性、行政への影響、地方事業者の排除、個人情報や通信記録の扱い、下請企業への負担に集中する。記事では企業発表と批判的報道を並置し、どちらか一方の宣伝文体に寄せない。']]
    );
  }
}

enrichPages();

function render(page) {
  const sections = page.sections.map((section, i) => {
    const [heading, paras] = section;
    return `<h2 id="${slug(heading)}">${escapeHtml(heading)}</h2>\n${paras.map((p, j) => `<p>${escapeHtml(p)}${j === 0 ? ref(i + 1) : ''}</p>`).join('\n')}`;
  }).join('\n');
  const references = page.sections.map((section, i) => `<li id="cite_note-${i + 1}"><span class="mw-cite-backlink"><a href="#cite_ref-${i + 1}">↑</a></span> <span class="reference-text">天通辞典編集部「${escapeHtml(page.title)} ${escapeHtml(section[0])}」公開資料整理、2026年。</span></li>`).join('\n');
  const categories = [page.category, page.kind, '日本裂島記'].filter((v, i, a) => a.indexOf(v) === i);
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="${escapeHtml(page.description)}">
<title>${escapeHtml(page.title)} - Tenzu</title>
<style>
${css}
</style>
</head>
<body>
<header id="mw-head">
  <a id="mw-logo" href="index.html" aria-label="Tenzu メインページ">
    <span class="wiki-sphere" aria-hidden="true"><span class="wiki-sphere-letter">天</span></span>
    <span id="mw-logo-text"><strong>Tenzu</strong><span>天通辞典</span></span>
  </a>
  <nav id="mw-head-nav" aria-label="ページ操作">
    <a class="mw-tab active" href="${page.file}">閲覧</a>
    <a class="mw-tab" href="#sec-出典">出典</a>
    <a class="mw-tab" href="#sec-関連項目">関連項目</a>
  </nav>
  <form id="mw-search" onsubmit="runSearch(event)">
    <input id="mw-search-input" type="search" placeholder="Tenzu内を検索" aria-label="Tenzu内を検索">
    <button type="submit">検索</button>
  </form>
</header>
<nav id="mw-sidebar" aria-label="サイドナビゲーション">
  <div class="sidebar-section"><div class="sidebar-header">案内</div><ul>${pageLinks(nav)}</ul></div>
  <div class="sidebar-section"><div class="sidebar-header">主要項目</div><ul>${pageLinks(allLinks.slice(0, 8))}</ul></div>
  <div class="sidebar-section"><div class="sidebar-header">関連項目</div><ul>${pageLinks(page.related || [])}</ul></div>
</nav>
<main id="mw-content">
  <div class="content-wrapper">
    <article id="mw-article">
      <h1 id="firstHeading">${escapeHtml(page.title)}<span class="reading-ruby">（${escapeHtml(page.reading)}）</span></h1>
      <div class="siteSub">出典: 天通辞典</div>
      <div class="page-status">公開資料基準: 公表時点 / 分類: ${escapeHtml(page.category)}</div>
      ${page.notice ? `<div class="notice">${escapeHtml(page.notice)}</div>` : ''}
      <div class="infobox">
        <div class="infobox-title">${escapeHtml(page.title)}</div>
        <div class="infobox-subtitle">${escapeHtml(page.subtitle)}</div>
        <table><tbody>
          <tr class="infobox-section-header"><td colspan="2">基本情報</td></tr>
          ${page.infobox.map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join('\n')}
        </tbody></table>
      </div>
      <p><b>${escapeHtml(page.title)}</b>は、${escapeHtml(page.description)}${ref(1)}</p>
      ${toc([...page.sections, ['注釈', []], ['出典', []], ['関連項目', []]])}
      ${(page.extraHtml || []).join('\n')}
      ${sections}
      <h2 id="sec-注釈">注釈</h2>
      <ol class="references"><li>この記事は作中社会の公開資料としての体裁を採り、未発生事件や非公開組織の断定的記述を避けている。</li></ol>
      <h2 id="sec-出典">出典</h2>
      <ol class="references">${references}</ol>
      <h2 id="sec-関連項目">関連項目</h2>
      <ul>${pageLinks(page.related || [])}</ul>
      <div class="category-box"><strong>カテゴリ:</strong> ${categories.map(c => `<a href="${categoryHref(c)}">${escapeHtml(c)}</a>`).join(' | ')}</div>
    </article>
    <aside id="mw-right-aside">
      <div class="right-aside-title">ページツール</div>
      <div class="right-aside-section"><ul><li><a href="#firstHeading">先頭へ</a></li><li><a href="#toc">目次</a></li><li><a href="#sec-出典">出典</a></li></ul></div>
      <div class="right-aside-title">この項目</div>
      <div class="right-aside-section"><p>${escapeHtml(page.kind)}</p><p>${escapeHtml(page.subtitle)}</p></div>
    </aside>
  </div>
</main>
<footer>
  <p>このページは天通辞典の単体HTML資料です。内容は公表時点の公開資料として記述されています。</p>
  <p><a href="index.html">メインページ</a> | <a href="factions.html">国家・行政</a> | <a href="characters.html">人物</a> | <a href="history.html">軍事・安全保障</a></p>
</footer>
<script>
${script}
</script>
</body>
</html>
`;
}

function categoryHref(category) {
  if (category === '人物') return 'characters.html';
  if (category === '軍事・安全保障') return 'history.html';
  if (category === '企業・団体') return 'factions.html';
  if (category === '国家・行政') return 'factions.html';
  return 'index.html';
}

for (const page of pages) {
  fs.writeFileSync(path.join(root, page.file), render(page).replace(/[ \t]+$/gm, ''), 'utf8');
}

const removed = path.join(root, 'world-technology.html');
if (fs.existsSync(removed)) fs.unlinkSync(removed);

const searchIndex = pages.filter(page => page.file !== '404.html').map(page => ({
  title: page.title,
  url: page.file,
  summary: page.description,
  tags: [page.category, page.kind, page.subtitle, page.reading].filter(Boolean),
  article_type: page.category,
  nav_section: page.navActive.replace('.html', ''),
  aliases: [],
  related: (page.related || []).map(([, label]) => label)
}));
fs.writeFileSync(path.join(root, 'assets', 'search-index.json'), `${JSON.stringify(searchIndex, null, 2)}\n`, 'utf8');

console.log(`Generated ${pages.length} standalone HTML pages.`);
