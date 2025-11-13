import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthContextType, SignUpData, SignInData, ResetPasswordData } from '@/types/auth';
import { toast } from 'sonner';

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider du contexte d'authentification
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérification de la session au chargement
  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Nettoyage de l'abonnement
    return () => subscription.unsubscribe();
  }, []);

  // Fonction d'inscription
  const signUp = async ({ email, password }: SignUpData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Compte créé avec succès !', {
          description: 'Vérifiez votre email pour confirmer votre compte.',
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue lors de l\'inscription.';
      setError(errorMessage);
      toast.error('Erreur d\'inscription', {
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion
  const signIn = async ({ email, password }: SignInData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Connexion réussie !', {
          description: `Bienvenue ${data.user.email}`,
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Email ou mot de passe incorrect.';
      setError(errorMessage);
      toast.error('Erreur de connexion', {
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      toast.success('Déconnexion réussie', {
        description: 'À bientôt !',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue lors de la déconnexion.';
      setError(errorMessage);
      toast.error('Erreur de déconnexion', {
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de réinitialisation de mot de passe
  const resetPassword = async ({ email }: ResetPasswordData) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Email envoyé !', {
        description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue lors de l\'envoi de l\'email.';
      setError(errorMessage);
      toast.error('Erreur', {
        description: errorMessage,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personnalisé pour utiliser le contexte
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}