import { Link, useLocation } from "react-router-dom";
import { Search, Info, List, LogIn, Settings, History } from "lucide-react";
import PiggyLogo from "@/assets/piggy.png";

export const Header = () => {
  const location = useLocation();

  const baseBtn =
    "flex items-center justify-center p-3 rounded-xl transition-all duration-200";
  const inactive = "text-muted-foreground hover:text-foreground hover:bg-secondary";
  const active = "bg-primary text-primary-foreground shadow-md";

  return (
    <header className="border-b border-border/30 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Accueil">
            <img src={PiggyLogo} alt="Logo cochon" className="h-10 w-10 sm:h-12 sm:w-12" />
          </Link>

          <nav className="flex gap-2 sm:gap-3">
            <Link
              to="/recherche"
              title="Recherche"
              aria-label="Recherche"
              aria-current={location.pathname === "/recherche" ? "page" : undefined}
              className={`${baseBtn} ${location.pathname === "/recherche" ? active : inactive}`}
            >
              <Search className="h-6 w-6" />
            </Link>

            <Link
              to="/opportunites/toutes"
              title="Toutes les opportunités"
              aria-label="Toutes les opportunités"
              aria-current={location.pathname === "/opportunites/toutes" ? "page" : undefined}
              className={`${baseBtn} ${location.pathname === "/opportunites/toutes" ? active : inactive}`}
            >
              <List className="h-6 w-6" />
            </Link>

            <Link
              to="/a-propos"
              title="À propos"
              aria-label="À propos"
              aria-current={location.pathname === "/a-propos" ? "page" : undefined}
              className={`${baseBtn} ${location.pathname === "/a-propos" ? active : inactive}`}
            >
              <Info className="h-6 w-6" />
            </Link>

            <Link
              to="/connexion"
              title="Connexion"
              aria-label="Connexion"
              aria-current={location.pathname === "/connexion" ? "page" : undefined}
              className={`${baseBtn} ${location.pathname === "/connexion" ? active : inactive}`}
            >
              <LogIn className="h-6 w-6" />
            </Link>

            <Link
              to="/parametres"
              title="Paramètres"
              aria-label="Paramètres"
              aria-current={location.pathname === "/parametres" ? "page" : undefined}
              className={`${baseBtn} ${location.pathname === "/parametres" ? active : inactive}`}
            >
              <Settings className="h-6 w-6" />
            </Link>

            <Link
              to="/historique"
              title="Historique"
              aria-label="Historique"
              aria-current={location.pathname === "/historique" ? "page" : undefined}
              className={`${baseBtn} ${location.pathname === "/historique" ? active : inactive}`}
            >
              <History className="h-6 w-6" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};