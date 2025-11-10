import React from "react";
import { Link } from "react-router-dom";

export default function Parametres() {
  const connected = false; // Placeholder: connexion non implémentée (v0.3.106)

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Paramètres</h1>

      {connected ? (
        <section className="space-y-2">
          <p>Vos paramètres apparaîtront ici.</p>
        </section>
      ) : (
        <section className="space-y-3">
          <p className="text-muted-foreground">
            Vous n’êtes pas connecté. Les paramètres personnalisés seront
            disponibles après connexion.
          </p>

          <button
            type="button"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground opacity-60 cursor-not-allowed"
            aria-disabled="true"
            disabled
            title="Connexion non disponible dans cette version"
          >
            Se connecter
          </button>

          <p className="text-sm text-muted-foreground">
            Astuce: revenez plus tard lorsque la connexion sera disponible.
          </p>

          <p className="text-sm">
            Retour à l’<Link to="/" className="underline">Accueil</Link>
          </p>
        </section>
      )}
    </main>
  );
}
