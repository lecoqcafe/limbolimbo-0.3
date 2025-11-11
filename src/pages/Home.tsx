import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "@/components/CategoryCard";
import { loadCategories, type Category } from "@/lib/csvParser";

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
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <div className="text-2xl font-bold text-foreground">LIMBOLIMBO</div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Découvrez vos opportunités
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Explorez nos catégories et trouvez les meilleures opportunités pour gagner de l'argent
          </p>
        </div>

        <div
          className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 max-w-7xl mx-auto"
          data-grid-version="v0.2.105"
        >
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
