// graph.json: nodes (slug, title, type, status, tags) + edges (source -> target).
import { getVault, toGraphJson } from '../lib/vault.mjs';

export function GET() {
  return new Response(JSON.stringify(toGraphJson(getVault())), {
    headers: { 'Content-Type': 'application/json' },
  });
}
