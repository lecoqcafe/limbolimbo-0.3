import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadOpportunities, type Opportunity } from "@/lib/csvParser";
import { ArrowLeft, ExternalLink } from "lucide-react";

const OpportunityDetail = () => {
  const [searchParams] = useSearchParams();
  const oppId = searchParams.get("id") || "";
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const opps = await loadOpportunities();
      const found = opps.find(o => o.opp_ID === oppId);
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
              <Button className="mt-4 bg-gradient-primary hover:opacity-90">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {opportunity.Opportunité}
            </h1>
          </div>

          <Card className="bg-gradient-card shadow-card p-8 border-border/50">
            <div className="space-y-8">
              {opportunity.Image && (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={opportunity.Image} 
                    alt={opportunity.Opportunité}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="text-primary">📋</span>
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                  {opportunity["Description de l'opportunité"] || "Description non disponible"}
                </p>
              </div>

              {opportunity.opp_ID && (
                <div className="text-sm text-muted-foreground border-t border-border/50 pt-4">
                  <span className="font-mono">ID: {opportunity.opp_ID}</span>
                </div>
              )}

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
