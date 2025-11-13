import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Les variables d\'environnement Supabase ne sont pas configurées. ' +
    'Veuillez créer un fichier .env.local à la racine du projet avec ' +
    'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY. ' +
    'Consultez README-SUPABASE.md pour plus d\'informations.'
  );
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});

// Export des types pour TypeScript
export type { User, Session, AuthError } from '@supabase/supabase-js';