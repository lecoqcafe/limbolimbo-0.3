import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import { loadOpportunities, searchOpportunities, type Opportunity } from "@/lib/csvParser";
import { ArrowLeft, Sparkles } from "lucide-react";

const OpportunitesPersonnalisees = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get("q") || "";
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const opps = await loadOpportunities();
      setOpportunities(opps);
      
      if (searchTerm) {
        const filtered = searchOpportunities(opps, searchTerm);
        setFilteredOpportunities(filtered.slice(0, 10)); // Max 10 opportunités
      }
    };
    fetchData();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Link to="/recherche">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Opportunités personnalisées
                </h2>
              </div>
              <p className="text-muted-foreground">
                Résultats pour : <span className="font-semibold text-foreground">"{searchTerm}"</span>
              </p>
            </div>
          </div>

          {filteredOpportunities.length > 0 ? (
            <div className="space-y-3">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard 
                  key={opportunity.opp_ID} 
                  opportunity={opportunity}
                  onClick={() => navigate(`/opportunite?id=${opportunity.opp_ID}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-lg text-muted-foreground">
                Aucune opportunité trouvée pour "{searchTerm}"
              </p>
              <Link to="/recherche">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Nouvelle recherche
                </Button>
              </Link>
            </div>
          )}

          {filteredOpportunities.length > 0 && (
            <div className="text-center">
              <Link to="/recherche">
                <Button variant="outline">
                  Nouvelle recherche
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OpportunitesPersonnalisees;