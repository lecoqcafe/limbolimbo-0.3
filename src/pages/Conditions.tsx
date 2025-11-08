import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  acceptTerms,
  fetchTermsVersion,
  TERMS_VERSION_FALLBACK,
} from "@/lib/terms";

/**
 * Page /conditions
 * - Affiche le Markdown versionné (conditions.{version}.md) avec repli T1.0.
 * - Propose un bouton « J’accepte {version} » en haut et en bas.
 * - Après acceptation: redirection vers ?redirect=... ou vers "/".
 */

export default function ConditionsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [version, setVersion] = React.useState<string>(TERMS_VERSION_FALLBACK);
  const [content, setContent] = React.useState<string>("Chargement des Conditions…");

  // Détermine l’URL de redirection après acceptation.
  const redirectTo = React.useMemo(() => {
    const r = params.get("redirect");
    return r && r.startsWith("/") ? r : "/";
  }, [params]);

  // Charge la version et le fichier Markdown associé.
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const v = await fetchTermsVersion();
      if (cancelled) return;

      const resolved = v || TERMS_VERSION_FALLBACK;
      setVersion(resolved);

      // Tente le fichier correspondant à la version, puis repli T1.0
      const primary = `/conditions.${resolved}.md?t=${Date.now()}`;
      const fallback = `/conditions.${TERMS_VERSION_FALLBACK}.md?t=${Date.now()}`;

      const load = async (url: string) => {
        const res = await fetch(url, {
          cache: "no-store",
          headers: { "cache-control": "no-cache", pragma: "no-cache" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      };

      try {
        const md = await load(primary).catch(() => load(fallback));
        if (!cancelled) setContent(md);
      } catch {
        if (!cancelled) {
          setContent(
            "Impossible de charger les Conditions pour le moment. Veuillez réessayer plus tard."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAccept = () => {
    acceptTerms(version);
    navigate(redirectTo, { replace: true });
  };

  const AcceptButton = (
    <div className="my-4 flex justify-end">
      <Button onClick={handleAccept}>J’accepte {version}</Button>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-6 prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="mb-2">Conditions d’utilisation — version {version}</h1>
      {AcceptButton}
      <article className="prose-sm sm:prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>
      {AcceptButton}
    </main>
  );
}
