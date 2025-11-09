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
 * - Source unique d’acceptation (Q3.10): l’acceptation passe uniquement par ce composant.
 * - La page /conditions est de lecture seule; ce composant fournit l’action “J’accepte”.
 */
type TermsModalProps = {
  open: boolean;
  version?: string;
  onAccepted?: (version: string) => void;
};

export default function TermsModal({ open, version, onAccepted }: TermsModalProps) {
  const [termsVersion, setTermsVersion] = React.useState<string | null>(version ?? null);

  React.useEffect(() => {
    let cancelled = false;

    if (version) {
      setTermsVersion(version);
      return;
    }

    (async () => {
      const v = await fetchTermsVersion();
      if (!cancelled) setTermsVersion(v);
    })();

    return () => {
      cancelled = true;
    };
  }, [version]);

  const v = termsVersion ?? TERMS_VERSION_FALLBACK;

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
            En appuyant sur « J’accepte », vous confirmez avoir lu et compris ces Conditions.
          </p>
          <p className="mt-2">
            <Link
              to={`/conditions?version=${encodeURIComponent(v)}`}
              className="underline text-primary"
            >
              Lire les Conditions
            </Link>
          </p>
        </DialogDescription>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button onClick={handleAccept}>
            J’accepte {v}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
