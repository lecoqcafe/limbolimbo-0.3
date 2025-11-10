import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  acceptTerms,
  fetchTermsVersion,
  TERMS_VERSION_FALLBACK,
} from "@/lib/terms";

/**
 * TermsModal — Modale bloquante d’acceptation des Conditions.
 * - Bloquante: pas d’ESC, pas de clic extérieur (block=true via DialogContent).
 * - Source unique d’acceptation: l’acceptation passe uniquement par ce composant.
 * - La page /conditions est de lecture seule; ce composant fournit l’action “J’accepte”.
 * - Hors‑ligne: si le Markdown réseau est indisponible, afficher un texte minimal embarqué.
 */

type TermsModalProps = {
  open: boolean;
  version?: string;
  onAccepted?: (version: string) => void;
};

export default function TermsModal({ open, version, onAccepted }: TermsModalProps) {
  const [termsVersion, setTermsVersion] = React.useState<string | null>(version ?? null);
  const [offlineFallback, setOfflineFallback] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    // Si la version est fournie par la garde, l’utiliser directement
    if (version) {
      setTermsVersion(version);
      return;
    }

    // Sinon, tenter de la charger (avec anti‑cache)
    (async () => {
      try {
        const v = await fetchTermsVersion();
        if (!cancelled) setTermsVersion(v);
      } catch {
        if (!cancelled) setTermsVersion(TERMS_VERSION_FALLBACK);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [version]);

  const v = termsVersion ?? TERMS_VERSION_FALLBACK;

  // Texte minimal embarqué (utilisé si le Markdown est indisponible côté page /conditions)
  React.useEffect(() => {
    // Message très bref, informatif et hors‑ligne
    setOfflineFallback(
      "Résumé minimal: vous devez accepter les Conditions d’utilisation version " +
        v +
        " pour utiliser l’application. Le texte complet sera disponible dès que le réseau sera rétabli."
    );
  }, [v]);

  const handleAccept = () => {
    acceptTerms(v);
    onAccepted?.(v);
  };

  return (
    <Dialog open={open}>
      {/* block=true empêche ESC et clic extérieur; closable=false masque la croix */}
      <DialogContent block closable={false} aria-describedby="terms-desc">
        <DialogHeader>
          <DialogTitle>Conditions d’utilisation</DialogTitle>
        </DialogHeader>

        <DialogDescription id="terms-desc" className="space-y-2">
          <p>
            Pour utiliser LimboLimbo, vous devez accepter les Conditions d’utilisation
            version <strong>{v}</strong>.
          </p>
          <p>
            Cette acceptation est requise une fois par appareil et par version des Conditions.
          </p>
          <p>
            En appuyant sur « J’accepte », vous confirmez avoir pris connaissance des Conditions
            de la version courante.
          </p>

          <p className="mt-2">
            <Link
              to={`/conditions?version=${encodeURIComponent(v)}`}
              className="underline text-primary"
            >
              Lire les Conditions
            </Link>
          </p>

          {/* Texte minimal embarqué visible si la page détaillée n’est pas accessible (hors‑ligne) */}
          {offlineFallback && (
            <p className="text-sm text-muted-foreground">{offlineFallback}</p>
          )}
        </DialogDescription>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button onClick={handleAccept}>J’accepte {v}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
