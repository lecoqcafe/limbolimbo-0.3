import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Info, List, LogIn, Settings, History, LogOut, User } from "lucide-react";
import PiggyLogo from "@/assets/piggy.png";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const baseBtn =
    "flex items-center justify-center p-3 rounded-xl transition-all duration-200";
  const inactive = "text-muted-foreground hover:text-foreground hover:bg-secondary";
  const active = "bg-primary text-primary-foreground shadow-md";

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  return (
    <header className="border-b border-border/30 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Accueil">
            <img src={PiggyLogo} alt="Logo cochon" className="h-10 w-10 sm:h-12 sm:w-12" />
          </Link>

          <nav className="flex gap-2 sm:gap-3 items-center">
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

            {/* Affichage conditionnel selon l'état de connexion */}
            {user ? (
              // Menu utilisateur connecté
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`${baseBtn} ${
                      ["/parametres", "/historique"].includes(location.pathname) ? active : inactive
                    }`}
                    title="Mon compte"
                    aria-label="Mon compte"
                  >
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Mon compte</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/parametres")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/historique")}>
                    <History className="mr-2 h-4 w-4" />
                    Historique
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Bouton connexion pour utilisateur non connecté
              <Link
                to="/connexion"
                title="Connexion"
                aria-label="Connexion"
                aria-current={location.pathname === "/connexion" ? "page" : undefined}
                className={`${baseBtn} ${location.pathname === "/connexion" ? active : inactive}`}
              >
                <LogIn className="h-6 w-6" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};