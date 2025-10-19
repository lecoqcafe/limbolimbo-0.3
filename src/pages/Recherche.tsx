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
    if (searchTerm.trim()) {
      navigate(`/opportunites-personnalisees?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Trouvez votre opportunité
            </h2>
            <p className="text-lg text-muted-foreground">
              Entrez des mots-clés pour découvrir les opportunités qui vous correspondent
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ex: jeux, sondages, partage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-border/50 focus:border-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-opacity text-lg"
            >
              Rechercher
            </Button>
          </form>

          <div className="bg-gradient-card shadow-card rounded-lg p-6 border border-border/50">
            <h3 className="font-semibold text-foreground mb-3">Suggestions de recherche :</h3>
            <div className="flex flex-wrap gap-2">
              {["partage", "jeux", "sondages", "récompenses", "déplacements", "tâches"].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setSearchTerm(keyword)}
                  className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-sm"
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