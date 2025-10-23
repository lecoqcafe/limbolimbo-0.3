import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne proprement des classes Tailwind (utilisé par shadcn/ui).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ouvre un lien externe de façon robuste.
 * - Tente un nouvel onglet (_blank + noopener/noreferrer).
 * - Si bloqué (PWA installée, bloqueur), bascule en même onglet.
 */
export function openExternal(url?: string): void {
  const u = (url || "").trim();
  if (!u) return;
  try {
    const win = window.open(u, "_blank", "noopener,noreferrer");
    if (!win) {
      // Fallback (PWA / bloqueur)
      window.location.assign(u);
    }
  } catch {
    window.location.assign(u);
  }
}
