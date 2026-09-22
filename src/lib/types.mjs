// Shared by the build, the validator, and the client graph.
// Colors are first-pass; the brand pass (Phase 2) replaces them.
export const NODE_TYPES = {
  book: { label: 'Book', color: '#d9a441' },
  person: { label: 'Person', color: '#6fa8dc' },
  artifact: { label: 'Artifact', color: '#c27ba0' },
  topic: { label: 'Topic', color: '#8fbf6a' },
  'show-notes': { label: 'Show notes', color: '#e06a5a' },
  lecture: { label: 'Lecture', color: '#a4a0d0' },
};

export const STATUSES = ['seed', 'researched', 'scripted', 'published'];

export const typeColor = (type) => NODE_TYPES[type]?.color ?? '#888888';
