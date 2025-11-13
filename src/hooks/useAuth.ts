import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Hook personnalisé pour accéder facilement au contexte d'authentification
 * 
 * @example
 * const { user, signIn, signOut } = useAuth();
 * 
 * if (user) {
 *   console.log('Utilisateur connecté:', user.email);
 * }
 */
export function useAuth() {
  return useAuthContext();
}