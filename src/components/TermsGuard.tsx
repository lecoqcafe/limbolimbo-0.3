import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TermsModal from "@/components/TermsModal";
import { fetchTermsVersion, isTermsAccepted } from "@/lib/terms";

/**
 * TermsGuard — Garde globale unifiée des Conditions d’utilisation.
 *
 * Exigences (E02 / Q3.10 / Q3.13) :
 * - Acceptation unique via TermsModal, y compris sur /conditions.
 * - Redirection stricte vers /conditions tant que non accepté, avec ?redirect et retour via replace:true.
 * - Anti‑FOUC : ne pas rendre de contenu cliquable avant évaluation.
 * - Synchronisation multi‑onglets via événement 'storage' (clé limbo:terms:app).
 */

const PUBLIC_ROUTE = "/conditions";

type Props = { children: React.ReactNode };

export default function TermsGuard({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const [checking, setChecking] = React.useState(true);
  const [termsVersion, setTermsVersion] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Mémorise la première route d’origine pour le retour après acceptation.
  const initialPathRef = React.useRef<string | null>(null);

  const currentFullPath = React.useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.pathname, location.search, location.hash]
  );

  const isOnPublic = location.pathname === PUBLIC_ROUTE;

  const evaluate = React.useCallback(
    async (_trigger: "mount" | "nav" | "storage") => {
      try {
        const v = await fetchTermsVersion();
        setTermsVersion(v);

        const accepted = isTermsAccepted(v);

        if (accepted) {
          setModalOpen(false);
          setChecking(false);
          initialPathRef.current = null;
          return;
        }

        // Non accepté : blocage global + redirection stricte si nécessaire.
        setModalOpen(true);

        if (!initialPathRef.current && currentFullPath !== PUBLIC_ROUTE) {
          initialPathRef.current = currentFullPath;
        }

        if (!isOnPublic) {
          const redirect = encodeURIComponent(
            initialPathRef.current ?? currentFullPath ?? "/"
          );
          navigate(`${PUBLIC_ROUTE}?redirect=${redirect}`, { replace: true });
        }

        setChecking(false);
      } catch {
        // Conservateur : on redirige vers /conditions et on affiche la modale.
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
  }, [location.key, evaluate]);

  // Synchronisation multi‑onglets via 'storage'.
  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "limbo:terms:app") {
        evaluate("storage");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [evaluate]);

  // Acceptation via la modale : retour vers ?redirect ou route mémorisée.
  const handleAccepted = (_version: string) => {
    setModalOpen(false);

    const params = new URLSearchParams(location.search);
    const redirectParam = params.get("redirect");
    const decoded = redirectParam ? decodeURIComponent(redirectParam) : null;

    const target =
      (decoded && (decoded.startsWith("/") || decoded.startsWith("#")))
        ? decoded
        : initialPathRef.current && initialPathRef.current !== PUBLIC_ROUTE
        ? initialPathRef.current
        : "/";

    initialPathRef.current = null;
    navigate(target, { replace: true });
  };

  // Anti‑FOUC : squelette non interactif tant que l’évaluation n’est pas terminée.
  if (checking) {
    return (
      <div aria-busy="true" aria-live="polite" className="min-h-screen">
        {/* Squelette minimal non interactif */}
      </div>
    );
  }

  return (
    <>
      {/* Les enfants (Header + Routes) sont rendus uniquement après évaluation */}
      {children}

      {/* Q3.10 : la modale est rendue AUSSI sur /conditions */}
      <TermsModal
        open={modalOpen}
        version={termsVersion ?? undefined}
        onAccepted={handleAccepted}
      />
    </>
  );
}
