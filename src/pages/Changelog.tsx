import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const Changelog = () => {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/changelog.txt?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) {
          setError("Journal des versions indisponible pour le moment.");
          return;
        }
        const ct = res.headers.get("Content-Type") ?? "";
        const body = await res.text();
        const looksHtml = /^\s*<!DOCTYPE|^\s*<html[\s>]/i.test(body);
        if (!ct.includes("text/plain") || looksHtml) {
          setError("Journal des versions indisponible pour le moment.");
          return;
        }
        setText(body);
      } catch {
        setError("Journal des versions indisponible pour le moment.");
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Journal des versions</h1>
          </div>

          <Card className="bg-gradient-card shadow-card border border-border/50 p-6">
            {error ? (
              <p className="text-muted-foreground">{error}</p>
            ) : text ? (
              <pre className="whitespace-pre-wrap text-sm md:text-base leading-relaxed text-foreground">
                {text}
              </pre>
            ) : (
              <p className="text-muted-foreground">Chargement…</p>
            )}
          </Card>

          <div className="flex justify-end">
            <Button asChild variant="secondary">
              <a href="/changelog.txt" target="_blank" rel="noopener noreferrer">
                Ouvrir le fichier texte
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Changelog;
