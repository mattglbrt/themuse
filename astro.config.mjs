// @ts-check
import path from 'node:path';
import { defineConfig } from 'astro/config';

// Content comes from vault/ via src/lib/vault.mjs (not content collections),
// so the vault stays plain Obsidian markdown. In dev, a vault edit reloads
// the browser; pages re-read the vault on every request.
const vaultReload = {
  name: 'vault-reload',
  hooks: {
    'astro:server:setup': ({ server }) => {
      const vault = path.resolve('vault');
      server.watcher.add(vault);
      const reload = (file) => {
        if (path.resolve(file).startsWith(vault)) server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('change', reload).on('add', reload).on('unlink', reload);
    },
  },
};

export default defineConfig({
  output: 'static',
  integrations: [vaultReload],
});
