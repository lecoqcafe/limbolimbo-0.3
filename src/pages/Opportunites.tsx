import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import {
  loadActiveOpportunities,
  loadCategories,
  loadOpportunityCategories,
  getOpportunitiesByCategory,
  type Opportunity,
  type Category,
  type OpportunityCategory,
} from "@/lib/csvParser";

const resolveCategoryImage = (file?: string): string | undefined => {
  if (!file) return undefined;
  const s = file.trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `/images/categories/${s}`;
};

const Opportunites = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get("cat") || "";

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [oppCats, setOppCats] = useState<OpportunityCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const opps = await loadActiveOpportunities();
      const cats = await loadCategories();
      const oppCatsData = await loadOpportunityCategories();

      setCategories(cats);
      setOppCats(oppCatsData);

      const currentCategory = cats.find((c) => c.cat_ID === categoryId);
      setCategory(currentCategory || null);

      if (categoryId) {
        const filteredOpps = getOpportunitiesByCategory(opps, oppCatsData, categoryId);
        setOpportunities(filteredOpps.slice(0, 10)); // Max 10 opportunités
      }
    };
    fetchData();
  }, [categoryId]);

  const getCategoryIconForOpportunity = (oppId: string): string | undefined => {
    const oppCat = oppCats.find((oc) => oc.opp_ID === oppId);
    if (oppCat) {
      const cat = categories.find((c) => c.cat_ID === oppCat.cat_ID);
      return cat?.Icone;
    }
    return undefined;
  };

  const categoryImg = resolveCategoryImage(category?.Image);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            {categoryImg && (
              <img
                src={categoryImg}
                alt={`Catégorie ${category?.Catégorie ?? ""}`}
                className="w-24 h-24 rounded-xl object-cover bg-muted"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
            )}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {category?.Catégorie || "Opportunités"}
              </h2>
              {category?.["Description de la catégorie"] && (
                <p className="text-muted-foreground mt-1">
                  {category["Description de la catégorie"]}
                </p>
              )}
            </div>
          </div>

          {opportunities.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.opp_ID}
                  opportunity={opportunity}
                  categoryIcon={getCategoryIconForOpportunity(opportunity.opp_ID)}
                  fallbackCategoryImage={category?.Image}
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
