import os from "node:os";
import path from "node:path";
import { defineConfig } from "astro/config";

const buildMode = process.env.TENZU_BUILD_MODE === "production" ? "production" : "development";
const site = process.env.TENZU_SITE || "https://manzyuball.github.io";
const base = process.env.TENZU_BASE || "/";

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  vite: {
    cacheDir: path.join(os.tmpdir(), "tenzu-vite"),
    define: {
      "import.meta.env.TENZU_BUILD_MODE": JSON.stringify(buildMode),
    },
  },
});
