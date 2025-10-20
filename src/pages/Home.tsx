import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CategoryCard } from "@/components/CategoryCard";
import { loadCategories, type Category } from "@/lib/csvParser";
import { Sparkles } from "lucide-react";

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const cats = await loadCategories();
      setCategories(cats);
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/opportunites?cat=${categoryId}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Découvrez vos opportunités
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Explorez nos catégories et trouvez les meilleures opportunités pour gagner de l'argent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {categories.map((category) => (
            <CategoryCard
              key={category.cat_ID}
              category={category}
              onClick={() => handleCategoryClick(category.cat_ID)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;