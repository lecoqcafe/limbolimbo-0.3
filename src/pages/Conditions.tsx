import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchTermsVersion, TERMS_VERSION_FALLBACK } from "@/lib/terms";

export default function ConditionsPage() {
  const [version, setVersion] = React.useState<string>(TERMS_VERSION_FALLBACK);
  const [content, setContent] = React.useState<string>("Chargement des Conditions…");

  React.useEffect(() => {
    let cancelled = false;

    const withTimeout = <T,>(p: Promise<T>, ms: number) =>
      new Promise<T>((resolve, reject) => {
        const id = setTimeout(() => reject(new Error("timeout")), ms);
        p.then(
          (v) => {
            clearTimeout(id);
            resolve(v);
          },
          (e) => {
            clearTimeout(id);
            reject(e);
          }
        );
      });

    const loadText = async (url: string) => {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { "cache-control": "no-store, no-cache", pragma: "no-cache" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const ct = (res.headers.get("content-type") ?? "").toLowerCase();
      const body = await res.text();

      const looksHtml = /^\s*<!DOCTYPE|^\s*<html[\s>]/i.test(body);
      const isMarkdownOrText = ct.includes("text/markdown") || ct.includes("text/plain");
      const isEmpty = body.trim().length === 0;

      if (looksHtml || !isMarkdownOrText || isEmpty) {
        throw new Error("Invalid content");
      }
      return body;
    };

    (async () => {
      try {
        const v = await withTimeout(fetchTermsVersion(), 3000).catch(() => TERMS_VERSION_FALLBACK);
        if (cancelled) return;

        const resolved = v || TERMS_VERSION_FALLBACK;
        setVersion(resolved);

        const primary = `/conditions.${resolved}.md?v=03110`;
        const fallback = `/conditions.${TERMS_VERSION_FALLBACK}.md?v=03110`;

        const md = await withTimeout(loadText(primary), 3000).catch(() =>
          withTimeout(loadText(fallback), 3000)
        );

        if (!cancelled) setContent(md);
      } catch {
        if (!cancelled) {
          setContent(
            "Résumé minimal: vous devez accepter les Conditions d’utilisation pour utiliser l’application. " +
              "Le texte détaillé est momentanément indisponible (hors ligne, contenu invalide ou serveur). " +
              "Veuillez réessayer plus tard."
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
