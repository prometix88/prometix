// Run by release-it right after it bumps package.json and rebuilds (see .release-it.json, hook after:bump).
// The widget compares the version injected at build time with the latest one on npm, so a bundle built
// before the bump would report the previous version and block every visitor. Abort the release instead.
import { readFileSync } from 'node:fs';

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/verify-bundle-version.mjs <version>');
  process.exit(1);
}

const bundles = ['index.js', 'index.esm.js', 'prometix.min.js'];
const stale = bundles.filter((file) => !readFileSync(file, 'utf8').includes(`"${version}"`));

if (stale.length > 0) {
  console.error(`Bundle version mismatch: expected "${version}" in ${stale.join(', ')}. Aborting release.`);
  process.exit(1);
}

console.log(`Bundle version OK: "${version}" found in ${bundles.join(', ')}`);
