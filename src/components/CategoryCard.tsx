import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { Category } from "@/lib/csvParser";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  // Get the icon component from lucide-react
  const IconComponent = category.Icone && (Icons as any)[category.Icone] 
    ? (Icons as any)[category.Icone] 
    : Icons.Sparkles;

  return (
    <Card 
      className="bg-card shadow-card hover:shadow-hover transition-all duration-300 p-6 cursor-pointer border border-border/30 group overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {category.Catégorie}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {category['Description de la catégorie']}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </div>
    </Card>
  );
};