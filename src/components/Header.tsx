import { Link, useLocation } from "react-router-dom";
import { Home, Search } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LIMBOLIMBO
            </h1>
          </Link>
          <nav className="flex gap-4">
            <Link 
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <Link 
              to="/recherche"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                location.pathname === '/recherche' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Recherche</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};