export const CATEGORY_LABEL: Record<"person" | "org" | "place" | "event" | "misc", string> = {
  person: "人物",
  org: "企業・団体",
  place: "地理",
  event: "歴史・事件",
  misc: "その他",
};

export const CATEGORY_ORDER = ["person", "org", "place", "event", "misc"] as const;

export const CORP_NAV: { slug: string; title: string }[] = [
  { slug: "gaiyo", title: "会社概要" },
  { slug: "saiyo", title: "採用情報" },
  { slug: "kokoku", title: "広告掲載のご案内" },
  { slug: "hyoki-ni-tsuite", title: "天通標準表記について" },
  { slug: "teisei", title: "訂正一覧" },
  { slug: "kiyaku", title: "利用規約" },
  { slug: "privacy", title: "個人情報の取り扱い" },
  { slug: "toiawase", title: "お問い合わせ" },
];
