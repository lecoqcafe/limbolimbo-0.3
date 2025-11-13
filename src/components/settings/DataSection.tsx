import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Trash2, AlertTriangle, FileJson, FileSpreadsheet } from 'lucide-react';
import { useDataExport } from '@/hooks/useDataExport';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function DataSection() {
  const { downloadUserData } = useDataExport();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleExportData = async (format: 'json' | 'csv' = 'json') => {
    setIsExporting(true);
    try {
      // Simuler un délai pour l'effet de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      downloadUserData(format);
      
      toast({
        title: "Export réussi",
        description: `Vos données ont été exportées au format ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export de vos données.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteWarning) {
      setShowDeleteWarning(true);
      return;
    }

    // TODO: Implémenter la suppression du compte
    if (confirm('Êtes-vous absolument certain ? Cette action est irréversible.')) {
      alert('Fonctionnalité de suppression sera implémentée prochainement');
      setShowDeleteWarning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Données
        </CardTitle>
        <CardDescription>
          Gérez vos données personnelles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exporter les données */}
        <div className="flex items-center gap-3">
          <Download className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Exporter mes données</p>
            <p className="text-xs text-muted-foreground mt-1">
              Téléchargez toutes vos données au format de votre choix
            </p>
            <div className="flex gap-2 mt-3">
              <Button 
                onClick={() => handleExportData('json')}
                disabled={isExporting}
                variant="outline"
                className="flex-1"
              >
                <FileJson className="h-4 w-4 mr-2" />
                {isExporting ? 'Exportation...' : 'JSON'}
              </Button>
              <Button 
                onClick={() => handleExportData('csv')}
                disabled={isExporting}
                variant="outline"
                className="flex-1"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {isExporting ? 'Exportation...' : 'CSV'}
              </Button>
            </div>
          </div>
        </div>

        {/* Supprimer le compte */}
        <div className="flex items-center gap-3">
          <Trash2 className="h-4 w-4 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">Supprimer mon compte</p>
            <p className="text-xs text-muted-foreground mt-1">
              Action irréversible - toutes vos données seront perdues
            </p>
            
            {showDeleteWarning && (
              <Alert className="mt-3 border-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  La suppression de votre compte est permanente. Vos données, 
                  historique et préférences seront définitivement perdus.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleDeleteAccount}
              variant="destructive"
              className="mt-3"
            >
              {showDeleteWarning ? 'Confirmer la suppression' : 'Supprimer mon compte'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}