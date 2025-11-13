import { User } from '@supabase/supabase-js';

// Type pour l'état d'authentification
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Type pour les données d'inscription
export interface SignUpData {
  email: string;
  password: string;
}

// Type pour les données de connexion
export interface SignInData {
  email: string;
  password: string;
}

// Type pour la réinitialisation de mot de passe
export interface ResetPasswordData {
  email: string;
}

// Type pour le contexte d'authentification
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  clearError: () => void;
}