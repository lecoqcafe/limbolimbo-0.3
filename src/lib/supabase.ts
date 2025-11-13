import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification si Supabase est configuré
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Création du client Supabase (null si non configuré)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Stockage de la session dans localStorage pour persistance
        storage: window.localStorage,
        // Détection automatique de la session
        autoRefreshToken: true,
        // Persistance de la session entre les rechargements
        persistSession: true,
        // Détection des changements de session (multi-onglets)
        detectSessionInUrl: true,
      },
    })
  : null;

// Export des types pour TypeScript
export type { User, Session, AuthError } from '@supabase/supabase-js';