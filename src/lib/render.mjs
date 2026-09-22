// Markdown -> HTML for node pages. Obsidian syntax the build doesn't handle
// yet falls through as plain text: degrade, never break.
import path from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { WIKILINK_RE, IMAGE_EXT, toSlug } from './vault.mjs';

export const headingId = (text) =>
  text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');

export const nodeUrl = (slug, heading) => `/${slug}/${heading ? `#${headingId(heading)}` : ''}`;
export const assetUrl = (vaultPath) => `/${vaultPath.split('/').map(encodeURIComponent).join('/')}`;

const textOf = (node) =>
  node.value ?? (node.children ?? []).map(textOf).join('');

// Resolve one [[...]] match into an mdast node.
function wikilinkNode(match, vault) {
  const [raw, bang, target, heading, , alias] = match;
  if (!target.trim()) return { type: 'text', value: alias ?? raw };

  if (bang && IMAGE_EXT.test(target)) {
    const asset = vault.assets.get(path.basename(target.trim()).toLowerCase());
    if (!asset) return { type: 'text', value: raw, data: { hName: 'span', hProperties: { className: ['wikilink', 'broken'] } } };
    // Obsidian: ![[img.png|300]] sets width; any other alias is alt text.
    const width = alias && /^\d+(x\d+)?$/.test(alias) ? alias.split('x')[0] : undefined;
    return {
      type: 'image',
      url: assetUrl(asset),
      alt: width ? '' : alias ?? '',
      data: width ? { hProperties: { width } } : undefined,
    };
  }

  const slug = toSlug(target);
  const node = vault.nodes.get(slug);
  const label = alias?.trim() || (node && !heading ? node.title : `${target.trim()}${heading ?? ''}`);
  if (!node) {
    return { type: 'text', value: label, data: { hName: 'span', hProperties: { className: ['wikilink', 'broken'], title: `No node yet: ${target}` } } };
  }
  return {
    type: 'link',
    url: nodeUrl(slug, heading?.slice(1)),
    children: [{ type: 'text', value: label }],
    data: { hProperties: { className: ['wikilink', `type-${node.type}`] } },
  };
}

// remark plugin: [[wikilinks]] and ![[embeds]] in text nodes; ids on headings.
export function remarkWikilinks({ vault }) {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'heading') {
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: headingId(textOf(node)) } };
      }
      if (!node.children || node.type === 'link' || node.type === 'linkReference') return;
      const next = [];
      for (const child of node.children) {
        if (child.type !== 'text' || !child.value.includes('[[')) {
          visit(child);
          next.push(child);
          continue;
        }
        let last = 0;
        for (const m of child.value.matchAll(WIKILINK_RE)) {
          if (m.index > last) next.push({ type: 'text', value: child.value.slice(last, m.index) });
          next.push(wikilinkNode(m, vault));
          last = m.index + m[0].length;
        }
        if (last < child.value.length) next.push({ type: 'text', value: child.value.slice(last) });
      }
      node.children = next;
    };
    visit(tree);
  };
}

export async function renderMarkdown(body, vault) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilinks, { vault })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(body);
  return String(file);
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Frontmatter values (author: "[[james-i]]") -> escaped HTML with links.
export function renderInline(value, vault) {
  const str = String(value);
  let out = '';
  let last = 0;
  for (const m of str.matchAll(WIKILINK_RE)) {
    out += escapeHtml(str.slice(last, m.index));
    const n = wikilinkNode(m, vault);
    if (n.type === 'link') out += `<a class="wikilink" href="${n.url}">${escapeHtml(n.children[0].value)}</a>`;
    else out += `<span class="wikilink broken">${escapeHtml(n.value ?? m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(str.slice(last));
}
