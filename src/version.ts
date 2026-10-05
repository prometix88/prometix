declare const __PROMETIX_VERSION__: string | undefined;

// Injected from package.json at build time (see rollup.config.mjs).
// Stays null when running from source (vite dev), which skips the version check.
export const PROMETIX_VERSION: string | null =
  typeof __PROMETIX_VERSION__ === 'string' ? __PROMETIX_VERSION__ : null;
