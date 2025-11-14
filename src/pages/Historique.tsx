import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { History, Clock, AlertCircle, Search, Filter, Download, Trash2, Eye, MousePointer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserActivity } from '@/lib/userActivity';
import { useState, useMemo } from 'react';
import ActivityCard from '@/components/ActivityCard';

export default function Historique() {
  const { user } = useAuth();
  const { 
    getActivities, 
    getVisits, 
    getClics, 
    searchActivities, 
    clearHistory, 
    exportJSON, 
    exportCSV 
  } = useUserActivity();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'visit' | 'click'>('all');
  const [activities, setActivities] = useState(getActivities());

  // Mettre à jour les activités quand le composant monte
  useState(() => {
    setActivities(getActivities());
  });

  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filtrer par type
    if (filterType === 'visit') {
      filtered = getVisits();
    } else if (filterType === 'click') {
      filtered = getClics();
    }

    // Filtrer par recherche
    if (searchTerm.trim()) {
      filtered = searchActivities(searchTerm.trim());
    }

    return filtered;
  }, [activities, filterType, searchTerm, getVisits, getClics, searchActivities]);

  const handleClearHistory = async () => {
    if (confirm('Êtes-vous sûr de vouloir effacer tout votre historique ? Cette action est irréversible.')) {
      const success = clearHistory();
      if (success) {
        setActivities([]);
      } else {
        alert('Erreur lors de la suppression de l\'historique');
      }
    }
  };

  const handleExportJSON = () => {
    const data = exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `limbolimbo-historique-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const data = exportCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `limbolimbo-historique-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpportunityClick = (opportunityId: string) => {
    // Naviguer vers la page de l'opportunité
    window.open(`/opportunite?id=${opportunityId}`, '_blank');
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Historique</h1>
        
        <div className="grid gap-6 max-w-2xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentification non configurée</AlertTitle>
            <AlertDescription>
              L'authentification n'est pas encore activée sur ce site. 
              Cette page sera fonctionnelle une fois l'authentification configurée.
            </AlertDescription>
          </Alert>

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

  const stats = {
    total: activities.length,
    visits: getVisits().length,
    clics: getClics().length
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <History className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Historique</h1>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Activités</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Visites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-500">{stats.visits}</p>
              <p className="text-sm text-muted-foreground">Pages vues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-green-500" />
                Clics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">{stats.clics}</p>
              <p className="text-sm text-muted-foreground">Liens cliqués</p>
            </CardContent>
          </Card>
        </div>

        {/* Contrôles */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche et filtres</CardTitle>
            <CardDescription>
              Connecté en tant que {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une opportunité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filterType === 'all' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilterType('all')}
              >
                <Filter className="h-3 w-3 mr-1" />
                Tout ({stats.total})
              </Badge>
              <Badge
                variant={filterType === 'visit' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilterType('visit')}
              >
                <Eye className="h-3 w-3 mr-1" />
                Visites ({stats.visits})
              </Badge>
              <Badge
                variant={filterType === 'click' ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setFilterType('click')}
              >
                <MousePointer className="h-3 w-3 mr-1" />
                Clics ({stats.clics})
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleExportJSON}>
                <Download className="h-4 w-4 mr-2" />
                Exporter JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearHistory}>
                <Trash2 className="h-4 w-4 mr-2" />
                Vider l'historique
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des activités */}
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <p>
                  {searchTerm || filterType !== 'all' 
                    ? 'Aucune activité trouvée pour ces critères' 
                    : 'Aucune activité enregistrée pour le moment'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
            </p>
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onOpportunityClick={handleOpportunityClick}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}