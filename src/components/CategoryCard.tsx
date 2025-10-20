import { Card } from "@/components/ui/card";
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
      className="bg-card shadow-card hover:shadow-hover transition-all duration-300 p-8 cursor-pointer border border-border/30 group overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col items-center justify-center gap-4 text-center">
        <div className="p-6 rounded-2xl bg-primary/20 group-hover:bg-primary/30 transition-all duration-300 group-hover:scale-110">
          <IconComponent className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {category.Catégorie}
        </h3>
      </div>
    </Card>
  );
};