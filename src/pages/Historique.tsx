import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Clock, AlertCircle, Eye, MousePointer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserActivity } from '@/lib/userActivity';
import { useState, useMemo } from 'react';

export default function Historique() {
  const { user } = useAuth();
  const { getActivities, clearHistory } = useUserActivity();
  const [activities, setActivities] = useState(getActivities());

  // Mettre à jour les activités quand le composant monte
  useState(() => {
    setActivities(getActivities());
  });

  // Grouper les activités par opportunité pour afficher l'état combiné
  const groupedActivities = useMemo(() => {
    const grouped = new Map();
    
    activities.forEach(activity => {
      const key = activity.opportunityId;
      if (!grouped.has(key)) {
        grouped.set(key, {
          opportunityId: activity.opportunityId,
          title: activity.opportunityTitle,
          category: activity.category,
          hasViewed: false,
          hasVisited: false,
          lastActivity: activity.timestamp
        });
      }
      
      const item = grouped.get(key);
      if (activity.activityType === 'view') {
        item.hasViewed = true;
      } else if (activity.activityType === 'visit') {
        item.hasVisited = true;
      }
      
      if (activity.timestamp > item.lastActivity) {
        item.lastActivity = activity.timestamp;
      }
    });
    
    return Array.from(grouped.values()).sort((a, b) => b.lastActivity - a.lastActivity);
  }, [activities]);

  const handleClearHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout votre historique?')) {
      clearHistory();
      setActivities([]);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connexion requise</AlertTitle>
          <AlertDescription>
            Vous devez être connecté pour voir votre historique d'activités.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Service non configuré</AlertTitle>
          <AlertDescription>
            Le service d'authentification n'est pas configuré correctement.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8" />
            Historique
          </h1>
          <p className="text-muted-foreground mt-2">
            Vos activités sur les opportunités
          </p>
        </div>
        
        {activities.length > 0 && (
          <Button variant="destructive" onClick={handleClearHistory}>
            Effacer l'historique
          </Button>
        )}
      </div>

      {groupedActivities.length === 0 ? (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Aucune activité</AlertTitle>
          <AlertDescription>
            Vous n'avez pas encore consulté d'opportunités.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {groupedActivities.map((item) => (
            <Card key={item.opportunityId}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>
                      {item.category} • {new Date(item.lastActivity).toLocaleDateString('fr-CA')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {item.hasViewed && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Vue
                      </Badge>
                    )}
                    {item.hasVisited && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MousePointer className="h-3 w-3" />
                        Visitée
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}