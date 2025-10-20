import { Link, useLocation } from "react-router-dom";
import { Home, Search } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  
  return (
    <header className="border-b border-border/30 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              LIMBOLIMBO
            </h1>
          </Link>
          <nav className="flex gap-2 sm:gap-3">
            <Link 
              to="/"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <Link 
              to="/recherche"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 ${
                location.pathname === '/recherche' 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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