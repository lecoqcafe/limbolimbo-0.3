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
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {opportunity["Description de l'opportunité"]}
                </p>
              </div>

              <div className="pt-4">
                <Button 
                  asChild
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
                >
                  <a 
                    href={opportunity["Lien d'affiliation"]} 
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
