// Reads vault/ into a graph. Plain Node (no Astro APIs) so the validator
// can import it too. The vault is Obsidian's; this only ever reads it.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

export const VAULT_DIR = path.resolve(process.cwd(), 'vault');

// Top-level vault folders that are not nodes (Obsidian's template folder).
const SKIP_DIRS = new Set(['templates']);

// Slugs that would collide with site routes.
export const RESERVED_SLUGS = new Set(['index', 'assets', 'graph', 'graph.json', '404']);

export const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

// [[target]], [[target|alias]], [[target#heading]], ![[embed]]
export const WIKILINK_RE = /(!?)\[\[([^\[\]|#^]*)(#[^\[\]|]*)?(\^[^\[\]|]*)?(?:\|([^\[\]]*))?\]\]/g;

export const toSlug = (name) =>
  path.basename(name.trim().replace(/\\/g, '/')).replace(/\.md$/i, '').toLowerCase();

function walk(dir, rel = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!rel && SKIP_DIRS.has(entry.name)) continue;
      out.push(...walk(path.join(dir, entry.name), relPath));
    } else {
      out.push(relPath);
    }
  }
  return out;
}

export function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!m) return { yaml: null, body: raw };
  return { yaml: m[1], body: raw.slice(m[0].length) };
}

// Drop fenced and inline code so links inside code samples don't count.
const stripCode = (md) => md.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '');

function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

// Last-edited date per vault file: the last commit that touched it, falling
// back to file mtime for files git doesn't know yet. (Git, not mtime, on
// Netlify: a fresh clone stamps every file with the clone time.)
function gitDates(vaultDir) {
  const dates = new Map();
  try {
    const out = execFileSync(
      'git',
      ['-c', 'core.quotePath=false', 'log', '--format=@date %cI', '--name-only', '--relative', '--', '.'],
      { cwd: vaultDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    let date;
    for (const line of out.split('\n')) {
      if (line.startsWith('@date ')) date = line.slice(6);
      else if (line.trim() && !dates.has(line.trim())) dates.set(line.trim(), date);
    }
  } catch {
    // no git, or no commits yet: mtime fallback below
  }
  return dates;
}

export function extractLinks(text) {
  const links = [];
  for (const m of text.matchAll(WIKILINK_RE)) {
    const [, bang, target, heading, , alias] = m;
    if (!target.trim()) continue; // [[#heading]] — same-page anchor
    links.push({ embed: bang === '!', target: target.trim(), heading: heading?.slice(1), alias });
  }
  return links;
}

/**
 * Load the vault. Returns nodes (by slug), deduped edges, per-node links,
 * asset index, and problems found along the way (the validator reports them).
 */
export function loadVault(vaultDir = VAULT_DIR) {
  const files = walk(vaultDir);
  const nodes = new Map();
  const assets = new Map(); // basename (lowercase) -> vault-relative path
  const problems = [];
  const edited = gitDates(vaultDir);

  for (const rel of files) {
    if (rel.toLowerCase().endsWith('.md')) continue;
    assets.set(path.basename(rel).toLowerCase(), rel);
  }

  for (const rel of files.filter((f) => f.toLowerCase().endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(vaultDir, rel), 'utf8');
    const slug = toSlug(rel);
    const { yaml, body } = splitFrontmatter(raw);
    let data = {};
    if (yaml === null) {
      problems.push({ file: rel, kind: 'frontmatter', msg: 'no frontmatter block' });
    } else {
      try {
        data = parseYaml(yaml) ?? {};
      } catch (err) {
        problems.push({ file: rel, kind: 'frontmatter', msg: `YAML does not parse: ${err.message.split('\n')[0]}` });
      }
    }
    if (nodes.has(slug)) {
      problems.push({ file: rel, kind: 'duplicate', msg: `slug "${slug}" also used by ${nodes.get(slug).file}` });
      continue;
    }
    const links = [
      ...extractLinks(stripCode(body)),
      ...collectStrings(data).flatMap(extractLinks),
    ];
    nodes.set(slug, {
      slug,
      file: rel,
      title: (typeof data.title === 'string' && data.title.trim()) || slug,
      type: data.type ?? null,
      status: data.status ?? null,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      data,
      body,
      links,
      lastEdited: edited.get(rel) ?? fs.statSync(path.join(vaultDir, rel)).mtime.toISOString(),
    });
  }

  const edgeKeys = new Set();
  const edges = [];
  const broken = [];
  for (const node of nodes.values()) {
    for (const link of node.links) {
      if (link.embed && !link.target.toLowerCase().endsWith('.md') && /\.[a-z0-9]+$/i.test(link.target)) {
        if (!assets.has(path.basename(link.target).toLowerCase())) {
          broken.push({ file: node.file, target: link.target, embed: true });
        }
        continue;
      }
      const target = toSlug(link.target);
      if (!nodes.has(target)) {
        broken.push({ file: node.file, target: link.target, embed: false });
        continue;
      }
      if (target === node.slug) continue;
      const key = `${node.slug}\u0000${target}`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ source: node.slug, target });
    }
  }

  return { nodes, edges, assets, broken, problems };
}

// graph.json — the one shape the site's graph views and backlinks read.
export function toGraphJson({ nodes, edges }) {
  return {
    nodes: [...nodes.values()].map(({ slug, title, type, status, tags }) => ({ slug, title, type, status, tags })),
    edges,
  };
}

export function backlinksFor(graph, slug) {
  return graph.edges.filter((e) => e.target === slug).map((e) => e.source);
}

export function outlinksFor(graph, slug) {
  return graph.edges.filter((e) => e.source === slug).map((e) => e.target);
}

// Cached for a production build; re-read on every request in dev so vault edits show up.
let cache;
export function getVault() {
  if (!cache || process.env.NODE_ENV !== 'production') cache = loadVault();
  return cache;
}
