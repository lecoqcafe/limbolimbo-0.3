import { Link, useLocation } from "react-router-dom";
import { Home, Search, Info } from "lucide-react";
import PiggyLogo from "@/assets/Piggy.png";

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
            <img src={PiggyLogo} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
            <h1 className="text-2xl font-bold text-foreground">LIMBOLIMBO</h1>
          </Link>

          <nav className="flex gap-2 sm:gap-3">
            <Link
              to="/"
              title="Accueil"
              aria-label="Accueil"
              aria-current={location.pathname === "/" ? "page" : undefined}
              className={`${baseBtn} ${location.pathname === "/" ? active : inactive}`}
            >
              <Home className="h-6 w-6" />
            </Link>

            <Link
              to="/recherche"
              title="Recherche"
              aria-label="Recherche"
              aria-current={location.pathname === "/recherche" ? "page" : undefined}
              className={`${baseBtn} ${
                location.pathname === "/recherche" ? active : inactive
              }`}
            >
              <Search className="h-6 w-6" />
            </Link>

            <Link
              to="/a-propos"
              title="À propos"
              aria-label="À propos"
              aria-current={location.pathname === "/a-propos" ? "page" : undefined}
              className={`${baseBtn} ${
                location.pathname === "/a-propos" ? active : inactive
              }`}
            >
              <Info className="h-6 w-6" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
