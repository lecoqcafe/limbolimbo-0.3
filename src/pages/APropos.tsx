import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

type VersionInfo = { name?: string; version?: string; build?: string };

const APropos = () => {
  const [version, setVersion] = useState<string | undefined>();
  const [build, setBuild] = useState<string | undefined>();

  useEffect(() => {
    const loadVersion = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const json: VersionInfo = await res.json();
        setVersion(json.version);
        setBuild(json.build);
      } catch {
        // La page doit s'afficher même sans version.json
      }
    };
    loadVersion();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Info className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              À propos de LIMBOLIMBO
            </h1>
          </div>

          <Card className="bg-gradient-card shadow-card border border-border/50 p-6 md:p-8 space-y-6">
            <section className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p className="text-foreground">
                LIMBOLIMBO est une application conçue et écrite par LeCOQ.Café.
              </p>
              <p>
                Elle vous aide à découvrir des opportunités pour gagner des récompenses par
                diverses tâches, regroupées par catégories.
              </p>
              <p>L’application est légère et installable comme application web (PWA).</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Comment ça marche</h2>
              <p className="text-muted-foreground">
                Vous parcourez les catégories ou vous utilisez la recherche. Vous sélectionnez une
                opportunité. Vous ouvrez sa fiche pour en lire la description et accéder au lien du
                partenaire. Vous restez libre de vos choix, sans engagement, en toute transparence
                et respect.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">Avertissement</h2>
              <p className="text-muted-foreground">
                Ce site contient des témoignages subjectifs à partir des expériences et des
                recherches de son opérateur. Ce contenu est destiné uniquement au divertissement.
                Les utilisateurs sont expressément invités à se faire leur propre opinion et à agir
                sous leur propre responsabilité. L'opérateur ne peut donc, en aucun cas, être
                imputable de résultats de décisions des utilisateurs.
              </p>
              <p className="text-muted-foreground">
                Ce site est financé principalement par des liens d'affiliations et des revenus
                publicitaires. Pour chaque inscription à un service présenté ici, l'opérateur reçoit
                une commission ou une part de revenus. Pour une meilleure expérience et afin
                d'apprécier toutes nos fonctionnalités, il est préférable de désactiver votre
                bloqueur de publicités.
              </p>
            </section>

            <section className="pt-2 space-y-2 text-sm md:text-base">
              <p className="text-foreground">© 2024–2025 LeCOQ.Café</p>
              <p className="text-muted-foreground">
                Version {version ?? "—"}{build ? ` — build ${build}` : ""}
              </p>
              {/* Lien vers le journal des versions */}
              <p>
                <a
                  href="/changelog.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Voir le journal des versions (Changelog)
                </a>
              </p>
            </section>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default APropos;
