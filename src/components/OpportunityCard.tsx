import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { Opportunity } from "@/lib/csvParser";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
}

export const OpportunityCard = ({ opportunity, onClick }: OpportunityCardProps) => {
  return (
    <Card 
      className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 p-4 border-border/50 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {opportunity.Opportunité}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {opportunity["Description de l'opportunité"]}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Card>
  );
};