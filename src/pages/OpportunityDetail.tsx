import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  loadActiveOpportunities,
  loadCategories,
  loadOpportunityCategories,
  type Opportunity,
  type Category,
  type OpportunityCategory,
} from "@/lib/csvParser";
import { openExternal } from "@/lib/utils";
import { useUserActivity } from "@/lib/userActivity";
import LeCoqCafe from "@/assets/lecoqcafe.png";
import { ExternalLink, FileText } from "lucide-react";

const resolveImage = (file?: string, base = "/images/opps/"): string => {
  if (!file || !file.trim()) return "/placeholder.svg";
  const s = file.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `${base}${s}`;
};

const resolveCategoryImage = (file?: string, base = "/images/categories/"): string => {
  if (!file || !file.trim()) return "/placeholder.svg";
  const s = file.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `${base}${s}`;
};

const OpportunityDetail = () => {
  const [searchParams] = useSearchParams();
  const oppId = searchParams.get("id") || "";
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [oppCats, setOppCats] = useState<OpportunityCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { trackVisit, trackClick } = useUserActivity();
  useEffect(() => {
    const fetchData = async () => {
      const opps = await loadActiveOpportunities();
      const found = opps.find((o) => o.opp_ID === oppId);
      setOpportunity(found || null);

      const oppCatsData = await loadOpportunityCategories();
      const cats = await loadCategories();
      setOppCats(oppCatsData);
      setCategories(cats);
    };
    fetchData();
  }, [oppId]);

  // Tracker la visite de l'opportunité
  useEffect(() => {
    if (opportunity) {
      trackVisit(opportunity);
    }
  }, [opportunity, trackVisit]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-background">
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

  const hasOppImage = !!(opportunity.Image && opportunity.Image.trim());
  const oppSrc = hasOppImage ? resolveImage(opportunity.Image) : undefined;

  const categoryImage = (() => {
    const oc = oppCats.find((c) => c.opp_ID === opportunity.opp_ID);
    if (!oc) return undefined;
    const cat = categories.find((c) => c.cat_ID === oc.cat_ID);
    return cat?.Image;
  })();

  const catSrc = categoryImage ? resolveCategoryImage(categoryImage) : "/placeholder.svg";
  const initialImgSrc = oppSrc ?? catSrc;

  const handleImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
    if (hasOppImage && categoryImage && img.src !== catSrc) {
      img.onerror = null;
      img.src = catSrc;
    } else {
      img.onerror = null;
      img.src = "/placeholder.svg";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* En-tête avec visuel 96 px */}
          <div className="flex items-center gap-4">
            <img
              src={initialImgSrc}
              alt={`Image de l’opportunité ${opportunity.Opportunité}`}
              className="w-24 h-24 rounded-xl object-cover bg-muted"
              onError={handleImgError}
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {opportunity.Opportunité}
            </h1>
          </div>

          <Card className="bg-gradient-card shadow-card p-8 border-border/50">
            <div className="space-y-8">
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
                  size="lg"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
                  onClick={() => {
                    trackClick(opportunity);
                    window.open(opportunity["Lien d'affiliation"] || "#", "_blank", "noopener noreferrer");
                  }}
                >
                  Découvrir l'opportunité
                  <ExternalLink className="h-5 w-5" />
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
