// Node 25+ ships an experimental global `localStorage` that is undefined unless
// --localstorage-file is passed, and it shadows jsdom's. Install an in-memory
// Storage in that case so tests behave the same on every Node version.
class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length() { return this.map.size; }
  clear() { this.map.clear(); }
  getItem(key: string) { return this.map.get(key) ?? null; }
  key(index: number) { return [...this.map.keys()][index] ?? null; }
  removeItem(key: string) { this.map.delete(key); }
  setItem(key: string, value: string) { this.map.set(key, String(value)); }
}

if (typeof window !== 'undefined') {
  for (const name of ['localStorage', 'sessionStorage'] as const) {
    let ok = false;
    try { ok = typeof globalThis[name]?.getItem === 'function'; } catch { ok = false; }
    if (!ok) {
      Object.defineProperty(globalThis, name, { value: new MemoryStorage(), configurable: true, writable: true });
    }
  }
}
