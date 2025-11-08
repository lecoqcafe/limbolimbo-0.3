/**
 * Service de stockage namespacé par userId.
 * Préfixe utilisateur: "limbo:{userId}:" (ex.: limbo:anon:settings:theme).
 * Clés d’appareil (non namespacées) réservées: consentement et session.
 */

type Json = unknown;

const TERMS_KEY = "limbo:terms:app";     // { version: "T1.0", acceptedAt: "ISO-UTC" }
const SESSION_KEY = "limbo:session:app"; // { userId: "anon", createdAt: "ISO-UTC" }

/** Détecte la disponibilité de localStorage (navigateur). */
const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

/** Stockage mémoire de secours (SSR / environnements sans localStorage). */
class MemoryStore {
  private map = new Map<string, string>();
  getItem(key: string) {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
}

const memory = new MemoryStore();

const adapter = {
  getItem: (k: string) => (isBrowser ? window.localStorage.getItem(k) : memory.getItem(k)),
  setItem: (k: string, v: string) => (isBrowser ? window.localStorage.setItem(k, v) : memory.setItem(k, v)),
  removeItem: (k: string) => (isBrowser ? window.localStorage.removeItem(k) : memory.removeItem(k)),
};

/** Construit le préfixe namespacé. */
export const nsPrefix = (userId: string) => `limbo:${userId}:`;

/** Construit une clé namespacée. */
export const nsKey = (userId: string, key: string) => `${nsPrefix(userId)}${key}`;

/** Sérialisation JSON. */
const stringify = (value: Json) => JSON.stringify(value);

/** Désérialisation JSON sûre. */
const parse = <T = Json>(raw: string | null, fallback: T | null = null): T | null => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

/* =========================
   Portée appareil (non namespacée)
   ========================= */

export const getDevice = <T = Json>(key: string, fallback: T | null = null): T | null =>
  parse<T>(adapter.getItem(key), fallback);

export const setDevice = (key: string, value: Json): void => {
  adapter.setItem(key, stringify(value));
};

export const removeDevice = (key: string): void => {
  adapter.removeItem(key);
};

/* =========================
   Portée utilisateur (namespacée)
   ========================= */

export const getNS = <T = Json>(userId: string, key: string, fallback: T | null = null): T | null =>
  parse<T>(adapter.getItem(nsKey(userId, key)), fallback);

export const setNS = (userId: string, key: string, value: Json): void => {
  adapter.setItem(nsKey(userId, key), stringify(value));
};

export const removeNS = (userId: string, key: string): void => {
  adapter.removeItem(nsKey(userId, key));
};

/* =========================
   Constantes officielles
   ========================= */

export const StorageKeys = {
  TERMS_KEY,
  SESSION_KEY,
} as const;

/* =========================
   Façade pratique
   ========================= */

export const StorageService = {
  // Appareil (consentement / session)
  getDevice,
  setDevice,
  removeDevice,

  // Namespacé (réglages par utilisateur, historique connecté, etc.)
  getNS,
  setNS,
  removeNS,

  // Utilitaires
  nsPrefix,
  nsKey,
  keys: StorageKeys,
};
