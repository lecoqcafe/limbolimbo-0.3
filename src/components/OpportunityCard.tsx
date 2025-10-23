import { Card } from "@/components/ui/card";
import type { Opportunity } from "@/lib/csvParser";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
  categoryIcon?: string; // compatibilité
  fallbackCategoryImage?: string; // NOUVEAU: image catégorie en repli
}

const resolveOppImage = (file?: string, base = "/images/opps/"): string => {
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

export const OpportunityCard = ({
  opportunity,
  onClick,
  categoryIcon: _categoryIcon,
  fallbackCategoryImage,
}: OpportunityCardProps) => {
  const hasOppImage = !!(opportunity.Image && opportunity.Image.trim());
  const initialSrc = hasOppImage
    ? resolveOppImage(opportunity.Image)
    : fallbackCategoryImage
    ? resolveCategoryImage(fallbackCategoryImage)
    : "/placeholder.svg";

  const handleImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
    const catSrc = fallbackCategoryImage ? resolveCategoryImage(fallbackCategoryImage) : "/placeholder.svg";
    // Si on avait l'image d'opportunité et qu'elle échoue, bascule sur l'image de catégorie.
    // Sinon, bascule sur le placeholder (évite boucle d'erreurs).
    if (hasOppImage && fallbackCategoryImage && img.src !== catSrc) {
      img.onerror = null;
      img.src = catSrc;
    } else {
      img.onerror = null;
      img.src = "/placeholder.svg";
    }
  };

  return (
    <Card
      className="bg-card shadow-card hover:shadow-hover transition-all duration-300 p-3 sm:p-4 cursor-pointer border border-border/30 group overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
          <img
            src={initialSrc}
            alt={`Image de l’opportunité ${opportunity.Opportunité}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImgError}
          />
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {opportunity.Opportunité}
        </h3>
      </div>
    </Card>
  );
};
