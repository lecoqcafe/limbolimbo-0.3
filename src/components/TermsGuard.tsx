import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TermsModal from "@/components/TermsModal";
import { fetchTermsVersion, isTermsAccepted } from "@/lib/terms";

/**
 * TermsGuard — Garde globale unifiée des Conditions d’utilisation.
 *
 * Comportements:
 * - Tant que la version active n’est pas acceptée, redirection stricte vers /conditions
 *   avec paramètre ?redirect=<route demandée> (chemin absolu), puis retour via replace:true après acceptation.
 * - Anti‑FOUC: aucun rendu cliquable enfant tant que l’état n’est pas évalué.
 * - Multi‑onglets: synchronisation via événement 'storage' (clé limbo:terms:app).
 * - La page /conditions reste lisible; l’acceptation est exclusivement gérée par TermsModal (Q3.10).
 */

const PUBLIC_ROUTE = "/conditions";

type Props = { children: React.ReactNode };

export default function TermsGuard({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  // Etat interne
  const [checking, setChecking] = React.useState(true);
  const [termsVersion, setTermsVersion] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Mémorise la première route d’origine pour le retour.
  const initialPathRef = React.useRef<string | null>(null);

  // Calcule l’URL courante (chemin + query + hash).
  const currentFullPath = React.useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.pathname, location.search, location.hash]
  );

  // Détermine si on est sur la route publique.
  const isOnPublic = location.pathname === PUBLIC_ROUTE;

  // Évalue l’état d’acceptation et applique la politique de redirection stricte.
  const evaluate = React.useCallback(
    async (trigger: "mount" | "nav" | "storage") => {
      try {
        // Lecture de la version réseau (avec anti‑cache côté utilitaire).
        const v = await fetchTermsVersion();
        setTermsVersion(v);

        const accepted = isTermsAccepted(v);

        if (accepted) {
          // Déjà accepté: pas de blocage ni modal.
          setModalOpen(false);
          setChecking(false);
          initialPathRef.current = null;
          return;
        }

        // Non accepté: blocage global.
        setModalOpen(true);

        // Mémorise la première route demandée si pertinente.
        if (!initialPathRef.current && currentFullPath !== PUBLIC_ROUTE) {
          initialPathRef.current = currentFullPath;
        }

        // Redirection stricte vers /conditions si l’URL n’y est pas déjà.
        if (!isOnPublic) {
          const redirect = encodeURIComponent(
            initialPathRef.current ?? currentFullPath ?? "/"
          );
          // replace:true pour éviter la pollution de l’historique.
          navigate(`${PUBLIC_ROUTE}?redirect=${redirect}`, { replace: true });
        }

        setChecking(false);
      } catch {
        // En cas d’erreur de lecture, on reste conservateur: on redirige vers /conditions
        // avec un redirect calculé, ce qui évite les boucles tant que PUBLIC_ROUTE reste lisible.
        setModalOpen(true);
        if (!isOnPublic) {
          const redirect = encodeURIComponent(
            initialPathRef.current ?? currentFullPath ?? "/"
          );
          navigate(`${PUBLIC_ROUTE}?redirect=${redirect}`, { replace: true });
        }
        setChecking(false);
      }
    },
    [currentFullPath, isOnPublic, navigate]
  );

  // Évaluation initiale et à chaque navigation.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      setChecking(true);
      await evaluate("mount");
    })();
    return () => {
      cancelled = true;
    };
    // On relance l’évaluation à chaque navigation (location.key varie).
  }, [location.key, evaluate]);

  // Synchronisation multi‑onglets: écoute des changements sur localStorage.
  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      // On écoute la clé globale de consentement; sur changement, on réévalue.
      if (e.key === "limbo:terms:app") {
        // Réévalue rapidement l’état; évite clignotement en gardant checking bref.
        evaluate("storage");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [evaluate]);

  // Callback après acceptation via la modale (hors page publique).
  const handleAccepted = (_version: string) => {
    setModalOpen(false);
    // Calcule la cible de retour: ?redirect en priorité, sinon route mémorisée, sinon "/".
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get("redirect");
    const decoded = redirectParam ? decodeURIComponent(redirectParam) : null;

    const target =
      (decoded && decoded.startsWith("/")) ||
      (decoded && decoded.startsWith("#")) ? decoded
      : initialPathRef.current && initialPathRef.current !== PUBLIC_ROUTE
      ? initialPathRef.current
      : "/";

    initialPathRef.current = null;

    // replace:true pour éviter d’empiler /conditions dans l’historique.
    navigate(target, { replace: true });
  };

  // Anti‑FOUC: tant que checking=true, on ne rend rien de cliquable.
  if (checking) {
    return (
      <div aria-busy="true" aria-live="polite" className="min-h-screen">
        {/* Squelette minimal non interactif */}
      </div>
    );
  }

  return (
    <>
      {/* Les enfants (Header + Routes) ne deviennent interactifs qu’après évaluation */}
      {children}

      {/* La modale n’est pas montée sur la route publique /conditions */}
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
