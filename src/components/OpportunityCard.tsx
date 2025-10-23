import { Card } from "@/components/ui/card";
import type { Opportunity } from "@/lib/csvParser";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
  categoryIcon?: string;
}

const resolveImage = (file?: string, base = "/images/opps/"): string => {
  if (!file || !file.trim()) return "/placeholder.svg";
  const s = file.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `${base}${s}`;
};

export const OpportunityCard = ({ opportunity, onClick, categoryIcon: _categoryIcon }: OpportunityCardProps) => {
  const imgSrc = resolveImage(opportunity.Image);

  return (
    <Card
      className="bg-card shadow-card hover:shadow-hover transition-all duration-300 p-3 sm:p-4 cursor-pointer border border-border/30 group overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
          <img
            src={imgSrc}
            alt={`Image de l’opportunité ${opportunity.Opportunité}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {opportunity.Opportunité}
        </h3>
      </div>
    </Card>
  );
};
