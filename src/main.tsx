import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isSupabaseConfigured } from "@/lib/supabase";
import { logger } from "@/lib/logger";

// Vérifier la configuration au démarrage en production
if (import.meta.env.PROD && !isSupabaseConfigured) {
  logger.error('Configuration Supabase manquante en production');
  
  // Afficher un message d'erreur à l'utilisateur
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; background: #f9fafb;">
        <div style="max-width: 500px; text-align: center; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <svg style="width: 64px; height: 64px; margin: 0 auto 24px; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h1 style="color: #ef4444; margin-bottom: 16px; font-size: 24px; font-weight: bold;">Configuration Manquante</h1>
          <p style="color: #6b7280; margin-bottom: 24px; line-height: 1.6;">
            L'application n'est pas correctement configurée. 
            Les variables d'environnement Supabase sont manquantes.
          </p>
          <p style="color: #9ca3af; font-size: 14px; font-family: monospace;">
            Code d'erreur: SUPABASE_CONFIG_MISSING
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
            Veuillez contacter l'administrateur du site.
          </p>
        </div>
      </div>
    `;
  }
  
  // Arrêter l'exécution
  throw new Error('Supabase configuration missing in production');
}

// Logger le démarrage de l'application
logger.info('Application démarrée', {
  mode: import.meta.env.MODE,
  supabaseConfigured: isSupabaseConfigured,
});

createRoot(document.getElementById("root")!).render(<App />);