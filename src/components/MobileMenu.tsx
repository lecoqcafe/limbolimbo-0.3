import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, List, Info, LogIn, Settings, History, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const handleNavigation = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-primary text-primary-foreground'
        : 'text-foreground hover:bg-secondary'
    }`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col gap-2 mt-6">
          {/* Liens principaux */}
          <button
            onClick={() => handleNavigation('/recherche')}
            className={linkClass('/recherche')}
          >
            <Search className="h-5 w-5" />
            <span>Recherche</span>
          </button>

          <button
            onClick={() => handleNavigation('/opportunites/toutes')}
            className={linkClass('/opportunites/toutes')}
          >
            <List className="h-5 w-5" />
            <span>Toutes les opportunités</span>
          </button>

          <button
            onClick={() => handleNavigation('/a-propos')}
            className={linkClass('/a-propos')}
          >
            <Info className="h-5 w-5" />
            <span>À propos</span>
          </button>

          {/* Séparateur si Supabase configuré */}
          {isSupabaseConfigured && (
            <>
              <Separator className="my-2" />

              {user ? (
                // Menu utilisateur connecté
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium">Mon compte</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => handleNavigation('/parametres')}
                    className={linkClass('/parametres')}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Paramètres</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/historique')}
                    className={linkClass('/historique')}
                  >
                    <History className="h-5 w-5" />
                    <span>Historique</span>
                  </button>

                  <Separator className="my-2" />

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                // Bouton connexion si non connecté
                <button
                  onClick={() => handleNavigation('/connexion')}
                  className={linkClass('/connexion')}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Connexion</span>
                </button>
              )}
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}