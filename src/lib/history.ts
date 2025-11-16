/**
 * Service d'historique local LimboLimbo.
 * Stockage: localStorage (stockage local persistant du navigateur) par utilisateur.
 * Clé: ll_history_v2::<user.id>
 * Règles: statut monotone (0<1<2), bump à chaque activité, tri par lastActivityTs décroissant, plafond 200.
 * Encodage: UTF-8.
 */

export const STORAGE_PREFIX = "ll_history_v2";

/** Statut: 1 = Vu, 2 = Cliqué (monotone). */
export type HistoryStatus = 1 | 2;

/** Enregistrement d'historique par opportunité. */
export interface HistoryItem {
  id: number;
  title: string;
  route: string;
  status: HistoryStatus;
  lastActivityTs: number;
  lastViewTs?: number;
  lastClickTs?: number;
}

/** Données minimales nécessaires à un upsert. */
export interface UpsertRecord {
  id: number;
  route: string;
  title?: string;
}

/** Capacité maximale de conservation (sécurité). */
const CAP_DEFAULT = 200;

/** Construit la clé de stockage pour un utilisateur. */
export function getKey(userId: string): string {
  return `${STORAGE_PREFIX}::${userId}`;
}

/** Vérifie l’accès au localStorage sans lever d’erreur. */
function storageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !("localStorage" in window)) return false;
    const k = "__ll_probe__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

/** Valide un identifiant numérique non négatif. */
function isValidId(id: number): boolean {
  return Number.isFinite(id) && id >= 0;
}

/** Valide une entrée brute potentielle d'historique. */
function validateItem(x: any): x is HistoryItem {
  if (!x) return false;
  const id = Number(x.id);
  const s = Number(x.status);
  const routeOk = typeof x.route === "string" && x.route.trim().length > 0;
  const titleOk = typeof x.title === "string";
  const tsOk = Number.isFinite(Number(x.lastActivityTs));
  return isValidId(id) && (s === 1 || s === 2) && routeOk && titleOk && tsOk;
}

/** Normalise une entrée d'historique. */
function normalizeItem(x: any): HistoryItem {
  return {
    id: Number(x.id),
    title: String(x.title ?? ""),
    route: String(x.route ?? ""),
    status: Number(x.status) === 2 ? 2 : 1,
    lastActivityTs: Number(x.lastActivityTs),
    lastViewTs: typeof x.lastViewTs === "number" ? x.lastViewTs : undefined,
    lastClickTs: typeof x.lastClickTs === "number" ? x.lastClickTs : undefined,
  };
}

/** Parse JSON en sécurité (retourne [] en cas d’erreur). */
function safeParse(text: string): HistoryItem[] {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) return [];
    return data.filter(validateItem).map(normalizeItem);
  } catch {
    return [];
  }
}

/** Tri par activité décroissante. */
export function sortByActivity(items: HistoryItem[]): HistoryItem[] {
  return [...items].sort((a, b) => b.lastActivityTs - a.lastActivityTs);
}

/** Déduplique par id en conservant l’élément le plus récent. */
function uniqueById(items: HistoryItem[]): HistoryItem[] {
  const map = new Map<number, HistoryItem>();
  for (const it of items) {
    const prev = map.get(it.id);
    if (!prev) {
      map.set(it.id, it);
    } else {
      map.set(it.id, prev.lastActivityTs >= it.lastActivityTs ? prev : it);
    }
  }
  return Array.from(map.values());
}

/** Coupe la liste au plafond cap (par défaut 200). */
export function prune(items: HistoryItem[], cap = CAP_DEFAULT): HistoryItem[] {
  if (items.length <= cap) return items;
  return sortByActivity(items).slice(0, cap);
}

/** Mémoire de secours si localStorage indisponible (PWA/private mode). */
const memStore = new Map<string, HistoryItem[]>();

/** Charge l’historique de l’utilisateur (trié, dédupliqué). */
export function load(userId: string): HistoryItem[] {
  if (!userId) return [];
  const key = getKey(userId);
  if (storageAvailable()) {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? safeParse(raw) : [];
    return sortByActivity(uniqueById(parsed));
  }
  return sortByActivity(uniqueById(memStore.get(key) ?? []));
}

/** Sauvegarde l’historique (tri, prune puis persiste). */
export function save(userId: string, items: HistoryItem[]): void {
  if (!userId) return;
  const key = getKey(userId);
  const final = sortByActivity(prune(uniqueById(items)));
  const json = JSON.stringify(final);
  if (storageAvailable()) {
    try {
      window.localStorage.setItem(key, json);
    } catch {
      // Silencieux: on évite de casser l’UX si le quota est plein ou bloqué.
    }
  } else {
    memStore.set(key, final);
  }
}

/** Renvoie la liste à afficher (25 max, triée). */
export function getForDisplay(userId: string, limit = 25): HistoryItem[] {
  return sortByActivity(load(userId)).slice(0, Math.max(0, limit));
}

/** Choisit un titre non vide, sinon conserve l’existant. */
function coalesceTitle(newTitle?: string, oldTitle?: string): string {
  const t = (newTitle ?? "").trim();
  return t || (oldTitle ?? "").trim();
}

/** Normalise la route (repli = /opportunite?id=<id>). */
function ensureRoute(route: string, fallback: string): string {
  const r = (route ?? "").trim();
  return r || fallback;
}

/**
 * Upsert "Vu" (status >= 1), met à jour lastViewTs et lastActivityTs.
 * Statut monotone: ne redescend jamais de 2 à 1.
 */
export function upsertView(userId: string, record: UpsertRecord): HistoryItem[] {
  const id = Number(record.id);
  if (!isValidId(id)) return load(userId);

  const items = load(userId);
  const now = Date.now();
  const idx = items.findIndex((i) => i.id === id);

  if (idx >= 0) {
    const cur = items[idx];
    const next: HistoryItem = {
      ...cur,
      title: coalesceTitle(record.title, cur.title),
      route: ensureRoute(record.route, cur.route),
      status: cur.status === 2 ? 2 : 1,
      lastViewTs: now,
      lastActivityTs: now,
    };
    items[idx] = next;
  } else {
    const next: HistoryItem = {
      id,
      title: coalesceTitle(record.title, ""),
      route: ensureRoute(record.route, `/opportunite?id=${id}`),
      status: 1,
      lastViewTs: now,
      lastActivityTs: now,
    };
    items.unshift(next);
  }

  const final = sortByActivity(prune(uniqueById(items)));
  save(userId, final);
  return final;
}

/**
 * Upsert "Cliqué" (status = 2), met à jour lastClickTs et lastActivityTs.
 */
export function upsertClick(userId: string, record: UpsertRecord): HistoryItem[] {
  const id = Number(record.id);
  if (!isValidId(id)) return load(userId);

  const items = load(userId);
  const now = Date.now();
  const idx = items.findIndex((i) => i.id === id);

  if (idx >= 0) {
    const cur = items[idx];
    const next: HistoryItem = {
      ...cur,
      title: coalesceTitle(record.title, cur.title),
      route: ensureRoute(record.route, cur.route),
      status: 2,
      lastClickTs: now,
      lastActivityTs: now,
    };
    items[idx] = next;
  } else {
    const next: HistoryItem = {
      id,
      title: coalesceTitle(record.title, ""),
      route: ensureRoute(record.route, `/opportunite?id=${id}`),
      status: 2,
      lastClickTs: now,
      lastActivityTs: now,
    };
    items.unshift(next);
  }

  const final = sortByActivity(prune(uniqueById(items)));
  save(userId, final);
  return final;
}

