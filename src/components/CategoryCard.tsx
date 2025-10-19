import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { Category } from "@/lib/csvParser";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <Card 
      className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 p-6 cursor-pointer border-border/50 group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {category.categorie}
          </h3>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Card>
  );
};