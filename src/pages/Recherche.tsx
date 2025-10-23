import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Recherche = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/opportunites-personnalisees?q=${encodeURIComponent(q)}`);
    }
  };

  const keywords = ["partage", "jeux", "sondages", "récompenses", "déplacements", "tâches"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Trouvez votre opportunité
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Entrez des mots-clés pour découvrir les opportunités qui vous correspondent
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="space-y-4"
            aria-label="Formulaire de recherche d'opportunités"
          >
            <label htmlFor="search" className="sr-only">
              Rechercher une opportunité
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="search"
                type="text"
                placeholder="Ex: jeux, sondages, partage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-border/50 focus:border-primary"
                aria-describedby="search-help"
                aria-label="Rechercher une opportunité"
              />
            </div>
            <p id="search-help" className="sr-only">
              Tapez un mot-clé puis appuyez sur Rechercher.
            </p>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-lg"
              aria-label="Lancer la recherche"
            >
              Rechercher
            </Button>
          </form>

          <div className="bg-gradient-card shadow-card rounded-lg p-6 border border-border/50">
            <h2 className="font-semibold text-foreground mb-3">Suggestions de recherche :</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => setSearchTerm(keyword)}
                  className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-sm"
                  aria-label={`Utiliser le mot-clé ${keyword}`}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recherche;
