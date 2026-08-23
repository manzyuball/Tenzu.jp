export function withBase(path = "/"): string {
  const base = import.meta.env.BASE_URL || "/";
  if (/^https?:\/\//i.test(path)) return path;
  if (!path || path === "/") return base;
  if (base !== "/" && (path === base || path.startsWith(base))) return path;
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const raw = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const trimmed = raw.startsWith("/") ? raw.slice(1) : raw;
  return `${base}${trimmed}${hash}`;
}
