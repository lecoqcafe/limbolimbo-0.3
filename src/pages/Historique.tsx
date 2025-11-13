import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Clock } from 'lucide-react';

export default function Historique() {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Historique</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Votre activité
            </CardTitle>
            <CardDescription>
              Connecté en tant que {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <p className="text-sm">
                Aucune activité enregistrée pour le moment
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités à venir</CardTitle>
            <CardDescription>
              Cette page sera enrichie prochainement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              L'historique de vos activités sera disponible dans une prochaine version.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}