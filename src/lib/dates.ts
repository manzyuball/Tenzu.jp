const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export function ymd(value: Date | string): { y: number; m: number; d: number } {
  if (typeof value === "string") {
    const m = value.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
  }
  const dt = value instanceof Date ? value : new Date(value);
  const iso = dt.toISOString();
  if (iso.endsWith("T00:00:00.000Z")) {
    const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
    return { y, m, d };
  }
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() };
}

export function formatWorldDate(value: Date | string): string {
  const { y, m, d } = ymd(value);
  return `${y}年${m}月${d}日`;
}

/** Yahoo!ニュースの日付帯：1月15日(土) */
export function formatNewsBarDate(value: Date | string): string {
  const { m, d } = ymd(value);
  return `${m}月${d}日(${weekdayLabel(value)})`;
}

/** 一覧・トピックス用：1月15日 */
export function formatMdDate(value: Date | string): string {
  const { m, d } = ymd(value);
  return `${m}月${d}日`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function datePath(value: Date | string): { year: string; month: string; day: string } {
  const { y, m, d } = ymd(value);
  return { year: String(y), month: pad2(m), day: pad2(d) };
}

export function weekdayLabel(value: Date | string): string {
  const { y, m, d } = ymd(value);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return WEEKDAYS[dt.getUTCDay()];
}

export function isoDate(value: Date | string): string {
  const { y, m, d } = ymd(value);
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

export function compareIsoDesc(a: Date | string, b: Date | string): number {
  return isoDate(b).localeCompare(isoDate(a));
}
