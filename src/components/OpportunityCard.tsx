import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Opportunity } from "@/lib/csvParser";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export const OpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 p-6 border-border/50">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          {opportunity.opportunite}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {opportunity.description}
        </p>
        <Button 
          asChild
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <a 
            href={opportunity.lien} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Découvrir l'opportunité
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
};