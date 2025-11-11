import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import {
  loadActiveOpportunities,
  loadCategories,
  loadOpportunityCategories,
  searchOpportunities,
  type Opportunity,
  type Category,
  type OpportunityCategory,
} from "@/lib/csvParser";
import { ArrowLeft, Sparkles } from "lucide-react";

const OpportunitesPersonnalisees = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get("q") || "";
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [oppCats, setOppCats] = useState<OpportunityCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const opps = await loadActiveOpportunities();
      const cats = await loadCategories();
      const oppCatsData = await loadOpportunityCategories();
      setOpportunities(opps);
      setCategories(cats);
      setOppCats(oppCatsData);

      if (searchTerm) {
        const filtered = searchOpportunities(opps, searchTerm);
        setFilteredOpportunities(filtered); // Suppression de la troncature non mandatée
      } else {
        setFilteredOpportunities([]);
      }
    };
    fetchData();
  }, [searchTerm]);

  const getCategoryIconForOpportunity = (oppId: string): string | undefined => {
    const oppCat = oppCats.find((oc) => oc.opp_ID === oppId);
    if (oppCat) {
      const cat = categories.find((c) => c.cat_ID === oppCat.cat_ID);
      return cat?.Icone;
    }
    return undefined;
  };

  const getCategoryImageForOpportunity = (oppId: string): string | undefined => {
    const oppCat = oppCats.find((oc) => oc.opp_ID === oppId);
    if (oppCat) {
      const cat = categories.find((c) => c.cat_ID === oppCat.cat_ID);
      return cat?.Image;
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Link to="/recherche">
              <Button variant="outline" size="icon" aria-label="Retour à la recherche">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-primary" aria-hidden />
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                  Opportunités personnalisées
                </h2>
              </div>
              <p className="text-muted-foreground">
                Résultats pour : <span className="font-semibold text-foreground">"{searchTerm}"</span>
              </p>
            </div>
          </div>

          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.opp_ID}
                  opportunity={opportunity}
                  categoryIcon={getCategoryIconForOpportunity(opportunity.opp_ID)}
                  fallbackCategoryImage={getCategoryImageForOpportunity(opportunity.opp_ID)}
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
                <Button variant="outline">Nouvelle recherche</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OpportunitesPersonnalisees;
