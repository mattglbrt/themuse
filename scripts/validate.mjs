// Vault validation. Runs before every build (npm run build) and on its own
// (npm run validate). Any error fails the build.
//
// Checks: required frontmatter (title, type, status), known type/status,
// lowercase-kebab filenames, reserved/duplicate slugs, broken wikilinks,
// broken or misplaced image embeds, orphan nodes.
import { loadVault, RESERVED_SLUGS } from '../src/lib/vault.mjs';
import { NODE_TYPES, STATUSES } from '../src/lib/types.mjs';

const vault = loadVault();
const errors = [...vault.problems.map((p) => `${p.file}: ${p.msg}`)];

for (const node of vault.nodes.values()) {
  const { file, slug, data } = node;
  if (!(typeof data.title === 'string' && data.title.trim())) errors.push(`${file}: missing title`);
  if (!data.type) errors.push(`${file}: missing type`);
  else if (!NODE_TYPES[data.type]) errors.push(`${file}: unknown type "${data.type}" (one of: ${Object.keys(NODE_TYPES).join(', ')})`);
  if (!data.status) errors.push(`${file}: missing status`);
  else if (!STATUSES.includes(data.status)) errors.push(`${file}: unknown status "${data.status}" (one of: ${STATUSES.join(', ')})`);
  if (data.reviewed != null && typeof data.reviewed !== 'boolean') errors.push(`${file}: reviewed must be true or false`);
  if (data.tags != null && !Array.isArray(data.tags)) errors.push(`${file}: tags must be a list`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(file.split('/').pop().replace(/\.md$/, ''))) {
    errors.push(`${file}: filename must be lowercase-kebab`);
  }
  if (RESERVED_SLUGS.has(slug)) errors.push(`${file}: slug "${slug}" is reserved by the site`);
}

for (const b of vault.broken) {
  errors.push(`${b.file}: ${b.embed ? 'embed' : 'wikilink'} [[${b.target}]] has no ${b.embed ? 'file in the vault' : 'node'}`);
}

for (const node of vault.nodes.values()) {
  for (const link of node.links.filter((l) => l.embed)) {
    const asset = vault.assets.get(link.target.split('/').pop().toLowerCase());
    if (asset && !asset.startsWith('assets/')) errors.push(`${node.file}: embed ${asset} must live in vault/assets/`);
  }
}

const degree = new Map([...vault.nodes.keys()].map((s) => [s, 0]));
for (const e of vault.edges) {
  degree.set(e.source, degree.get(e.source) + 1);
  degree.set(e.target, degree.get(e.target) + 1);
}
if (vault.nodes.size > 1) {
  for (const [slug, d] of degree) if (d === 0) errors.push(`${vault.nodes.get(slug).file}: orphan node (no links in or out)`);
}

const drafts = [...vault.nodes.values()].filter((n) => n.draft).length;
const summary = `${vault.nodes.size} nodes (${vault.nodes.size - drafts} published, ${drafts} drafts), ${vault.edges.length} edges, ${vault.assets.size} assets`;
if (errors.length) {
  console.error(`vault: ${errors.length} problem(s) — ${summary}`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`vault ok — ${summary}`);
