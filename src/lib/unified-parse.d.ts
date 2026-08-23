declare module "../../scripts/unified-parse.mjs" {
  export const UNIFIED_NAME: string;
  export const TENZU_FILE_RE: RegExp;
  export function resolveUnifiedPath(tenzuRoot: string): string;
  export function parseTenzuEntries(unifiedText: string): Array<{
    collection: string;
    id: string;
    rel: string;
    data: Record<string, unknown>;
    body: string;
    raw: string;
  }>;
  export function loadTenzuEntries(tenzuRoot: string): Array<{
    collection: string;
    id: string;
    rel: string;
    data: Record<string, unknown>;
    body: string;
    raw: string;
  }>;
}
