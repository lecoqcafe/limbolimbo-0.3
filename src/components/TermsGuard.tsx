import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TermsModal from "@/components/TermsModal";
import { fetchTermsVersion, isTermsAccepted } from "@/lib/terms";

/**
 * TermsGuard — Garde globale unifiée des Conditions d’utilisation.
 * Rôle: anti‑FOUC total, redirection stricte vers /conditions tant que non accepté,
 *       gestion du message “Stockage local requis” et synchro multi‑onglets.
 */

const PUBLIC_ROUTE = "/conditions";
type Props = { children: React.ReactNode };

export default function TermsGuard({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const [checking, setChecking] = React.useState(true);
  const [termsVersion, setTermsVersion] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [storageError, setStorageError] = React.useState<string | null>(null);

  // Mémorise la première route d’origine pour le retour après acceptation.
  const initialPathRef = React.useRef<string | null>(null);

  const currentFullPath = React.useMemo(
    () => `${location.pathname}${location.search}${location.hash}`,
    [location.pathname, location.search, location.hash]
  );
  const isOnPublic = location.pathname === PUBLIC_ROUTE;

  const evaluate = React.useCallback(
    async (_trigger: "mount" | "nav" | "storage" | "retry") => {
      setStorageError(null);
      try {
        // 1) Lire la version courante des Conditions
        const v = await fetchTermsVersion();
        setTermsVersion(v);

        // 2) Vérifier l’acceptation locale (peut lever si localStorage indisponible)
        let accepted = false;
        try {
          accepted = isTermsAccepted(v);
        } catch {
          // localStorage indisponible → bloquer et proposer Réessayer
          setModalOpen(false);
          setChecking(false);
          setStorageError(
            "Stockage local requis pour mémoriser votre acceptation. Veuillez activer le stockage et réessayer."
          );
          return;
        }

        // 3) Si déjà accepté → libérer la garde
        if (accepted) {
          setModalOpen(false);
          setChecking(false);
          initialPathRef.current = null;
          return;
        }

        // 4) Non accepté → ouvrir la modale et rediriger strictement vers /conditions
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
        // Prudence: si lecture terms/version échoue → activer la modale (texte minimal embarqué côté TermsModal)
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

  // Évaluation initiale et à chaque navigation (anti‑FOUC: pas de rendu interactif tant que 'checking')
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

  // Synchronisation multi‑onglets via 'storage'
  React.useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "limbo:terms:app") {
        evaluate("storage");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [evaluate]);

  // Acceptation via la modale : retour vers ?redirect ou route mémorisée
  const handleAccepted = (_version: string) => {
    setModalOpen(false);
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get("redirect");
    const decoded = redirectParam ? decodeURIComponent(redirectParam) : null;
    const target =
      decoded && (decoded.startsWith("/") || decoded.startsWith("#"))
        ? decoded
        : initialPathRef.current && initialPathRef.current !== PUBLIC_ROUTE
        ? initialPathRef.current
        : "/";
    initialPathRef.current = null;
    navigate(target, { replace: true });
  };

  // Bouton “Réessayer” (stockage local)
  const handleRetryStorage = () => {
    setChecking(true);
    evaluate("retry");
  };

  // Anti‑FOUC: squelette non interactif tant que l’évaluation n’est pas terminée
  if (checking) {
    return (
      <div aria-busy="true" aria-live="polite" className="min-h-screen" />
    );
  }

  // État bloquant si le stockage local est indisponible
  if (storageError) {
    return (
      <main
        role="alert"
        aria-live="polite"
        className="min-h-screen flex items-center justify-center p-6 text-center"
      >
        <div className="max-w-md space-y-3">
          <h1 className="text-xl font-semibold">Stockage local requis</h1>
          <p className="text-muted-foreground">
            {storageError}
          </p>
          <button
            type="button"
            onClick={handleRetryStorage}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Les enfants (Header + Routes) sont rendus uniquement après évaluation */}
      {children}

      {/* Modale d’acceptation — rendue aussi sur /conditions */}
      <TermsModal
        open={modalOpen}
        version={termsVersion ?? undefined}
        onAccepted={handleAccepted}
      />
    </>
  );
}
