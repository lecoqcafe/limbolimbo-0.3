import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Composant pour protéger les routes nécessitant une authentification
 * Redirige vers /connexion si l'utilisateur n'est pas connecté
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de la session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!user) {
    // Sauvegarder l'URL actuelle pour rediriger après connexion
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  // Afficher le contenu protégé si authentifié
  return <>{children}</>;
}