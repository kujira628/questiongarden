// Tiny IndexedDB wrapper. All data stays on this device.
const DB_NAME = 'question-garden';
const DB_VERSION = 2;
export const STORES = ['questions', 'versions', 'fragments', 'invitations', 'insights', 'library', 'meta'];

let dbPromise;
function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      for (const s of STORES) if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function run(store, mode, fn) {
  return open().then((d) => new Promise((resolve, reject) => {
    const tx = d.transaction(store, mode);
    const out = fn(tx.objectStore(store));
    tx.oncomplete = () => resolve(out instanceof IDBRequest ? out.result : out);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}

export const db = {
  all: (s) => run(s, 'readonly', (st) => st.getAll()),
  get: (s, id) => run(s, 'readonly', (st) => st.get(id)),
  put: (s, obj) => run(s, 'readwrite', (st) => { st.put(obj); return obj; }),
  del: (s, id) => run(s, 'readwrite', (st) => st.delete(id)),
  clear: (s) => run(s, 'readwrite', (st) => st.clear()),
};

export function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// ---- backup helpers -------------------------------------------------------
function blobToDataURL(blob) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
}
async function dataURLToBlob(url) { return (await fetch(url)).blob(); }

export async function exportAll() {
  const out = { app: 'question-garden', schema: 1, exportedAt: new Date().toISOString() };
  for (const s of STORES) {
    if (s === 'meta') continue;
    const rows = await db.all(s);
    if (s === 'fragments') {
      for (const r of rows) if (r.audio instanceof Blob) { r.audio = await blobToDataURL(r.audio); r.audioIsDataURL = true; }
    }
    out[s] = rows;
  }
  return out;
}

export async function importAll(data) {
  if (!data || data.app !== 'question-garden') throw new Error('Not a Question Garden backup');
  let q = 0, f = 0, l = 0;
  for (const s of STORES) {
    if (s === 'meta' || !Array.isArray(data[s])) continue;
    for (const r of data[s]) {
      if (s === 'fragments' && r.audioIsDataURL && typeof r.audio === 'string') { r.audio = await dataURLToBlob(r.audio); delete r.audioIsDataURL; }
      await db.put(s, r);
      if (s === 'questions') q++;
      if (s === 'library') l++;
      if (s === 'fragments') f++;
    }
  }
  return { q, f, l };
}
