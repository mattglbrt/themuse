// Force-directed graph on canvas. Reads /graph.json (the build's output) and
// mounts every [data-graph] element: global when no data-focus, one-hop local
// graph around data-focus otherwise. d3-force does the physics; the rest
// (drawing, pan/zoom, hit-testing) is ours and deliberately small.
import { forceSimulation, forceLink, forceManyBody, forceX, forceY, forceCollide } from 'd3-force';
import { typeColor } from '../lib/types.mjs';

let graphData;
const loadGraph = () => (graphData ??= fetch('/graph.json').then((r) => r.json()));

export function mountGraphs() {
  for (const el of document.querySelectorAll('[data-graph]')) {
    if (el.dataset.mounted) continue;
    el.dataset.mounted = '1';
    mount(el);
  }
}

async function mount(el) {
  const data = await loadGraph();
  const focus = el.dataset.focus || null;

  const degree = new Map(data.nodes.map((n) => [n.slug, 0]));
  for (const e of data.edges) {
    degree.set(e.source, degree.get(e.source) + 1);
    degree.set(e.target, degree.get(e.target) + 1);
  }

  let keep = null;
  if (focus) {
    keep = new Set([focus]);
    for (const e of data.edges) {
      if (e.source === focus) keep.add(e.target);
      if (e.target === focus) keep.add(e.source);
    }
  }
  const nodes = data.nodes
    .filter((n) => !keep || keep.has(n.slug))
    .map((n) => ({ ...n, r: 4 + 2.4 * Math.sqrt(degree.get(n.slug)) }));
  const links = data.edges
    .filter((e) => !keep || (keep.has(e.source) && keep.has(e.target)))
    .map((e) => ({ ...e }));

  const neighbors = new Map(nodes.map((n) => [n.slug, new Set()]));
  for (const l of links) {
    neighbors.get(l.source).add(l.target);
    neighbors.get(l.target).add(l.source);
  }

  const style = getComputedStyle(el);
  const color = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
  const C = {
    edge: color('--graph-edge', '#3a3530'),
    edgeHi: color('--graph-edge-hi', '#b8a98a'),
    label: color('--graph-label', '#d8d0c0'),
    ring: color('--graph-ring', '#f3ead7'),
    halo: color('--graph-halo', '#141311'),
    font: color('--font-ui', 'system-ui, sans-serif'),
  };

  const canvas = el.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  const view = { x: 0, y: 0, k: 1 }; // screen = world * k + center + (x, y)
  let hover = null;
  let drag = null;
  let userMoved = false;

  const toWorld = (sx, sy) => [(sx - width / 2 - view.x) / view.k, (sy - height / 2 - view.y) / view.k];
  const nodeAt = (sx, sy) => {
    const [wx, wy] = toWorld(sx, sy);
    let best = null;
    let bestD = Infinity;
    for (const n of nodes) {
      const d = Math.hypot(n.x - wx, n.y - wy);
      if (d < n.r + 6 / view.k && d < bestD) [best, bestD] = [n, d];
    }
    return best;
  };

  function fit() {
    if (!nodes.length || !width) return;
    let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const n of nodes) {
      x0 = Math.min(x0, n.x - n.r);
      y0 = Math.min(y0, n.y - n.r);
      x1 = Math.max(x1, n.x + n.r);
      y1 = Math.max(y1, n.y + n.r + 16);
    }
    const pad = 48;
    view.k = Math.max(0.2, Math.min(2, (width - pad * 2) / (x1 - x0 || 1), (height - pad * 2) / (y1 - y0 || 1)));
    view.x = -((x0 + x1) / 2) * view.k;
    view.y = -((y0 + y1) / 2) * view.k;
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2 + view.x, height / 2 + view.y);
    ctx.scale(view.k, view.k);
    const lit = hover ? neighbors.get(hover.slug) : null;

    ctx.lineWidth = 1 / view.k;
    for (const l of links) {
      const on = hover && (l.source === hover || l.target === hover);
      ctx.globalAlpha = hover && !on ? 0.2 : 1;
      ctx.strokeStyle = on ? C.edgeHi : C.edge;
      ctx.beginPath();
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
      ctx.stroke();
    }

    for (const n of nodes) {
      ctx.globalAlpha = hover && n !== hover && !lit.has(n.slug) ? 0.25 : 1;
      ctx.fillStyle = typeColor(n.type);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      if (n.slug === focus) {
        ctx.strokeStyle = C.ring;
        ctx.lineWidth = 2 / view.k;
        ctx.stroke();
      }
    }

    const showAll = focus || nodes.length < 60 || view.k > 1.2;
    ctx.font = `500 ${12.5 / view.k}px ${C.font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C.label;
    // A background-colored outline keeps labels legible where they cross edges or nodes.
    ctx.strokeStyle = C.halo;
    ctx.lineWidth = 3.5 / view.k;
    ctx.lineJoin = 'round';
    for (const n of nodes) {
      const near = n === hover || lit?.has(n.slug);
      if (!showAll && !near) continue;
      ctx.globalAlpha = hover && !near ? 0.25 : 1;
      ctx.strokeText(n.title, n.x, n.y + n.r + 4 / view.k);
      ctx.fillText(n.title, n.x, n.y + n.r + 4 / view.k);
    }
    ctx.globalAlpha = 1;
  }

  const sim = forceSimulation(nodes)
    .force('link', forceLink(links).id((d) => d.slug).distance(focus ? 90 : 70))
    .force('charge', forceManyBody().strength(focus ? -320 : -240))
    .force('x', forceX(0).strength(0.06))
    .force('y', forceY(0).strength(0.06))
    .force('collide', forceCollide((d) => d.r + 6))
    .on('tick', () => {
      if (!userMoved) fit();
      draw();
    });

  const focusNode = nodes.find((n) => n.slug === focus);
  if (focusNode) [focusNode.fx, focusNode.fy] = [0, 0];

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sim.stop();
    sim.tick(300);
  }

  function resize() {
    const rect = el.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (!userMoved) fit();
    draw();
  }
  new ResizeObserver(resize).observe(el);
  // Canvas text won't swap fonts on its own; redraw once the web fonts land.
  document.fonts?.ready.then(draw);

  const local = (e) => {
    const rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  };

  canvas.addEventListener('pointerdown', (e) => {
    const [sx, sy] = local(e);
    const node = nodeAt(sx, sy);
    drag = { node, sx, sy, vx: view.x, vy: view.y, moved: false };
    canvas.setPointerCapture(e.pointerId);
    if (node) {
      [node.fx, node.fy] = [node.x, node.y];
      sim.alphaTarget(0.3).restart();
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    const [sx, sy] = local(e);
    if (drag) {
      if (Math.hypot(sx - drag.sx, sy - drag.sy) > 4) drag.moved = true;
      if (!drag.moved) return;
      userMoved = true;
      if (drag.node) {
        [drag.node.fx, drag.node.fy] = toWorld(sx, sy);
      } else {
        view.x = drag.vx + (sx - drag.sx);
        view.y = drag.vy + (sy - drag.sy);
        draw();
      }
      return;
    }
    const next = nodeAt(sx, sy);
    if (next !== hover) {
      hover = next;
      canvas.style.cursor = hover ? 'pointer' : 'grab';
      canvas.title = hover ? hover.title : '';
      draw();
    }
  });

  canvas.addEventListener('pointerup', () => {
    if (!drag) return;
    const { node, moved } = drag;
    drag = null;
    if (!node) return;
    sim.alphaTarget(0);
    if (node.slug !== focus) [node.fx, node.fy] = [null, null];
    if (!moved && node.slug !== focus) window.location.href = `/${node.slug}/`;
  });

  canvas.addEventListener('pointerleave', () => {
    if (drag || !hover) return;
    hover = null;
    draw();
  });

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      userMoved = true;
      const [sx, sy] = local(e);
      const [wx, wy] = toWorld(sx, sy);
      view.k = Math.max(0.2, Math.min(4, view.k * Math.exp(-e.deltaY * 0.0015)));
      view.x = sx - width / 2 - wx * view.k;
      view.y = sy - height / 2 - wy * view.k;
      draw();
    },
    { passive: false },
  );
}
