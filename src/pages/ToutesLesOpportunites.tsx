import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OpportunityCard } from "@/components/OpportunityCard";
import {
  loadOpportunities,
  loadCategories,
  loadOpportunityCategories,
  type Opportunity,
  type Category,
  type OpportunityCategory,
} from "@/lib/csvParser";

function resolveCategoryImage(file?: string): string | undefined {
  if (!file) return undefined;
  const s = file.trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `/images/categories/${s}`;
}

const ToutesLesOpportunites = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<Opportunity[]>([]);
  const [fallbackByOpp, setFallbackByOpp] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    const run = async () => {
      const [opps, oppCats, cats] = await Promise.all([
        loadOpportunities(),
        loadOpportunityCategories(),
        loadCategories(),
      ]);

      // 1) Filtre strict: Statut === "1"
      const actives = opps.filter((o) => (o.Statut ?? "").trim() === "1");

      // 2) Dédoublonnage par opp_ID
      const map = new Map<string, Opportunity>();
      for (const o of actives) {
        if (!map.has(o.opp_ID)) map.set(o.opp_ID, o);
      }

      // 3) À partir de 101 + tri numérique asc
      const sorted = Array.from(map.values())
        .filter((o) => {
          const id = parseInt(o.opp_ID, 10);
          return !Number.isNaN(id) && id >= 101;
        })
        .sort((a, b) => parseInt(a.opp_ID, 10) - parseInt(b.opp_ID, 10));

      // 4) Fallback image: première catégorie avec image
      const catImageById = new Map<string, string | undefined>();
      for (const c of cats) catImageById.set(c.cat_ID, c.Image);

      const fb: Record<string, string | undefined> = {};
      for (const oc of oppCats) {
        if (fb[oc.opp_ID] === undefined) {
          const img = catImageById.get(oc.cat_ID);
          if (img) fb[oc.opp_ID] = img;
        }
      }

      setList(sorted);
      setFallbackByOpp(fb);
    };
    run();
  }, []);

  const deco = "/images/categories/tout.png";

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <img
              src={deco}
              alt="Toutes les opportunités"
              className="w-24 h-24 rounded-xl object-cover bg-muted"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Toutes les opportunités</h1>
          </div>

          {list.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {list.map((o) => (
                <OpportunityCard
                  key={o.opp_ID}
                  opportunity={o}
                  fallbackCategoryImage={resolveCategoryImage(fallbackByOpp[o.opp_ID])}
                  onClick={() => navigate(`/opportunite?id=${o.opp_ID}`)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Aucune opportunité active à afficher pour le moment.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ToutesLesOpportunites;
