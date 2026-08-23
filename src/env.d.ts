/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TENZU_BUILD_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
