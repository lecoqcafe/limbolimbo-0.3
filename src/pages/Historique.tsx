import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getForDisplay, type HistoryItem } from '@/lib/history';
import { loadOpportunities } from '@/lib/csvParser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Piggy from '@/assets/piggy.png';

// Icône Lucide "Eye" inline
function EyeIcon({ className, title = 'Vu' }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
      title={title}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

// Icône "Mouse Pointer Click" inline (style Lucide)
function ClickIcon({ className, title = 'Cliqué' }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
      title={title}
    >
      {/* Pointeur */}
      <path d="M3 3l7 18 2-7 7-2L3 3z"></path>
      {/* Lignes de clic */}
      <path d="M14 14l7 7"></path>
      <path d="M16 8l4-4"></path>
      <path d="M12 6V2"></path>
      <path d="M6 12H2"></path>
    </svg>
  );
}

export default function Historique() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [titleMap, setTitleMap] = useState<Map<number, string>>(new Map());

  // Chargement de la liste (25 max, triée par dernière activité) pour l'utilisateur connecté
  useEffect(() => {
    if (!user?.id) return;
    setItems(getForDisplay(user.id, 25));
  }, [user?.id]);

  // Fallback titres depuis /public/data/opp_id.csv (lecture seule)
  useEffect(() => {
    const run = async () => {
      try {
        const opps = await loadOpportunities();
        const map = new Map<number, string>();
        for (const o of opps) {
          const idNum = Number(o.opp_ID);
          if (Number.isFinite(idNum) && o.Opportunité?.trim()) {
            map.set(idNum, o.Opportunité.trim());
          }
        }
        setTitleMap(map);
      } catch {
        // Silencieux
      }
    };
    run();
  }, []);

  // Affichage d'un titre robuste: priorité à l'item; repli CSV; sinon libellé neutre
  const displayRows = useMemo(() => {
    return items.map((it) => {
      const t = (it.title ?? '').trim();
      const fallback = titleMap.get(it.id) ?? '';
      const title = t || fallback || `Opportunité #${it.id}`;
      return { ...it, displayTitle: title };
    });
  }, [items, titleMap]);

  // Non connecté: message + bouton (pas de redirection automatique)
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Historique</h1>
        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Veuillez vous connecter</CardTitle>
              <CardDescription>Connectez-vous pour voir votre historique d’opportunités.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Button asChild>
                <Link to="/connexion" aria-label="Aller à la page de connexion" title="Se connecter">
                  Se connecter
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/" aria-label="Retour à l’accueil" title="Retour à l’accueil">
                  Retour à l’accueil
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Connecté: liste unique 4 colonnes [Titre][piggy][œil][clic]
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Historique</h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Votre activité</CardTitle>
          <CardDescription>
            Les opportunités récemment vues ou cliquées. Affichage limité à 25 éléments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune activité enregistrée pour le moment.</p>
          ) : (
            <div className="divide-y divide-border">
              {displayRows.map((row) => {
                const clicked = row.status === 2;
                const clickClasses = clicked ? 'text-foreground' : 'text-muted-foreground opacity-35';
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1fr,48px,48px,48px] items-center gap-2 py-3"
                  >
                    {/* Colonne 1: Titre (texte seul) */}
                    <div className="truncate pr-2" title={row.displayTitle} aria-label={row.displayTitle}>
                      {row.displayTitle}
                    </div>

                    {/* Colonne 2: Icône “piggy” (ouvre l’opportunité dans le même onglet) */}
                    <div className="flex items-center justify-center">
                      <Link
                        to={row.route || `/opportunite?id=${row.id}`}
                        aria-label="Ouvrir l’opportunité"
                        title="Ouvrir l’opportunité"
                        className="inline-flex"
                      >
                        <img
                          src={Piggy}
                          alt=""
                          className="w-6 h-6 object-contain"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>

                    {/* Colonne 3: Icône “œil” (toujours clair, statut ≥ 1) */}
                    <div className="flex items-center justify-center">
                      <EyeIcon className="w-6 h-6 text-foreground" title="Vu" />
                    </div>

                    {/* Colonne 4: Icône “clic” (gris si jamais cliqué, clair si déjà cliqué) */}
                    <div className="flex items-center justify-center">
                      <ClickIcon className={`w-6 h-6 ${clickClasses}`} title={clicked ? 'Cliqué' : 'Jamais cliqué'} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
