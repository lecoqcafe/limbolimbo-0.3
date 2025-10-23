import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";
import type { Category } from "@/lib/csvParser";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const resolveCategoryImage = (file?: string): string | undefined => {
  if (!file) return undefined;
  const s = file.trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/") || s.startsWith("data:")) return s;
  return `/images/categories/${s}`;
};

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const IconComponent =
    category.Icone && (Icons as any)[category.Icone]
      ? ((Icons as any)[category.Icone] as React.ComponentType<any>)
      : Icons.Sparkles;

  const imgSrc = resolveCategoryImage(category.Image);

  return (
    <Card
      className="bg-card shadow-card hover:shadow-hover transition-all duration-300 p-3 sm:p-4 cursor-pointer border border-border/30 group overflow-hidden relative"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex flex-col items-center justify-center gap-2 text-center">
        {imgSrc ? (
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src={imgSrc}
              alt={`Image de la catégorie ${category.Catégorie}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
            />
          </div>
        ) : (
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
            <IconComponent className="w-12 h-12 text-primary" />
          </div>
        )}

        <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors break-words">
          {category.Catégorie}
        </h3>
      </div>
    </Card>
  );
};
