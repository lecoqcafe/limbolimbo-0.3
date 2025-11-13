import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Info, FileText, Scale } from 'lucide-react';

export function AboutSection() {
  // Récupérer la version depuis le package.json ou version.json
  const appVersion = "v0.3.611"; // Sera mis à jour automatiquement

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          À propos
        </CardTitle>
        <CardDescription>
          Informations sur l'application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Version de l'app */}
        <div className="flex items-center gap-3">
          <Info className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Version de l'application</p>
            <p className="text-sm text-muted-foreground">{appVersion}</p>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-medium">Documents légaux</p>
          
          <div className="flex flex-col gap-2">
            <Link to="/conditions">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Conditions d'utilisation
              </Button>
            </Link>
            
            <Link to="/apropos">
              <Button variant="outline" className="w-full justify-start">
                <Scale className="h-4 w-4 mr-2" />
                Politique de confidentialité
              </Button>
            </Link>
          </div>
        </div>

        {/* Informations additionnelles */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            © 2024 LimboLimbo. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Développé avec ❤️ pour les opportunités d'affaires
          </p>
        </div>
      </CardContent>
    </Card>
  );
}