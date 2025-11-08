/**
 * Gestion de la version des Conditions d’utilisation (termsVersion) et de l’acceptation locale.
 * - Source réseau: /public/terms.version.json (réseau d’abord avec anti‑cache)
 * - Fallback embarqué: TERMS_VERSION_FALLBACK
 * - Persistance par appareil: StorageService.keys.TERMS_KEY = "limbo:terms:app"
 */

import { StorageService } from "@/lib/storage";

export const TERMS_VERSION_FALLBACK = "T1.0";

export type TermsAcceptance = {
  version: string;      // ex.: "T1.0"
  acceptedAt: string;   // ISO‑UTC
};

/** Tente de lire la version des Conditions depuis le réseau, sinon renvoie le fallback. */
export async function fetchTermsVersion(): Promise<string> {
  const url = `/terms.version.json?t=${Date.now()}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "pragma": "no-cache",
        "cache-control": "no-cache",
      },
    });
    if (!res.ok) return TERMS_VERSION_FALLBACK;

    const data = await res.json().catch(() => null) as { termsVersion?: unknown } | null;
    const v = typeof data?.termsVersion === "string" ? data.termsVersion : null;
    return v ?? TERMS_VERSION_FALLBACK;
  } catch {
    return TERMS_VERSION_FALLBACK;
  }
}

/** Lit l’acceptation locale (par appareil). */
export function getAcceptedTerms(): TermsAcceptance | null {
  return StorageService.getDevice<TermsAcceptance>(StorageService.keys.TERMS_KEY, null);
}

/** Indique si la version cible est déjà acceptée localement. */
export function isTermsAccepted(targetVersion: string): boolean {
  const rec = getAcceptedTerms();
  return !!(rec && rec.version === targetVersion);
}

/** Enregistre l’acceptation locale (par appareil). */
export function acceptTerms(version: string, nowISO?: string): void {
  const acceptedAt = nowISO ?? new Date().toISOString();
  const payload: TermsAcceptance = { version, acceptedAt };
  StorageService.setDevice(StorageService.keys.TERMS_KEY, payload);
}

/** Supprime l’acceptation locale (outil de test). */
export function clearAcceptedTerms(): void {
  StorageService.removeDevice(StorageService.keys.TERMS_KEY);
}
