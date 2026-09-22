// Runs an Astro command with drafts shown (SHOW_DRAFTS=1), the same on every OS:
//   npm run dev:drafts     npm run build:drafts
import { spawn } from 'node:child_process';

const child = spawn('npx', ['astro', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, SHOW_DRAFTS: '1' },
});
child.on('exit', (code) => process.exit(code ?? 0));
