import fs from "node:fs";
import path from "node:path";
import type { Loader } from "astro/loaders";
import { fileURLToPath } from "node:url";
import { loadTenzuEntries, resolveUnifiedPath } from "../../scripts/unified-parse.mjs";

const TENZU_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function tenzuLoader(collection: "dict" | "news" | "corp"): Loader {
  return {
    name: `tenzu-unified-${collection}`,
    load: async ({ store, parseData, generateDigest, watcher, logger, config }) => {
      const unified = resolveUnifiedPath(TENZU_ROOT);
      if (!fs.existsSync(unified)) {
        throw new Error(`統合文書が見つからない: ${unified}`);
      }
      watcher?.add(unified);
      const relative = path
        .relative(fileURLToPath(config.root), unified)
        .replaceAll("\\", "/");
      const entries = loadTenzuEntries(TENZU_ROOT).filter((e) => e.collection === collection);
      store.clear();
      for (const entry of entries) {
        const data = await parseData({
          id: entry.id,
          data: entry.data as Record<string, unknown>,
          filePath: unified,
        });
        store.set({
          id: entry.id,
          data,
          body: entry.body,
          digest: generateDigest(entry.raw),
          filePath: relative,
        });
      }
      logger.info(`統合文書から ${collection} ${entries.length} 件`);
    },
  };
}
