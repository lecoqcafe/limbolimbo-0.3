import { Card } from "@/components/ui/card";
import type { Opportunity } from "@/lib/csvParser";
import * as LucideIcons from "lucide-react";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
  categoryIcon?: string;
}

export const OpportunityCard = ({ opportunity, onClick, categoryIcon }: OpportunityCardProps) => {
  const IconComponent = categoryIcon 
    ? (LucideIcons[categoryIcon as keyof typeof LucideIcons] as React.ComponentType<any>) 
    : null;

  return (
    <Card 
      className="bg-card shadow-card hover:shadow-hover transition-all duration-300 p-4 sm:p-6 cursor-pointer border border-border/30 group overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col items-center justify-center gap-3 text-center">
        {opportunity.Image ? (
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
            <img 
              src={opportunity.Image} 
              alt={opportunity.Opportunité}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : IconComponent ? (
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <IconComponent className="w-1/2 h-1/2 text-primary" />
          </div>
        ) : null}
        <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {opportunity.Opportunité}
        </h3>
      </div>
    </Card>
  );
};