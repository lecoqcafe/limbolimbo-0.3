import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchTermsVersion, TERMS_VERSION_FALLBACK } from "@/lib/terms";

/**
 * Page /conditions — Lecture seule
 * - Affiche le Markdown versionné (conditions.{version}.md) avec repli T1.0.
 * - Aucune action d’acceptation ici: l’acceptation est gérée exclusivement par TermsModal.
 * - Anti‑cache: lecture réseau avec no-store et cache-buster.
 * - Fallback texte minimal si 404 / contenu HTML / erreur réseau.
 */
export default function ConditionsPage() {
  const [version, setVersion] = React.useState<string>(TERMS_VERSION_FALLBACK);
  const [content, setContent] = React.useState<string>("Chargement des Conditions…");

  React.useEffect(() => {
    let cancelled = false;

    const loadText = async (url: string) => {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { "cache-control": "no-cache", pragma: "no-cache" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();

      // Protection contre un fallback SPA éventuel (index.html)
      const ct = (res.headers.get("content-type") ?? "").toLowerCase();
      const looksHtml = /^\s*<!DOCTYPE|^\s*<html[\s>]/i.test(text);
      const isMarkdownOrText = ct.includes("text/markdown") || ct.includes("text/plain");
      if (looksHtml || !isMarkdownOrText) {
        throw new Error("Invalid content");
      }
      return text;
    };

    (async () => {
      try {
        const v = await fetchTermsVersion();
        if (cancelled) return;

        const resolved = v || TERMS_VERSION_FALLBACK;
        setVersion(resolved);

        const now = Date.now();
        const primary = `/conditions.${resolved}.md?v=03109&t=${now}`;
        const fallback = `/conditions.${TERMS_VERSION_FALLBACK}.md?v=03109&t=${now}`;

        const md = await loadText(primary).catch(() => loadText(fallback));
        if (!cancelled) setContent(md);
      } catch {
        if (!cancelled) {
          setContent(
            "Résumé minimal: vous devez accepter les Conditions d’utilisation pour utiliser l’application. " +
              "Le texte détaillé est momentanément indisponible (hors ligne ou serveur). Réessayez plus tard."
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container mx-auto px-4 py-6 prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="mb-2">Conditions d’utilisation — version {version}</h1>
      <article className="prose-sm sm:prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </main>
  );
}
