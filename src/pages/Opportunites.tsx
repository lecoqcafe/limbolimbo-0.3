import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import { 
  loadOpportunities, 
  loadCategories, 
  loadOpportunityCategories,
  getOpportunitiesByCategory,
  type Opportunity,
  type Category 
} from "@/lib/csvParser";
import { ArrowLeft } from "lucide-react";

const Opportunites = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get("cat") || "";
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const opps = await loadOpportunities();
      const cats = await loadCategories();
      const oppCats = await loadOpportunityCategories();
      
      const currentCategory = cats.find(c => c.cat_ID === categoryId);
      setCategory(currentCategory || null);
      
      if (categoryId) {
        const filteredOpps = getOpportunitiesByCategory(opps, oppCats, categoryId);
        setOpportunities(filteredOpps.slice(0, 10)); // Max 10 opportunités
      }
    };
    fetchData();
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {category?.Catégorie || "Opportunités"}
              </h2>
              {category?.['Description de la catégorie'] && (
                <p className="text-muted-foreground mt-1">
                  {category['Description de la catégorie']}
                </p>
              )}
            </div>
          </div>

          {opportunities.length > 0 ? (
            <div className="space-y-3">
              {opportunities.map((opportunity) => (
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
                Aucune opportunité disponible dans cette catégorie pour le moment.
              </p>
              <Link to="/">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Retour aux catégories
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Opportunites;