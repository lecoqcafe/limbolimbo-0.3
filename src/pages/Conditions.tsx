import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchTermsVersion, TERMS_VERSION_FALLBACK } from "@/lib/terms";

/**
 * Page /conditions — Lecture seule
 * - Affiche le Markdown versionné (conditions.{version}.md) avec repli T1.0.
 * - Aucune action d’acceptation ici: l’acceptation est gérée exclusivement par TermsModal.
 * - Anti‑cache: lecture réseau avec no-store et cache-buster.
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
      const ct = res.headers.get("content-type") ?? "";
      const looksHtml = /^\s*<!DOCTYPE|^\s*<html[\\s>]/i.test(text);
      if (looksHtml || (!ct.includes("text/markdown") && !ct.includes("text/plain"))) {
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
        const primary = `/conditions.${resolved}.md?t=${now}`;
        const fallback = `/conditions.${TERMS_VERSION_FALLBACK}.md?t=${now}`;

        const md = await loadText(primary).catch(() => loadText(fallback));
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

  return (
    <main className="container mx-auto px-4 py-6 prose prose-neutral dark:prose-invert max-w-none">
      <h1 className="mb-2">Conditions d’utilisation — version {version}</h1>
      <article className="prose-sm sm:prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
