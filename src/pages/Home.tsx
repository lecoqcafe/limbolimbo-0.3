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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Découvrez vos opportunités
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez nos catégories et trouvez les meilleures opportunités pour gagner de l'argent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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