import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TermsModal from "@/components/TermsModal";
import { fetchTermsVersion, isTermsAccepted } from "@/lib/terms";

/**
 * TermsGuard — Garde globale des Conditions.
 * Règles:
 * - Avant acceptation: l’application est bloquée; seule la lecture de /conditions est autorisée.
 * - La modale bloquante s’affiche sur toutes les routes sauf /conditions.
 * - Couvre liens profonds et navigation retour (état réévalué à chaque navigation).
 * - Après acceptation: fermeture de la modale et retour à la route initiale (ou "/") avec replace:true.
 */

const PUBLIC_ROUTE = "/conditions";

type Props = { children: React.ReactNode };

export default function TermsGuard({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const [termsVersion, setTermsVersion] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Mémorise la première route demandée pour la redirection finale.
  const initialPathRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const v = await fetchTermsVersion();
      if (cancelled) return;

      setTermsVersion(v);

      const accepted = isTermsAccepted(v);
      const isOnPublic = location.pathname === PUBLIC_ROUTE;

      if (accepted) {
        // Déjà accepté: aucun blocage.
        setModalOpen(false);
        initialPathRef.current = null;
        return;
      }

      // Non accepté: blocage global. La page /conditions reste lisible.
      if (!isOnPublic) {
        // Mémorise la route initiale une seule fois.
        if (!initialPathRef.current) {
          const fullPath = `${location.pathname}${location.search}${location.hash}`;
          initialPathRef.current = fullPath;
        }
        setModalOpen(true);
        // Option: pas de redirection stricte pour permettre d’afficher la modale sur la route courante.
        // Si vous préférez forcer l’URL /conditions, décommentez la ligne suivante:
        // navigate(PUBLIC_ROUTE, { replace: true });
      } else {
        // Sur /conditions: pas de modale, lecture possible et bouton “J’accepte” sur la page.
        setModalOpen(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Réévalue à chaque navigation.
  }, [location.key, location.pathname, location.search, location.hash, navigate]);

  // Acceptation via la modale (hors /conditions).
  const handleAccepted = (_version: string) => {
    setModalOpen(false);

    const target =
      initialPathRef.current && initialPathRef.current !== PUBLIC_ROUTE
        ? initialPathRef.current
        : "/";

    initialPathRef.current = null;
    navigate(target, { replace: true });
  };

  return (
    <>
      {children}
      {location.pathname !== PUBLIC_ROUTE && (
        <TermsModal
          open={modalOpen}
          version={termsVersion ?? undefined}
          onAccepted={handleAccepted}
        />
      )}
    </>
  );
}
