import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadActiveOpportunities, type Opportunity } from "@/lib/csvParser";
import { openExternal } from "@/lib/utils";
import LeCoqCafe from "@/assets/lecoqcafe.png";
import { ExternalLink, FileText } from "lucide-react";

const resolveImage = (file?: string, base = "/images/opps/"): string => {
  if (!file || !file.trim()) return "/placeholder.svg";
  const s = file.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `${base}${s}`;
};

const OpportunityDetail = () => {
  const [searchParams] = useSearchParams();
  const oppId = searchParams.get("id") || "";
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const opps = await loadActiveOpportunities();
      const found = opps.find((o) => o.opp_ID === oppId);
      setOpportunity(found || null);
    };
    fetchData();
  }, [oppId]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-muted-foreground">Opportunité non trouvée</p>
            <Link to="/">
              <Button className="mt-4 bg-gradient-primary hover:opacity-90">Retour à l'accueil</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const headerImg = resolveImage(opportunity.Image);
  const heroImg = resolveImage(opportunity.Image);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* En-tête avec visuel 96 px */}
          <div className="flex items-center gap-4">
            <img
              src={headerImg}
              alt={`Image de l’opportunité ${opportunity.Opportunité}`}
              className="w-24 h-24 rounded-xl object-cover bg-muted"
              onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {opportunity.Opportunité}
            </h1>
          </div>

          <Card className="bg-gradient-card shadow-card p-8 border-border/50">
            <div className="space-y-8">
              {/* Héro image 1:1 */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={heroImg}
                  alt={`Image de l’opportunité ${opportunity.Opportunité}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
              </div>

              {/* Description avec icône seule */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" aria-hidden />
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {opportunity["Description de l'opportunité"] || "Description non disponible"}
                </p>
              </div>

              {/* Lien Chronique LeCOQ.Café (optionnel) */}
              {opportunity.ChroniqueURL && (
                <div className="pt-2">
                  <button
                    onClick={() => openExternal(opportunity.ChroniqueURL!)}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border border-border/50 hover:bg-secondary transition-colors"
                    aria-label="Consulter la chronique LeCOQ.Café"
                  >
                    <img src={LeCoqCafe} alt="LeCOQ.Café" className="w-9 h-9" />
                    <span className="text-foreground font-medium">Consulter la chronique LeCOQ.Café</span>
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Métadonnées */}
              {opportunity.opp_ID && (
                <div className="text-sm text-muted-foreground border-t border-border/50 pt-4">
                  <span className="font-mono">ID: {opportunity.opp_ID}</span>
                </div>
              )}

              {/* CTA principal */}
              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
                >
                  <a
                    href={opportunity["Lien d'affiliation"] || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Découvrir l'opportunité
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OpportunityDetail;
