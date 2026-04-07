const PAGE_COLORS: Record<string, string> = {
  home: '#dc2626',
  dex: '#dc2626',
  'habitat-dex': '#16a34a',
  requests: '#f59e0b',
  items: '#ea580c',
  'cloud-islands': '#0891b2',
  'dream-islands': '#7c3aed',
  map: '#2563eb',
  'mystery-gifts': '#ec4899',
  chat: '#7c3aed',
  account: '#6b7280',
  camera: '#1f2937',
  coins: '#eab308',
  notifications: '#6366f1',
  types: '#ef4444',
  moves: '#3b82f6',
  inventory: '#8b5cf6',
  relics: '#a855f7',
};

export function setPageBackground(pageId: string) {
  if (typeof document === 'undefined') return;
  // Only set CSS variable — no longer sets body/html background to avoid colored bar behind keyboard
  document.documentElement.style.setProperty('--page-bg', PAGE_COLORS[pageId] || '#dc2626');
}

export function getPageColor(pageId: string): string {
  return PAGE_COLORS[pageId] || '#dc2626';
}
