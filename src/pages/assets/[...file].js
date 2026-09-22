// Serves vault/assets/ at /assets/ so Obsidian's ![[image]] embeds resolve
// without copying the vault's images into public/.
import fs from 'node:fs';
import path from 'node:path';
import { getVault, VAULT_DIR } from '../../lib/vault.mjs';

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export function getStaticPaths() {
  return [...getVault().assets.values()]
    .filter((rel) => rel.startsWith('assets/'))
    .map((rel) => ({ params: { file: rel.slice('assets/'.length) } }));
}

export function GET({ params }) {
  const file = path.join(VAULT_DIR, 'assets', params.file);
  return new Response(fs.readFileSync(file), {
    headers: { 'Content-Type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream' },
  });
}
